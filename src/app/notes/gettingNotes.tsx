import type { Note } from "@/types/notes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StickyNoteX } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Alert, FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import AddNotes from "./addNotes";

export default function getNotes() {

    const [savedNotes, setSavedNotes] = useState<Note[]>([])
    const [findId, setFindId] = useState("")
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [category, setCategory] = useState("")
    const [contentError, setContentError] = useState("")
    const [categoryError, setCategoryError] = useState("")
    const [titleError, setTitleError] = useState("")
    const [searchTerm, setSearchTerm] = useState("")


    //saved notes from storage
    const fetchNotes = async () => {
        try {
            const data = await AsyncStorage.getItem("notes")

            if (data !== null) {
                //convert the string back to array
                const notes = JSON.parse(data)
                //update the notes displayed on the screen 
                setSavedNotes(notes)
            }
        }
        catch (error) {
            console.log(error)
            Alert.alert("Could not get the notes.")

        }
    }

    //delete a note using the id 
    const deleteNote = async (id: string) => {

        try {
            //removes the id that matches with the received one
            const updatedList = savedNotes.filter((note) => note.id !== id)

            //stores the updated list back to the storage by converting the list back to string
            await AsyncStorage.setItem("notes", JSON.stringify(updatedList))

            //show the updated notes
            setSavedNotes(updatedList)
        }
        catch (error) {
            console.log(error)
            Alert.alert("Error", "Could not delete the note.")
        }
    }

    //find the selected note for updating 
    const updateNote = async (id: string) => {
        try {
            //find the notes using the provided id 
            const findNote = savedNotes.find((note) => note.id === id)

            //displaying the note error if it does not exist 
            if (!findNote) {
                Alert.alert("Error", "Could not find the note.")
                return
            }

            setFindId(findNote.id)
            //retrive the existing data to display in the input field 
            setTitle(findNote.title || "")
            setContent(findNote.content)
            setCategory(findNote.category)

            setTitleError("")
            setCategoryError("")
            setContentError("")

        }
        catch (error) {
            console.log(error)
            Alert.alert("Error", "Could not update the note ")
        }
    }

    //show confirmation dialog before deleting the note
    const showAlert = (id: string) => {
        Alert.alert('Confirmation ', 'Are you sure you want to delete this note?', [
            { text: 'Cancel', style: 'cancel', onPress: () => console.log('Cancel is pressed') },
            { text: 'Delete', style: 'destructive', onPress: () => deleteNote(id) }
        ])
    }

    //filters the notes based on the search term 
    const searchNotes = savedNotes.filter((notes) => {
        //split the search term with empty space to retrieve words
        const searchWords = searchTerm.toLowerCase().trim().split(" ")

        //formulates the search 
        const text = `${notes.title || ""} ${notes.content} ${notes.category}`.toLowerCase()

        //loops through search words
        for (let word of searchWords) {
            //if a word is not found then we exclude the note
            if (!text.includes(word)) {
                return false
            }
        }
        //if all words are matched take the note
        return true
    })

    const saveNotesChanges = async () => {
        try {
            let isValid = true
            //validate the updated note information 
            if (content.trim() === "" || content.length > 500) {
                setContentError("Content of the note is required and must maximum of 500 characters.")
                isValid = false
            }
            else {
                setContentError("")
            }
            if (category.trim() === "") {
                setCategoryError("Category of the note is required.")
                isValid = false
            }
            else {
                setCategoryError("")
            }
            if (title.trim() !== "" && title.length > 50) {
                setTitleError("Title should not exceed 50 characters.")
                isValid = false
            }
            else {
                setTitleError("")
            }
            //stop saving the data when it is invalid
            if (!isValid) {
                return
            }
            //update the selected note 
            const updateNotes = savedNotes.map((note) => {
                if (note.id === findId) {
                    return {
                        ...note, title: title.trim(),
                        content: content.trim(), category: category.trim()
                    }
                }
                //unchanged note remain the same 
                return note
            })

            //save the updated notes in storage 
            await AsyncStorage.setItem("notes", JSON.stringify(updateNotes))
            //display the updated notes
            setSavedNotes(updateNotes)
            //close the editing form 
            setFindId("")

            Alert.alert("Success", "Note updated successfully.")
        }
        catch (error) {
            console.log(error)
            Alert.alert("Error", "Could not save changes.")
        }
    }
    //retrive saved notes when the screen is displayed

    useEffect(() => {
        fetchNotes()
    }, [])

    return (
        <View>
            {/* get the saved notes  */}
            <Pressable onPress={fetchNotes}>
                <Text style={styles.button}>View all notes </Text>
            </Pressable>
            <TextInput value={searchTerm} onChangeText={setSearchTerm} placeholder="Search your notes here " placeholderTextColor={'#717171'} />
            {/* display the saved notes from list  */}
            <FlatList data={searchNotes} keyExtractor={(item) => item.id} renderItem={({ item }) => (
                <View style={styles.notes}>
                    {/* show the editing form for the selected note id  */}
                    {findId === item.id ? (

                        <View>
                            <Text>Title</Text>
                            <TextInput value={title} onChangeText={setTitle} style={styles.input} />
                            {titleError !== "" && (
                                <Text style={styles.error}>{titleError}</Text>
                            )}
                            <Text>Content</Text>
                            <TextInput value={content} onChangeText={setContent} multiline style={styles.input} />
                            {contentError !== "" && (
                                <Text style={styles.error}>{contentError}</Text>
                            )}
                            <Text>Category</Text>
                            <TextInput value={category} onChangeText={setCategory} multiline style={styles.input} />
                            {categoryError !== "" && (
                                <Text style={styles.error}>{categoryError}</Text>
                            )}
                            <View style={styles.cancel_save}>
                                <Pressable onPress={() => setFindId("")}>
                                    <Text>Cancel</Text>
                                </Pressable>
                                <Pressable style={styles.editButton} onPress={saveNotesChanges}>
                                    <Text style={styles.editText}>Save Changes</Text>
                                </Pressable>
                            </View>
                        </View>
                    ) : (
                        <View>
                            <Text>{item?.title}</Text>
                            <Text>{item.content}</Text>
                            <Text>{item.category}</Text>
                            <Text>{new Date(item.createdAt).toLocaleDateString()}</Text>
                            <Pressable style={styles.editButton} onPress={() => updateNote(item.id)}>
                                <Text style={styles.editText}>Edit Note</Text>
                            </Pressable>
                            <Pressable style={styles.deletebutton} onPress={() => showAlert(item.id)}>
                                <Text style={styles.deleteText}>Delete a note</Text>
                            </Pressable>
                        </View>
                    )}

                </View>

            )}
                ListEmptyComponent={
                    <View>
                        {searchTerm.trim() !== "" ? (
                            //show when search has no matching notes 
                            <Text>No matching notes found for {searchTerm}</Text>
                        ) : (
                            //show empty state when user doesn't have any notes saved.
                            <View>
                                <Text style={styles.notes}>You currently have no notes saved.</Text>
                                <StickyNoteX size={100} aria-label="delete" />
                                <AddNotes />
                            </View>
                        )}
                    </View>
                }
            />
        </View>
    )

}

const styles = StyleSheet.create({
    button: {

    },
    notes: {

    },
    input: {

    },
    deletebutton: {
        backgroundColor: "red",
        padding: 12,
        borderRadius: 8,
        marginTop: 10,
        alignItems: "center"
    },
    deleteText: {
        color: "#FDFDFD",
        fontSize: 16,
        fontWeight: "bold"
    },
    editButton: {

    },
    editText: {

    },
    error: {
        color: 'red'
    },
    cancel_save: {
        flexDirection: 'row',
        gap: 10
    }
})
