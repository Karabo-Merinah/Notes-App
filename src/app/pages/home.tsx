import { type Note } from "@/types/notes"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { router, useFocusEffect } from "expo-router"
import { Folder, Plus, Search, UserRound } from "lucide-react-native"
import { useCallback, useState } from "react"
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native"


export default function Home() {
    const [notes, setNotes] = useState<Note[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [sortOrder, setSortOrder] = useState("descending")

    //gets all saved notes 
    const getNotes = async () => {
        try {
            const dataNotes = await AsyncStorage.getItem("notes")

            if (dataNotes !== null) {
                setNotes(JSON.parse(dataNotes))
            }
            else {
                setNotes([])
            }

        }
        catch (error) {
            console.log(error)
        }
    }

    //mounts whenever the page is opened
    useFocusEffect(
        useCallback(() => {
            getNotes()
        }, [])
    )

    //search notes by title,content and category 
    const searchNotes = notes.filter((note) => {
        const searchWords = searchTerm.toLowerCase().trim().split(" ")
        const text = `${note.title || ""} ${note.content} ${note.category}`.toLowerCase()

        for (let word of searchWords) {
            if (!text.includes(word)) {
                return false
            }
        }
        return true
    })

    //sort matching notes by date 
    const sortedNotes = searchNotes.slice().sort((a, b) => {
        if (sortOrder === "ascending") {
            return a.createdAt.localeCompare(b.createdAt)
        }
        else {
            return b.createdAt.localeCompare(a.createdAt)
        }
    })
    //store the categories created by the user
    const categories: string[] = []
    // Get the categories from saved notes
    sortedNotes.forEach((note) => {
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
            <View style={styles.searchContainer}><Search size={20} color="#777777" />
                <TextInput style={styles.searchInput} placeholder="Search your notes here " value={searchTerm} onChangeText={setSearchTerm} />
            </View>

            <View style={styles.sortContainer}>
                <Pressable style={styles.sortButton} onPress={() => setSortOrder("descending")}>
                    <Text style={styles.sortText}>Newest</Text>
                </Pressable>

                <Pressable style={styles.sortButton} onPress={() => setSortOrder("ascending")}>
                    <Text style={styles.sortText}>Oldest</Text>
                </Pressable>
            </View>

            {/* Display categories in a vertical list */}
            <FlatList data={categories} keyExtractor={(item) => item} renderItem={({ item }) => {

                // Count matching notes in each category
                const count = sortedNotes.filter((note) =>
                    note.category.trim().toLowerCase() === item.toLowerCase()
                ).length

                return (
                    <Pressable style={styles.card} onPress={() => router.push({ pathname: "/categories/[category]", params: { category: item, search: searchTerm, sort: sortOrder } })}>
                        <View style={styles.categoryDetails}>
                            <Folder size={26} color="#FFCC00" />
                            <View style={styles.categoryLabelValue}>
                                <Text style={styles.categoryLabel}>Category: </Text>
                                <Text style={styles.category}>{item}</Text>
                            </View>
                        </View>

                        <Text style={styles.count}>{count} {count === 1 ? "note" : "notes"}</Text>
                    </Pressable>
                )
            }}
                ListEmptyComponent={
                    <Text style={styles.empty}>{searchTerm.trim() !== "" ? "No matching notes found." : "No notes saved yet."}</Text>
                }
            />

            <View style={styles.navigation}>
                <Pressable style={styles.navButton} onPress={() => router.push("/pages/home")} >
                    <Folder size={24} color="#FFCC00" />
                    <Text style={styles.navText}>Home</Text>
                </Pressable>
                <Pressable style={styles.navButton} onPress={() => router.push("/notes/addNotes")} >
                    <Plus size={24} color="#000000" />
                    <Text style={styles.navText}>Add Note</Text>
                </Pressable>
                <Pressable style={styles.navButton} onPress={() => router.push("/pages/profile")}  >
                    <UserRound size={24} color="#000000" />
                    <Text style={styles.navText}>Profile</Text>
                </Pressable>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    home: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
        backgroundColor: "#FFFFFF"
    },
    heading: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#000000"
    },
    subtitle: {
        marginTop: 5,
        marginBottom: 20,
        color: "#777777"
    },
    total: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#000000",
        marginBottom: 20
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#DDDDDD",
        borderRadius: 10,
        paddingHorizontal: 12,
        marginBottom: 15,
        backgroundColor: "#F5F5F5",
        width: "100%"
    },
    searchInput: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 10,
        color: "#000000"
    },
    sortContainer: {
        flexDirection: "row",
        gap: 10,
        marginBottom: 20
    },
    sortButton: {
        flex: 1,
        backgroundColor: "#FFCC00",
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: "center"
    },
    sortText: {
        color: "#000000",
        fontWeight: "bold"
    },
    card: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#FFF8D6",
        borderRadius: 10,
        padding: 15,
        marginBottom: 12,
        width: "100%"
    },
    category: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#000000",
    },
    categoryDetails: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1
    },
    categoryLabelValue: {
        flexDirection: 'row'
    },
    categoryLabel: {
        fontSize: 12,
        color: '#77777',
        marginTop: 4
    },
    count: {
        fontSize: 14,
        color: "#555555",
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
        alignItems: "center",
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: "#EEEEEE",
        backgroundColor: "#FFFFFF"
    },
    navButton: {
        alignItems: "center",
        gap: 5
    },
    navText: {
        fontSize: 13,
        color: "#000000"
    }
})


