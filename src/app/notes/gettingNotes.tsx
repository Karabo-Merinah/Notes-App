import type { Note } from "@/types/notes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StickyNoteX } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import AddNotes from "./addNotes";

export default function getNotes() {

    const [savedNotes, setSavedNotes] = useState<Note[]>([])

    const fetchNotes = async () => {
        try {
            const data = await AsyncStorage.getItem("notes")

            if (data !== null) {
                const notes = JSON.parse(data)
                setSavedNotes(notes)
            }
        }
        catch (error) {
            console.log(error)
            Alert.alert("Could not get the notes.")

        }
    }

    const deleteNote = async (id: string) => {

        try {
            //removes the id that matches with the received one
            const updatedList = savedNotes.filter((note) => note.id !== id)
            setSavedNotes(updatedList)

            //stores the updated list back to the storage by converting the list back to string
            await AsyncStorage.setItem("notes", JSON.stringify(updatedList))
        }
        catch (error) {
            console.log(error)
            Alert.alert("Error", "Could not delete the note.")
        }
    }


    useEffect(() => {
        fetchNotes()
    }, [])

    return (
        <View>
            <Pressable onPress={fetchNotes}>
                <Text style={styles.button}>View all notes </Text>
            </Pressable>
            <FlatList data={savedNotes} keyExtractor={(item) => item.id} renderItem={({ item }) => (
                <View style={styles.notes}>
                    <Text>{item?.title}</Text>
                    <Text>{item.content}</Text>
                    <Text>{item.category}</Text>
                    <Text>{new Date(item.createdAt).toLocaleDateString()}</Text>
                       <Pressable onPress={()=>deleteNote(item.id)}>
                    <Text style={styles.button}>Delete a note</Text>
                </Pressable>
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

    }
})
