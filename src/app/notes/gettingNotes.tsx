import type { Note } from "@/types/notes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SquarePen } from "lucide-react-native";
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
                </View>
            )}
                ListEmptyComponent={
                    <View>
                        <Text style={styles.notes}>You currently have no notes saved.</Text>
                        <SquarePen size={20} />
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
