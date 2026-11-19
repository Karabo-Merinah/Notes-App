
import { type Note } from "@/types/notes"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useLocalSearchParams } from "expo-router"
import { useEffect, useState } from "react"
import { Alert, FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native"

export default function CategoryNotes() {

    const params = useLocalSearchParams()
    const category = params.category as string
    const searchTerm = (params.search as string) || ""
    const sortOrder = (params.sort as string) || "descending"

    const [notes, setNotes] = useState<Note[]>([])
    const [findId, setFindId] = useState("")
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [editCategory, setEditCategory] = useState("")
    const [titleError, setTitleError] = useState("")
    const [contentError, setContentError] = useState("")
    const [categoryError, setCategoryError] = useState("")

    // get saved notes
    const getNotes = async () => {
        try {
            const data = await AsyncStorage.getItem("notes")

            if (data !== null) {
                setNotes(JSON.parse(data))
            }
            else {
                setNotes([])
            }
        }
        catch (error) {
            console.log(error)
        }
    }

    // load notes when the page opens
    useEffect(() => {
        getNotes()
    }, [])

    // find the selected note and display its details for editing
    const updateNote = (id: string) => {
        const findNote = notes.find((note) => note.id === id)

        if (!findNote) {
            Alert.alert("Error", "Could not find the note.")
            return
        }

        setFindId(findNote.id)
        setTitle(findNote.title || "")
        setContent(findNote.content)
        setEditCategory(findNote.category)

        setTitleError("")
        setContentError("")
        setCategoryError("")
    }

    // save the updated note
    const saveNotesChanges = async () => {
        let isValid = true

        // validate title
        if (title.trim() !== "" && title.length > 50) {
            setTitleError("Title should not exceed 50 characters.")
            isValid = false
        }
        else {
            setTitleError("")
        }

        // validate content
        if (content.trim() === "" || content.length > 500) {
            setContentError("Content is required and must not exceed 500 characters.")
            isValid = false
        }
        else {
            setContentError("")
        }

        // validate category
        if (editCategory.trim() === "") {
            setCategoryError("Category is required.")
            isValid = false
        }
        else {
            setCategoryError("")
        }

        if (!isValid) {
            return
        }

        try {
            // update only the selected note
            const updatedNotes = notes.map((note) => {
                if (note.id === findId) {
                    return {
                        ...note,
                        title: title.trim(),
                        content: content.trim(),
                        category: editCategory.trim(),
                        updatedAt: new Date().toISOString()
                    }
                }

                return note
            })

            // save changes to AsyncStorage
            await AsyncStorage.setItem("notes", JSON.stringify(updatedNotes))

            setNotes(updatedNotes)
            setFindId("")

            Alert.alert("Success", "Note updated successfully.")
        }
        catch (error) {
            console.log(error)
            Alert.alert("Error", "Could not save changes.")
        }
    }

    // delete a note using its ID
    const deleteNote = async (id: string) => {
        try {
            const updatedNotes = notes.filter((note) => note.id !== id)

            // save remaining notes
            await AsyncStorage.setItem("notes", JSON.stringify(updatedNotes))

            // update displayed notes
            setNotes(updatedNotes)
        }
        catch (error) {
            console.log(error)
            Alert.alert("Error", "Could not delete the note.")
        }
    }

    // ask for confirmation before deleting
    const showAlert = (id: string) => {
        Alert.alert("Confirmation", "Are you sure you want to delete this note?", [
            { text: "Cancel", style: "cancel" },
            { text: "Delete", style: "destructive", onPress: () => deleteNote(id) }
        ])
    }

    // filter notes by category and search term
    const categoryNotes = notes.filter((note) => {
        if (note.category.trim().toLowerCase() !== category.trim().toLowerCase()) {
            return false
        }

        const searchWords = searchTerm.toLowerCase().trim().split(" ")
        const text = `${note.title || ""} ${note.content} ${note.category}`.toLowerCase()

        for (let word of searchWords) {
            if (!text.includes(word)) {
                return false
            }
        }

        return true
    })

    // sort notes by creation date
    const sortedNotes = categoryNotes.slice().sort((a, b) => {
        if (sortOrder === "ascending") {
            return a.createdAt.localeCompare(b.createdAt)
        }
        else {
            return b.createdAt.localeCompare(a.createdAt)
        }
    })

    return (
        <View style={styles.categoryContainer}>
            <Text style={styles.heading}>{category}</Text>
            <Text style={styles.count}>{sortedNotes.length} {sortedNotes.length === 1 ? "note" : "notes"}</Text>

            <FlatList data={sortedNotes} keyExtractor={(item) => item.id} keyboardShouldPersistTaps="handled" renderItem={({ item }) => (
                <View style={styles.notesCards}>

                    {findId === item.id ? (
                        <View>
                            <Text style={styles.label}>Title</Text>
                            <TextInput style={styles.input} value={title} onChangeText={setTitle} maxLength={51} />
                            {titleError !== "" && <Text style={styles.error}>{titleError}</Text>}

                            <Text style={styles.label}>Content</Text>
                            <TextInput style={[styles.input, styles.contentInput]} value={content} onChangeText={setContent} multiline textAlignVertical="top" maxLength={501} />
                            {contentError !== "" && <Text style={styles.error}>{contentError}</Text>}

                            <Text style={styles.label}>Category</Text>
                            <TextInput style={styles.input} value={editCategory} onChangeText={setEditCategory} />
                            {categoryError !== "" && <Text style={styles.error}>{categoryError}</Text>}

                            <View style={styles.buttons}>
                                <Pressable style={styles.cancelButton} onPress={() => setFindId("")}><Text style={styles.buttonText}>Cancel</Text></Pressable>
                                <Pressable style={styles.editButton} onPress={saveNotesChanges}><Text style={styles.buttonText}>Save Changes</Text></Pressable>
                            </View>
                        </View>
                    ) : (
                        <View>
                            <Text style={styles.title}>{item.title || "Untitled"}</Text>
                            <Text style={styles.content}>{item.content}</Text>
                            <Text style={styles.date}>{new Date(item.createdAt).toLocaleDateString()}</Text>

                            <View style={styles.buttons}>
                                <Pressable style={styles.editButton} onPress={() => updateNote(item.id)}><Text style={styles.buttonText}>Edit</Text></Pressable>
                                <Pressable style={styles.deleteButton} onPress={() => showAlert(item.id)}><Text style={styles.deleteText}>Delete</Text></Pressable>
                            </View>
                        </View>
                    )}

                </View>
            )}
                ListEmptyComponent={
                    <Text style={styles.emptyState}>No matching notes found in this category.</Text>
                }
            />
        </View>
    )
}

const styles = StyleSheet.create({
    categoryContainer: {
        flex: 1,
        padding: 20,
        backgroundColor: "#FFFFFF"
    },
    heading: {
        fontSize: 26,
        fontWeight: "bold",
        color: "#000000",
        marginBottom: 10
    },
    count: {
        fontSize: 15,
        color: "#777777",
        marginBottom: 20
    },
    notesCards: {
        backgroundColor: "#FFF8D6",
        padding: 15,
        borderRadius: 12,
        marginBottom: 12,
        borderLeftWidth: 4,
        borderLeftColor: "#FFCC00"
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#000000",
        marginBottom: 8
    },
    content: {
        fontSize: 15,
        color: "#000000",
        marginBottom: 12
    },
    date: {
        fontSize: 12,
        color: "#777777",
        marginBottom: 15
    },
    label: {
        fontSize: 15,
        fontWeight: "bold",
        color: "#000000",
        marginBottom: 8
    },
    input: {
        borderWidth: 1,
        borderColor: "#DDDDDD",
        borderRadius: 9,
        padding: 12,
        backgroundColor: "#FFFFFF",
        color: "#000000",
        marginBottom: 15
    },
    contentInput: {
        minHeight: 100
    },
    buttons: {
        flexDirection: "row",
        gap: 10,
        marginTop: 10
    },
    editButton: {
        flex: 1,
        backgroundColor: "#FFCC00",
        padding: 12,
        borderRadius: 8,
        alignItems: "center"
    },
    deleteButton: {
        flex: 1,
        backgroundColor: "#000000",
        padding: 12,
        borderRadius: 8,
        alignItems: "center"
    },
    deleteText: {
        color: '#FFFFFF',
        fontWeight: 'bold'
    },
    cancelButton: {
        flex: 1,
        backgroundColor: "#EEEEEE",
        padding: 12,
        borderRadius: 8,
        alignItems: "center"
    },
    buttonText: {
        color: "#000000",
        fontWeight: "bold"
    },
    error: {
        color: "red",
        fontSize: 13,
        marginBottom: 10
    },
    emptyState: {
        textAlign: "center",
        marginTop: 40,
        color: "#777777"
    }
})
