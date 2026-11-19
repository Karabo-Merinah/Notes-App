import AsyncStorage from "@react-native-async-storage/async-storage"
import { Asterisk } from "lucide-react-native"
import { useState } from "react"
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput } from "react-native"


export default function addNotes() {

    const [title, setTitle] = useState("")
    const [category, setCategory] = useState("")
    const [notes, setNotes] = useState("")
    const [titleError, setTitleError] = useState("")
    const [categoryError, setCategoryError] = useState("")
    const [notesError, setNotesError] = useState("")


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
        if (isValid) {
            saveNote()
        }
    }

    //save the note to the storage
    const saveNote = async () => {
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
        }
        catch (error) {
            console.log(error)
            Alert.alert("Error", "Could not save ")

        }
    }


    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">
            <Text style={styles.heading}>Add notes</Text>
            <Text style={styles.formDescription}>Save your notes for later !</Text>
            {/* Title */}
            <Text style={styles.formLabels}>Title (Optional)</Text>
            <TextInput style={styles.formInput} value={title} onChangeText={setTitle} placeholder="Enter note title" placeholderTextColor="#717171" maxLength={51} />
            {titleError !== "" && <Text style={styles.error}>{titleError}</Text>}

            {/* Notes */}
            <Text style={styles.formLabels}>Notes <Asterisk size={10} color="red" /></Text>
            <TextInput style={[styles.formInput, styles.notesInput]} value={notes} onChangeText={setNotes} placeholder="Write your notes here..." placeholderTextColor="#717171" multiline textAlignVertical="top" maxLength={501} />
            {notesError !== "" && <Text style={styles.error}>{notesError}</Text>}

            {/* Category */}
            <Text style={styles.formLabels}>Category <Asterisk size={10} color="red" /></Text>
            <TextInput style={styles.formInput} value={category} onChangeText={setCategory} placeholder="e.g. Work, Study, Personal" placeholderTextColor="#717171" />
            {categoryError !== "" && <Text style={styles.error}>{categoryError}</Text>}

            {/* Save button */}
            <Pressable style={styles.button} onPress={formValidation}>
                <Text style={styles.saveButton}>SAVE NOTES</Text>
            </Pressable>

        </ScrollView>
    )

}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FDFDFD',
        flex: 1
    },
    form: {
        padding: 20,
        paddingBottom:40
    },
    heading:{
        fontSize:28,
        color:'#000000',
        fontWeight:'bold',
        marginBottom:8
    },
    formDescription: {
        fontSize: 16,
        color:'#777777',
        marginBottom: 20
    },
    formLabels: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#000000",
        marginBottom: 8
    },
    formInput: {
        borderRadius: 9,
        borderWidth: 1,
        borderColor: "#DDDDDD",
        backgroundColor: "#FFFFFF",
        paddingHorizontal: 12,
        paddingVertical: 12,
        fontSize: 15,
        color: "#000000",
        marginBottom: 20,
        width: "100%"
    },
    notesInput: {
        minHeight: 150
    },
    button: {
        backgroundColor: "#FFCC00",
        borderRadius: 9,
        paddingVertical: 15,
        alignItems: "center",
        marginTop: 10,
        width: "100%"
    },
    saveButton: {
        color: "#000000",
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