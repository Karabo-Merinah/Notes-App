import AsyncStorage from "@react-native-async-storage/async-storage"
import { Asterisk } from "lucide-react-native"
import { useState } from "react"
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native"


export default function addNotes() {

    const [title, setTitle] = useState("")
    const [category, setCategory] = useState("")
    const [notes, setNotes] = useState("")
    const [titleError, setTitleError] = useState("")
    const [categoryError, setCategoryError] = useState("")
    const [notesError, setNotesError] = useState("")


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
        if (category.trim() === "" || category.length === 0) {
            setCategoryError("Category is required")
            isValid = false
        }
        else {
            setCategoryError("")
        }
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

    const saveNote = async () => {
        try {
            //get saved notes
            const storedNotes = await AsyncStorage.getItem("notes")

            //if notes exist convert them into array,if not use empty array 
            let allNotes = []
            if (storedNotes !== null) {
                allNotes = JSON.parse(storedNotes)
            }

            //creating note 
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
        <View style={styles.form}>
            <Text style={styles.formDescription}>Save your notes for later !</Text>
            <Text style={styles.formLabels}>Title</Text>
            <TextInput style={styles.formInput} value={title} onChangeText={setTitle} placeholder="Title(optional)" placeholderTextColor={'#717171'} />
            {titleError !== "" && (
                <Text style={styles.error}>{titleError}</Text>
            )}
            <Text style={styles.formLabels}>Notes <Asterisk size={10} color='red' /></Text>
            <TextInput placeholder="Write your notes here " placeholderTextColor={'#717171'} value={notes} onChangeText={setNotes} multiline />
            {notesError !== "" && (
                <Text style={styles.error}>{notesError}</Text>
            )}
            <View style={styles.category_button}>
                <Text style={styles.formLabels}>Category <Asterisk size={10} color='red' /></Text>
                <TextInput style={styles.formInput} value={category} onChangeText={setCategory} placeholder="e.g Work,Study,Personal" placeholderTextColor={'#717171'} />
                {categoryError !== "" && (
                    <Text style={styles.error}>{categoryError}</Text>
                )}
                <Pressable style={styles.button} onPress={formValidation}>
                    <Text style={styles.saveButton}>SAVE NOTES</Text>
                </Pressable>
            </View>
        </View>
    )

}

const styles = StyleSheet.create({
    form: {
        justifyContent: 'center',
        marginTop: 10,
        padding: 20
    },
    formDescription: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 350,
        marginBottom: 20
    },
    formLabels: {
        fontSize: 16
    },
    formInput: {
        borderRadius: 9,
        borderWidth: 1
    },
    button: {

    },
    saveButton: {
        backgroundColor: 'black',
        color: '#FDFDFD',
        textAlign: 'center',
        borderRadius: 9,
        maxWidth: 250,
        height: 40,
        padding: 10
    },
    category_button: {
        gap: 20
    },
    error: {
        color: 'red'
    }
})