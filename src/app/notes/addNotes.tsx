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
            Alert.alert("Success", "You have successfully added the note.")
        }
    }

    return (
        <View style={styles.form}>
            <Text style={styles.formDescription}>Save your notes for later !</Text>
            <Text style={styles.formLabels}>Title</Text><Asterisk size={16} color='red' />
            <TextInput style={styles.formInput} value={title} onChangeText={setTitle} placeholder="Title(optional)" placeholderTextColor={'#717171'} />
            {titleError !== "" && (
                <Text style={styles.error}>{titleError}</Text>
            )}
            <Text style={styles.formLabels}>Notes</Text><Asterisk size={16} color='red' />
            <TextInput placeholder="Write your notes here " placeholderTextColor={'#717171'} value={notes} onChangeText={setNotes} multiline />
            {notesError !== "" && (
                <Text style={styles.error}>{notesError}</Text>
            )}
            <Text style={styles.formLabels}>Category</Text><Asterisk size={16} color='red' />
            <TextInput style={styles.formInput} value={category} onChangeText={setCategory} placeholder="e.g Work,Study,Personal" placeholderTextColor={'#717171'} />
            {categoryError !== "" && (
                <Text style={styles.error}>{categoryError}</Text>
            )}
            <Pressable style={styles.button} onPress={formValidation}>
                <Text style={styles.saveButton}>SAVE NOTES</Text>
            </Pressable>
        </View>
    )

}

const styles = StyleSheet.create({
    form: {

    },
    formDescription: {

    },
    formLabels: {

    },
    formInput: {

    },
    button: {

    },
    saveButton: {

    },
    error: {
        color: 'red'
    }
})