import { type Note } from "@/types/notes"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useFocusEffect } from "expo-router"
import { Folder, Plus, UserRound } from "lucide-react-native"
import { useCallback, useState } from "react"
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native"

export default function Home(){
    const [notes,setNotes]=useState<Note[]>([])

    //gets all saved notes 
    const getNotes=async()=>{
        try{
            const dataNotes=await AsyncStorage.getItem("notes")

            if(dataNotes!==null){
                setNotes(JSON.parse(dataNotes))
            }
            else{
                setNotes([])
            }
            
        }
        catch(error){
            console.log(error)
        }
    }

    //mounts whenever the page is opened
    useFocusEffect(
        useCallback(()=>{
            getNotes()
         } ,[])
    )

    //store the categories created by the user
    const categories:string[]=[]
 // Get the categories from saved notes
notes.forEach((note) => {
    const category = note.category.trim()

    // Prevent duplicate categories
    if (category !== "" && !categories.some((item) =>
        item.toLowerCase() === category.toLowerCase())) {
        categories.push(category)
    }
})

   return (
        <View style={styles.home}>
            <Text style={styles.heading}>My Notes</Text>
            <Text style={styles.subtitle}>Organise your notes</Text>
            {/* Total saved notes */}
            <Text style={styles.total}>
                Total Notes: {notes.length}
            </Text>
            {/* Display category cards */}
            <FlatList data={categories} keyExtractor={(item) => item} numColumns={2} renderItem={({ item }) => {
                    // Count notes belonging to each category
                    const count = notes.filter((note) => {
                        return note.category.trim().toLowerCase() === item.toLowerCase()
                    }).length

                    return (
                        // <Pressable style={styles.card} onPress={() => router.push({ pathname:"/categories/[category]",params: { category: item } })} >
                        <Pressable>
                            <Folder size={30} color="#5C4033" />
                            <Text style={styles.category}>{item}</Text>
                            <Text style={styles.count}> {count} {count === 1 ? "note" : "notes"} </Text>
                         </Pressable>
                    )
                }}
                ListEmptyComponent={
                    <Text style={styles.empty}> No notes saved yet. Add a note to create your first category. </Text>
                }
            />
            {/* Bottom navigation */}
            <View style={styles.navigation}>
                {/* <Pressable style={styles.navButton} onPress={() => router.push("/")}> */}
                    <Folder size={24} color="#5C4033" />
                    <Text style={styles.navText}>Home</Text>
                {/* </Pressable> */}
                {/* <Pressable style={styles.navButton} onPress={() => router.push("/addNotes")}> */}
                    <Plus size={24} color="#5C4033" />
                    <Text style={styles.navText}>Add Note</Text>
                {/* </Pressable> */}
                {/* <Pressable style={styles.navButton} onPress={() => router.push("/profile")}> */}
                    <UserRound size={24} color="#5C4033" />
                    <Text style={styles.navText}>Profile</Text>
                {/* </Pressable> */}

            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    home: {
        flex: 1,
        padding: 20,
        backgroundColor: "#FFFFFF"
    },
    heading: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#5C4033"
    },
    subtitle: {
        marginTop: 5,
        marginBottom: 20,
        color: "#777777"
    },
    total: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 20
    },
    card: {
        flex: 1,
        backgroundColor: "#F5F0EB",
        padding: 20,
        margin: 5,
        borderRadius: 12,
        minHeight: 140,
        justifyContent: "space-between"
    },
    category: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#5C4033",
        marginTop: 10
    },
    count: {
        fontSize: 14,
        color: "#777777",
        marginTop: 5
    },
    empty: {
        textAlign: "center",
        marginTop: 40,
        color: "#777777"
    },
    navigation: {
        flexDirection: "row",
        justifyContent: "space-around",
        paddingVertical: 15,
        borderTopWidth: 1,
        borderTopColor: "#EEEEEE"
    },
    navButton: {
        alignItems: "center",
        gap: 5
    },
    navText: {
        fontSize: 13,
        color: "#5C4033"
    }
})

