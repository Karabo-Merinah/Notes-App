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
            {/* display the saved notes from list  */}
            <FlatList data={savedNotes} keyExtractor={(item) => item.id} renderItem={({ item }) => (
                <View style={styles.notes}>
                    {/* show the editing form for the selected note id  */}
                    {findId === item.id ? (

                        <View>
                            <Text>Title</Text>
                            <TextInput value={title} onChangeText={setTitle} style={styles.input} />
                            <Text>Content</Text>
                            <TextInput value={content} onChangeText={setContent} multiline style={styles.input} />
                            <Text>Category</Text>
                            <TextInput value={category} onChangeText={setCategory} multiline style={styles.input} />
                            <Pressable onPress={() => setFindId("")}>
                                <Text>Cancel</Text>
                            </Pressable>
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
                        <Text style={styles.notes}>You currently have no notes saved.</Text>
                        <StickyNoteX size={100} aria-label="delete" />
                        <AddNotes />
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

    }
})
