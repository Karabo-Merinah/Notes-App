import { colors } from "@/constants/cardColors"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { router } from "expo-router"
import { ArrowLeft, Asterisk, Save } from "lucide-react-native"
import { useState } from "react"
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

export default function AddNotes() {

    const [title, setTitle] = useState("")
    const [category, setCategory] = useState("")
    const [notes, setNotes] = useState("")
    const [titleError, setTitleError] = useState("")
    const [categoryError, setCategoryError] = useState("")
    const [notesError, setNotesError] = useState("")
    const [saving, setSaving] = useState(false)

    //validate the form before saving
    const formValidation = () => {

        let isValid = true

        //title validation 
        if (title !== "" && title.length > 50) {
            setTitleError("Title length should not be more than 50 characters.")
            isValid = false
        }
        else {
            setTitleError("")
        }

        //category validation
        if (category.trim() === "" || category.length === 0) {
            setCategoryError("Category is required")
            isValid = false
        }
        else {
            setCategoryError("")
        }

        //notes validation 
        if (notes.length === 0 || notes.trim() === "" || notes.length > 500) {
            setNotesError("Notes is required and should not be more than 500 characters.")
            isValid = false
        }
        else {
            setNotesError("")
        }

        if (isValid && !saving) {
            saveNote()
        }
    }

    //save the note to the storage
    const saveNote = async () => {
        setSaving(true)

        try {
            //get saved notes
            const storedNotes = await AsyncStorage.getItem("notes")

            //if notes exist convert them into array,if not use empty array 
            let allNotes = []
            if (storedNotes !== null) {
                allNotes = JSON.parse(storedNotes)
            }

            //creating a new note 
            const newNote = {
                id: Date.now().toString(),
                title: title.trim(),
                content: notes.trim(),
                category: category.trim(),
                createdAt: new Date().toISOString()
            }

            //add the new note to the existing notes
            allNotes.push(newNote)

            //save the update 
            await AsyncStorage.setItem("notes", JSON.stringify(allNotes))

            //show success message only after saving 
            Alert.alert("Success", "You have successfully added the note.")

            //clear the form after submitting
            setTitle("")
            setCategory("")
            setNotes("")
            setTitleError("")
            setCategoryError("")
            setNotesError("")
        }
        catch (error) {
            console.log(error)
            Alert.alert("Error", "Could not save the note.")
        }
        finally {
            setSaving(false)
        }
    }

    return (
        <SafeAreaView style={styles.container} edges={["top", "bottom"]}>

            {/* display the back button and page heading */}
            <View style={styles.header}>
                <Pressable style={styles.backButton} onPress={() => router.back()}><ArrowLeft size={23} color="#000000" /></Pressable>

                <View style={styles.headerText}>
                    <Text style={styles.heading}>Add Note</Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

                <Text style={styles.formDescription}>Capture your thoughts and ideas.</Text>

                {/* optional note title */}
                <View style={styles.labelRow}>
                    <Text style={styles.formLabels}>Title (Optional)</Text>
                    <Text style={styles.counter}>{title.length}/50</Text>
                </View>

                <View style={styles.titleShadow}>
                    <TextInput style={styles.formInput} value={title} onChangeText={setTitle} placeholder="Enter note title" placeholderTextColor="#999999" maxLength={51} />
                </View>
                {titleError !== "" && <Text style={styles.error}>{titleError}</Text>}

                {/* required note content */}
                <View style={styles.labelRow}>
                    <Text style={styles.formLabels}>Notes <Asterisk size={10} color="red" /></Text>
                    <Text style={styles.counter}>{notes.length}/500</Text>
                </View>

                <View style={styles.notesShadow}>
                    <TextInput style={[styles.formInput, styles.notesInput]} value={notes} onChangeText={setNotes} placeholder="Write your notes here..." placeholderTextColor="#999999" multiline textAlignVertical="top" maxLength={501} />
                </View>
                {notesError !== "" && <Text style={styles.error}>{notesError}</Text>}

                {/* category name entered by the user */}
                <Text style={styles.formLabels}>Category <Asterisk size={10} color="red" /></Text>

                <View style={styles.categoryShadow}>
                    <TextInput style={styles.formInput} value={category} onChangeText={setCategory} placeholder="e.g. Work, Study, Personal" placeholderTextColor="#999999" />
                </View>
                {categoryError !== "" && <Text style={styles.error}>{categoryError}</Text>}

                <Text style={styles.requiredText}><Asterisk size={10} color="red" /> Indicates required fields</Text>

                {/* save the note after validation */}
                <View style={styles.buttonShadow}>
                    <Pressable style={[styles.button, saving && styles.disabledButton]} onPress={formValidation} disabled={saving}>
                        <Save size={20} color="#000000" />
                        <Text style={styles.saveButton}>{saving ? "Saving..." : "Save Note"}</Text>
                    </Pressable>
                </View>

            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        backgroundColor: colors.background
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
        paddingHorizontal: 20,
        paddingTop: 15,
        paddingBottom: 12
    },
    backButton: {
        width: 45,
        height: 45,
        borderRadius: 23,
        backgroundColor: "#F5F5F5",
        alignItems: "center",
        justifyContent: "center"
    },
    headerText: {
        flex: 1
    },
    heading: {
        fontSize: 26,
        color: colors.text,
        fontWeight: "bold"
    },
    headingUnderline: {
        width: 65,
        height: 5,
        backgroundColor: colors.primary,
        borderRadius: 4,
        marginTop: 4
    },
    headerIcon: {
        width: 45,
        height: 45,
        borderRadius: 13,
        backgroundColor: "#FFF1AD",
        alignItems: "center",
        justifyContent: "center"
    },
    form: {
        paddingHorizontal: 20,
        paddingTop: 15,
        paddingBottom: 40
    },
    formDescription: {
        fontSize: 14,
        color: colors.secondaryText,
        marginBottom: 28
    },
    labelRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 8
    },
    formLabels: {
        fontSize: 15,
        fontWeight: "bold",
        color: colors.text,
        marginBottom: 8
    },
    counter: {
        fontSize: 12,
        color: "#888888"
    },
    titleShadow: {
        backgroundColor: colors.pink,
        borderRadius: 12,
        paddingRight: 4,
        paddingBottom: 4,
        marginBottom: 22
    },
    notesShadow: {
        backgroundColor: colors.blue,
        borderRadius: 12,
        paddingRight: 4,
        paddingBottom: 4,
        marginBottom: 22
    },
    categoryShadow: {
        backgroundColor: colors.green,
        borderRadius: 12,
        paddingRight: 4,
        paddingBottom: 4,
        marginBottom: 22
    },
    formInput: {
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: "#FFFFFF",
        paddingHorizontal: 15,
        paddingVertical: 14,
        fontSize: 15,
        color: colors.text,
        width: "100%"
    },
    notesInput: {
        minHeight: 180
    },
    requiredText: {
        fontSize: 12,
        color: "#888888",
        marginBottom: 20
    },
    buttonShadow: {
        backgroundColor: "#111111",
        borderRadius: 12,
        paddingRight: 5,
        paddingBottom: 5,
        marginTop: 5
    },
    button: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        backgroundColor: colors.primary,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 12,
        paddingVertical: 16,
        width: "100%"
    },
    disabledButton: {
        opacity: 0.6
    },
    saveButton: {
        color: colors.text,
        fontWeight: "bold",
        fontSize: 16
    },
    error: {
        color: "red",
        fontSize: 13,
        marginTop: -15,
        marginBottom: 15
    }
})
