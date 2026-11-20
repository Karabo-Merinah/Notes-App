import { colors, getCategoryColor } from "@/constants/cardColors"
import { type Note } from "@/types/notes"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { router, useLocalSearchParams } from "expo-router"
import { ArrowLeft, CalendarDays, NotebookPen, Pencil, Trash2 } from "lucide-react-native"
import { useEffect, useState } from "react"
import { Alert, FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

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

    // get the same category colour used on the Home page
    const categoryColor = getCategoryColor(category)

    // display the category page without overlapping the phone status bar
    return (
        <SafeAreaView style={styles.categoryContainer} edges={["top", "bottom"]}>

            {/* display the back button, category name and number of notes */}
            <View style={styles.header}>
                <Pressable style={styles.backButton} onPress={() => router.back()}><ArrowLeft size={23} color="#000000" /></Pressable>

                <View style={styles.headerDetails}>
                    <Text style={styles.heading}>{category}</Text>
                    <Text style={styles.count}>{sortedNotes.length} {sortedNotes.length === 1 ? "note" : "notes"}</Text>
                </View>

                <View style={[styles.headerIcon, { backgroundColor: categoryColor }]}>
                    <NotebookPen size={22} color="#000000" />
                </View>
            </View>

            <View style={styles.headingUnderline} />

            {/* display all notes belonging to the selected category */}
            <FlatList
                data={sortedNotes}
                style={styles.notesList}
                contentContainerStyle={styles.listContent}
                keyExtractor={(item) => item.id}
                keyboardShouldPersistTaps="handled"
                renderItem={({ item }) => (
                    <View style={[styles.cardShadow, { backgroundColor: categoryColor }]}>
                        <View style={styles.notesCards}>

                            {/* display the editing form when the selected note is being edited */}
                            {findId === item.id ? (
                                <View>
                                    <Text style={styles.editHeading}>Edit Note</Text>

                                    <Text style={styles.label}>Title</Text>
                                    <TextInput style={styles.input} value={title} onChangeText={setTitle} maxLength={51} placeholder="Enter note title" placeholderTextColor="#999999" />
                                    {titleError !== "" && <Text style={styles.error}>{titleError}</Text>}

                                    <Text style={styles.label}>Content</Text>
                                    <TextInput style={[styles.input, styles.contentInput]} value={content} onChangeText={setContent} multiline textAlignVertical="top" maxLength={501} placeholder="Write your note" placeholderTextColor="#999999" />
                                    {contentError !== "" && <Text style={styles.error}>{contentError}</Text>}

                                    <Text style={styles.label}>Category</Text>
                                    <TextInput style={styles.input} value={editCategory} onChangeText={setEditCategory} placeholder="Enter category" placeholderTextColor="#999999" />
                                    {categoryError !== "" && <Text style={styles.error}>{categoryError}</Text>}

                                    {/* cancel editing or save the updated note */}
                                    <View style={styles.buttons}>
                                        <Pressable style={styles.cancelButton} onPress={() => setFindId("")}><Text style={styles.buttonText}>Cancel</Text></Pressable>
                                        <Pressable style={styles.saveButton} onPress={saveNotesChanges}><Text style={styles.buttonText}>Save Changes</Text></Pressable>
                                    </View>
                                </View>
                            ) : (
                                <View>
                                    {/* display the note title and action icons */}
                                    <View style={styles.noteTop}>
                                        <Text style={styles.title}>{item.title || "Untitled"}</Text>

                                        {/* edit or delete the selected note */}
                                        <View style={styles.noteActions}>
                                            <Pressable style={styles.iconButton} onPress={() => updateNote(item.id)} accessibilityRole="button" accessibilityLabel="Edit note"><Pencil size={20} color="#000000" /></Pressable>
                                            <Pressable style={styles.iconButton} onPress={() => showAlert(item.id)} accessibilityRole="button" accessibilityLabel="Delete note"><Trash2 size={20} color="#DC2626" /></Pressable>
                                        </View>
                                    </View>

                                    <Text style={styles.content}>{item.content}</Text>

                                    <View style={styles.noteFooter}>
                                        <View style={[styles.categoryBadge, { borderColor: categoryColor }]}>
                                            <Text style={styles.categoryText}>{item.category}</Text>
                                        </View>

                                        <View style={styles.dateContainer}>
                                            <CalendarDays size={15} color="#888888" />
                                            <Text style={styles.date}>{new Date(item.createdAt).toLocaleDateString()}</Text>
                                        </View>
                                    </View>
                                </View>
                            )}

                        </View>
                    </View>
                )}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyHeading}>No notes found</Text>
                        <Text style={styles.emptyState}>No matching notes found in this category.</Text>
                    </View>
                }
            />

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    categoryContainer: {
        flex: 1,
        width: "100%",
        backgroundColor: colors.background,
        paddingHorizontal: 20,
        paddingTop: 15
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
        marginBottom: 12
    },
    backButton: {
        width: 45,
        height: 45,
        borderRadius: 23,
        backgroundColor: "#F5F5F5",
        alignItems: "center",
        justifyContent: "center"
    },
    headerDetails: {
        flex: 1
    },
    heading: {
        fontSize: 25,
        fontWeight: "bold",
        color: colors.text
    },
    count: {
        fontSize: 14,
        color: colors.secondaryText,
        marginTop: 5
    },
    headerIcon: {
        width: 45,
        height: 45,
        borderRadius: 13,
        alignItems: "center",
        justifyContent: "center"
    },
    headingUnderline: {
        width: 70,
        height: 5,
        borderRadius: 4,
        backgroundColor: colors.primary,
        marginLeft: 59,
        marginBottom: 24
    },
    notesList: {
        flex: 1,
        width: "100%"
    },
    listContent: {
        flexGrow: 1,
        paddingBottom: 25
    },
    cardShadow: {
        borderRadius: 15,
        paddingRight: 5,
        paddingBottom: 5,
        marginBottom: 18
    },
    notesCards: {
        width: "100%",
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 15,
        padding: 18
    },
    noteTop: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 10,
        marginBottom: 12
    },
    title: {
        flex: 1,
        fontSize: 18,
        fontWeight: "bold",
        color: colors.text
    },
    noteActions: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8
    },
    iconButton: {
        width: 38,
        height: 38,
        alignItems: "center",
        justifyContent: "center"
    },
    content: {
        fontSize: 15,
        color: "#444444",
        lineHeight: 23,
        marginBottom: 15
    },
    noteFooter: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 10,
        marginTop: 5
    },
    categoryBadge: {
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
        maxWidth: "50%"
    },
    categoryText: {
        fontSize: 12,
        fontWeight: "bold",
        color: "#555555"
    },
    dateContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6
    },
    date: {
        fontSize: 12,
        color: "#888888"
    },
    editHeading: {
        fontSize: 19,
        fontWeight: "bold",
        color: colors.text,
        marginBottom: 20
    },
    label: {
        fontSize: 14,
        fontWeight: "bold",
        color: colors.text,
        marginBottom: 8
    },
    input: {
        borderWidth: 1,
        borderColor: "#DDDDDD",
        borderRadius: 10,
        padding: 12,
        backgroundColor: "#FFFFFF",
        color: colors.text,
        marginBottom: 15,
        fontSize: 14
    },
    contentInput: {
        minHeight: 110
    },
    buttons: {
        flexDirection: "row",
        gap: 10
    },
    saveButton: {
        flex: 1,
        backgroundColor: colors.primary,
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center"
    },
    cancelButton: {
        flex: 1,
        backgroundColor: "#EEEEEE",
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center"
    },
    buttonText: {
        color: colors.text,
        fontWeight: "bold",
        fontSize: 14
    },
    error: {
        color: "red",
        fontSize: 13,
        marginBottom: 10
    },
    emptyContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 20,
        paddingBottom: 40
    },
    emptyHeading: {
        fontSize: 20,
        fontWeight: "bold",
        color: colors.text,
        marginBottom: 8
    },
    emptyState: {
        textAlign: "center",
        color: colors.secondaryText,
        fontSize: 14,
        lineHeight: 21
    }
})
