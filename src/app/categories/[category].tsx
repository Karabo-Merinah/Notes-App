import { type Note } from "@/types/notes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

export default function CategoryNotes() {
    const category = useLocalSearchParams().category as string
    const [notes, setNotes] = useState<Note[]>([])

    //get saved notes
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

    //load the notes when page opens 
    useEffect(() => {
        getNotes()
    }, [])

    //get notes belonging to the category 
    const categoryNotes = notes.filter((note) =>
        note.category.toLowerCase() === category.toLowerCase()
    )
    return (
        <View style={styles.categoryContainer}>
            <Text style={styles.heading}>{category}</Text>
            <Text style={styles.count}>{categoryNotes.length} notes</Text>

            <FlatList data={categoryNotes} keyExtractor={(item) => item.id} renderItem={({ item }) => (
                <view style={styles.notesCards}>
                    <Text style={styles.title}>{item.title || "Untitled"}</Text>
                    <Text style={styles.content}>{item.content}</Text>
                    <Text style={styles.date}>{new Date(item.createdAt).toLocaleDateString()}</Text>
                </view>
            )}
                ListEmptyComponent={
                    <Text style={styles.emptyState}>No notes found in this category .</Text>
                }
            />
        </View>
    )
}

const styles = StyleSheet.create({
    categoryContainer: {

    },
    heading: {

    },
    notesCards: {

    },
    count: {

    },
    title: {

    },
    content: {

    },
    date: {

    },
    emptyState: {

    }
})