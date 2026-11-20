import { type Note } from "@/types/notes"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { router, useFocusEffect } from "expo-router"
import { ArrowDownUp, Check, ChevronRight, Folder, Plus, Search, UserRound } from "lucide-react-native"
import { useCallback, useState } from "react"
import { FlatList, Image, Pressable, StyleSheet, Text, TextInput, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

export default function Home() {

    const [notes, setNotes] = useState<Note[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [sortOrder, setSortOrder] = useState("descending")
    const [showSortOptions, setShowSortOptions] = useState(false)

    // get saved notes from AsyncStorage
    const getNotes = async () => {
        try {
            const dataNotes = await AsyncStorage.getItem("notes")
            // convert saved JSON data into an array of notes
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

    // displays  notes whenever the user returns to Home
    useFocusEffect(
        useCallback(() => {
            getNotes()
        }, [])
    )

    // search notes using their title, content or category
    const searchNotes = notes.filter((note) => {

        // convert the search into lowercase words
        const searchWords = searchTerm.toLowerCase().trim().split(" ")
        // combine the note information into one searchable text
        const text = `${note.title || ""} ${note.content} ${note.category}`.toLowerCase()
        // check whether every searched word exists in the note
        for (let word of searchWords) {
            if (!text.includes(word)) {
                return false
            }
        }

        return true
    })

    // sort matching notes according to their creation date
    const sortedNotes = searchNotes.slice().sort((a, b) => {
        // oldest
        if (sortOrder === "ascending") {
            return a.createdAt.localeCompare(b.createdAt)
        }
        // new notes
        else {
            return b.createdAt.localeCompare(a.createdAt)
        }
    })

    // store the categories that should appear on Home
    const categories: string[] = []
    // get  category names from the matching notes
    sortedNotes.forEach((note) => {
        const category = note.category.trim()
        // ddd the category only if it is not already in the array and ignore uppercase/lowercase differences
        if (category !== "" && !categories.some((item) => item.toLowerCase() === category.toLowerCase())) {
            categories.push(category)
        }
    })

    return (
        <SafeAreaView style={styles.home} edges={["top", "bottom"]}>
            <Text style={styles.heading}>My Notes</Text>
            <Text style={styles.subtitle}>Organise your notes, your way.</Text>
            <Text style={styles.total}>Total Notes: {notes.length}</Text>

            <View style={styles.toolbar}>
                <View style={styles.searchContainer}>
                    <Search size={20} color="#777777" />
                    <TextInput style={styles.searchInput} placeholder="Search your notes..." placeholderTextColor="#888888" value={searchTerm} onChangeText={setSearchTerm} />
                </View>

                <View style={styles.sortContainer}>
                    {/* open or close the sorting options */}
                    <Pressable style={styles.sortButton} onPress={() => setShowSortOptions(!showSortOptions)} accessibilityRole="button" accessibilityLabel="Sort notes"><ArrowDownUp size={22} color="#000000" /></Pressable>

                    {/* display sorting options when the button is pressed */}
                    {showSortOptions && (
                        <View style={styles.sortDropdown}>
                            {/* sort notes from newest to oldest */}
                            <Pressable style={styles.sortOption} onPress={() => { setSortOrder("descending"); setShowSortOptions(false) }}>
                                <Text style={styles.sortText}>Newest </Text>
                                {sortOrder === "descending" && <Check size={17} color="#000000" />}
                            </Pressable>

                            {/* sort notes from oldest to newest */}
                            <Pressable style={styles.sortOption} onPress={() => { setSortOrder("ascending"); setShowSortOptions(false) }}>
                                <Text style={styles.sortText}>Oldest </Text>
                                {sortOrder === "ascending" && <Check size={17} color="#000000" />}
                            </Pressable>
                        </View>
                    )}
                </View>
            </View>

            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>My Categories</Text>
                {/* how how many categories are currently displayed */}
                <Text style={styles.sectionCount}>{categories.length} {categories.length === 1 ? "category" : "categories"}</Text>
            </View>

            {/* display categories in a single vertical list */}
            <FlatList
                data={categories}
                style={styles.categoryList}
                keyExtractor={(item) => item.toLowerCase()}
                contentContainerStyle={styles.listContent}
                keyboardShouldPersistTaps="handled"
                renderItem={({ item }) => {
                    // Count all saved notes belonging to this category
                    const totalCount = notes.filter((note) => note.category.trim().toLowerCase() === item.toLowerCase()).length
                    // Count only notes matching the user's search
                    const matchCount = sortedNotes.filter((note) => note.category.trim().toLowerCase() === item.toLowerCase()).length

                    return (
                        <Pressable style={styles.card} onPress={() => router.push({ pathname: "/categories/[category]", params: { category: item, search: searchTerm, sort: sortOrder } })}>
                            <View style={styles.cardContent}>
                                <Text style={styles.category}>{item}</Text>
                                <Text style={styles.count}>{totalCount} {totalCount === 1 ? "note" : "notes"}</Text>
                                {searchTerm.trim() !== "" && <Text style={styles.matchText}>{matchCount} {matchCount === 1 ? "match" : "matches"} found</Text>}
                            </View>
                            <ChevronRight size={20} color="#777777" />
                        </Pressable>
                    )
                }}
                // display an empty state when no categories match
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        {searchTerm.trim() !== "" ? (
                            <>
                                {/* display when no notes match the search */}
                                <Image source={require("../../../assets/illustrations/search_empty.png")} style={styles.emptyImage} resizeMode="contain" />
                                <Text style={styles.emptyHeading}>No results found</Text>
                                <Text style={styles.empty}>We couldn't find any notes matching "{searchTerm}".</Text>
                            </>
                        ) : (
                            <>
                                {/* display when the user has no saved notes */}
                                <Image source={require("../../../assets/illustrations/notes_emptystate.png")} style={styles.emptyImage} resizeMode="contain" />
                                <Text style={styles.emptyHeading}>Your notebook is empty</Text>
                                <Text style={styles.empty}>Every great idea starts with a note. Create your first one!</Text>

                                <Pressable style={styles.createButton} onPress={() => router.push("/notes/addNotes")}><Plus size={20} color="#000000" /><Text style={styles.createText}>Create Note</Text></Pressable>
                            </>
                        )}
                    </View>
                }
            />
            <View style={styles.navigation}>
                <Pressable style={styles.navButton} onPress={() => router.push("/pages/home")}><Folder size={24} color="#FFCC00" /><Text style={styles.navText}>Home</Text></Pressable>
                <Pressable style={styles.navButton} onPress={() => router.push("/notes/addNotes")}><Plus size={24} color="#000000" /><Text style={styles.navText}>Add Note</Text></Pressable>
                <Pressable style={styles.navButton} onPress={() => router.push("/pages/profile")}><UserRound size={24} color="#000000" /><Text style={styles.navText}>Profile</Text></Pressable>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    home: {
        flex: 1,
        width: "100%",
        paddingHorizontal: 20,
        paddingTop: 15,
        backgroundColor: "#FFFFFF"
    },
    heading: {
        fontSize: 30,
        fontWeight: "bold",
        color: "#000000",
        marginBottom: 4
    },
    subtitle: {
        fontSize: 14,
        color: "#777777",
        marginBottom: 25
    },
    total: {
        fontSize: 15,
        fontWeight: "bold",
        color: "#000000",
        marginBottom: 22
    },
    toolbar: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        gap: 10,
        marginBottom: 25,
        zIndex: 10
    },
    searchContainer: {
        flex: 1,
        minWidth: 0,
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#DDDDDD",
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 48,
        backgroundColor: "#FFFFFF"
    },
    searchInput: {
        flex: 1,
        minWidth: 0,
        paddingHorizontal: 10,
        fontSize: 14,
        color: "#000000"
    },
    sortContainer: {
        flexShrink: 0,
        position: "relative",
        zIndex: 20
    },
    sortButton: {
        width: 48,
        height: 48,
        backgroundColor: "#FFCC00",
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center"
    },
    sortDropdown: {
        position: "absolute",
        top: 55,
        right: 0,
        width: 175,
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#EEEEEE",
        borderRadius: 12,
        padding: 5,
        elevation: 6,
        zIndex: 30,
        shadowColor: "#000000",
        shadowOpacity: 0.1,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 }
    },
    sortOption: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 13,
        paddingHorizontal: 10
    },
    sortText: {
        fontSize: 14,
        color: "#000000"
    },
    sectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        gap: 12,
        marginBottom: 15
    },
    sectionTitle: {
        flex: 1,
        fontSize: 19,
        fontWeight: "bold",
        color: "#000000"
    },
    sectionCount: {
        fontSize: 13,
        color: "#777777",
        textAlign: "right"
    },
    categoryList: {
        flex: 1,
        width: "100%"
    },
    listContent: {
        flexGrow: 1,
        paddingBottom: 20
    },
    card: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#E5E5E5",
        borderRadius: 12,
        paddingHorizontal: 15,
        paddingVertical: 14,
        marginBottom: 12
    },
    cardContent: {
        flex: 1,
        gap: 5,
        paddingRight: 10
    },
    category: {
        fontSize: 17,
        fontWeight: "bold",
        color: "#000000"
    },
    count: {
        fontSize: 13,
        color: "#666666"
    },
    matchText: {
        fontSize: 13,
        fontWeight: "bold",
        color: "#000000",
        marginTop: 3
    },
    emptyContainer: {
        flex: 1,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 20,
        paddingBottom: 30
    },
    emptyImage: {
        width: 200,
        height: 200,
        marginBottom: 5
    },
    emptyHeading: {
        fontSize: 21,
        fontWeight: "bold",
        color: "#000000",
        textAlign: "center",
        marginBottom: 8
    },
    empty: {
        fontSize: 14,
        color: "#777777",
        textAlign: "center",
        lineHeight: 21,
        marginBottom: 20
    },
    createButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        backgroundColor: "#FFCC00",
        paddingHorizontal: 25,
        paddingVertical: 14,
        borderRadius: 12
    },
    createText: {
        fontSize: 15,
        fontWeight: "bold",
        color: "#000000"
    },
    navigation: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        width: "100%",
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
