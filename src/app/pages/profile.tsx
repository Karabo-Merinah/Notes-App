import { colors } from "@/constants/cardColors"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { router, useFocusEffect } from "expo-router"
import { ArrowLeft, LogOut, Pencil, Save } from "lucide-react-native"
import { useCallback, useState } from "react"
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

export default function Profile() {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [editing, setEditing] = useState(false)
    const [saving, setSaving] = useState(false)
    const [savedUsername, setSavedUsername] = useState("")

    //get logged in user details 
    const getUser = async () => {
        try {
            const data = await AsyncStorage.getItem("user")

            if (data !== null) {
                //convert saved data to an object
                const user = JSON.parse(data)

                //display the saved username and email 
                setUsername(user.username || "")
                setEmail(user.email || "")
                setSavedUsername(user.username || "")
            }
        }
        catch (error) {
            console.log(error)
        }
    }

    //load user details when the page first opens
    useFocusEffect(
        useCallback(() => {
            getUser()
        }, [])
    )

    //update username 
    const saveProfile = async () => {

        //prevents the user from removing the username and saving empty username 
        if (username.trim() == "") {
            Alert.alert("Error", "Username cannot be empty")
            return
        }

        if (saving) {
            return
        }

        setSaving(true)

        try {
            //get the currently logged in user 
            const userdata = await AsyncStorage.getItem("user")

            if (userdata !== null) {
                const user = JSON.parse(userdata)

                //update the username
                user.username = username.trim()

                //save the updated user details 
                await AsyncStorage.setItem("user", JSON.stringify(user))

                setUsername(user.username)
                setSavedUsername(user.username)

                //disable editing after saving
                setEditing(false)
                Alert.alert("Success", "Profile updated successfully")
            }
            else {
                Alert.alert("Error", "No user is logged in")
            }
        }
        catch (error) {
            console.log(error)
            Alert.alert("Error", "Could not update your profile")
        }
        finally {
            setSaving(false)
        }
    }

    //logout 
    const logout = async () => {
        try {
            //remove the logged in user data 
            await AsyncStorage.removeItem("user")
            //redirect the user to login page 
            router.replace("/authenticationPages/login")
        }
        catch (error) {
            console.log(error)
            Alert.alert("Error", "Could not log out")
        }
    }

    //ask for confirmation before logging out
    const confirmLogout = () => {
        Alert.alert("Logout", "Are you sure you want to log out?", [
            { text: "Cancel", style: "cancel" },
            { text: "Logout", style: "destructive", onPress: logout }
        ])
    }

    return (
        <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
            <View style={styles.header}>
                <Pressable style={styles.backButton} onPress={() => router.back()}>
                    <ArrowLeft size={23} color="#000000" />
                </Pressable>

                <View style={styles.headerText}>
                    <Text style={styles.heading}>My Profile</Text>
                </View>
            </View>
            <ScrollView contentContainerStyle={styles.profile} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

                <Text style={styles.description}>Manage your account details</Text>
                <View style={styles.avatarContainer}>
                    <View style={styles.avatarShadow}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>{savedUsername.trim().charAt(0).toUpperCase() || "U"} </Text>
                        </View>
                    </View>

                    <Text style={styles.profileName}>{username}</Text>
                    <Text style={styles.profileEmail}>{email}</Text>
                </View>
                <Text style={styles.label}>Username</Text>

                <View style={styles.usernameShadow}>
                    <TextInput style={[styles.input, !editing && styles.disabledInput]} value={username} onChangeText={setUsername} editable={editing} placeholder="Enter username" placeholderTextColor="#999999" />
                </View>
                <Text style={styles.label}>Email</Text>

                <View style={styles.emailShadow}>
                    <TextInput style={[styles.input, styles.disabledInput]} value={email} editable={false} />
                </View>
                <View style={styles.buttonShadow}>
                    <Pressable style={[styles.button, saving && styles.disabledButton]} onPress={editing ? saveProfile : () => setEditing(true)} disabled={saving}>
                        {editing ? <Save size={20} color="#000000" /> : <Pencil size={20} color="#000000" />}
                        <Text style={styles.buttonText}>{saving ? "Saving..." : editing ? "Save Changes" : "Edit Profile"}</Text>
                    </Pressable>
                </View>
                {editing && (
                    <Pressable style={styles.cancelButton} onPress={() => { setEditing(false); getUser() }}>
                        <Text style={styles.cancelText}>Cancel</Text>
                    </Pressable>
                )}
                <Pressable style={styles.logout} onPress={confirmLogout}>
                    <LogOut size={19} color="#DC2626" />
                    <Text style={styles.logoutText}>Logout</Text>
                </Pressable>

            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        fontWeight: "bold",
        color: colors.text
    },
    profile: {
        paddingHorizontal: 20,
        paddingTop: 15,
        paddingBottom: 40
    },
    description: {
        fontSize: 14,
        color: colors.secondaryText,
        marginBottom: 28
    },
    avatarContainer: {
        alignItems: "center",
        marginBottom: 35
    },
    avatarShadow: {
        backgroundColor: colors.pink,
        borderRadius: 50,
        paddingRight: 5,
        paddingBottom: 5,
        marginBottom: 15
    },
    avatar: {
        width: 95,
        height: 95,
        borderRadius: 48,
        borderWidth: 2,
        borderColor: colors.border,
        alignItems: "center",
        justifyContent: "center"
    },
    avatarText: {
        fontSize: 40,
        fontWeight: "bold",
        color: colors.text
    },
    profileName: {
        fontSize: 21,
        fontWeight: "bold",
        color: colors.text,
        marginBottom: 5
    },
    profileEmail: {
        fontSize: 14,
        color: colors.secondaryText
    },
    label: {
        fontSize: 15,
        fontWeight: "bold",
        color: colors.text,
        marginBottom: 10
    },
    usernameShadow: {
        backgroundColor: colors.pink,
        borderRadius: 12,
        paddingRight: 4,
        paddingBottom: 4,
        marginBottom: 24
    },
    emailShadow: {
        backgroundColor: colors.blue,
        borderRadius: 12,
        paddingRight: 4,
        paddingBottom: 4,
        marginBottom: 25
    },
    input: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 12,
        paddingHorizontal: 15,
        paddingVertical: 14,
        fontSize: 15,
        color: colors.text,
        backgroundColor: "#FFFFFF",
        width: "100%"
    },
    disabledInput: {
        backgroundColor: "#FAFAFA"
    },
    buttonShadow: {
        backgroundColor: colors.text,
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
    buttonText: {
        color: colors.text,
        fontWeight: "bold",
        fontSize: 16
    },
    cancelButton: {
        alignItems: "center",
        paddingVertical: 14,
        marginTop: 12
    },
    cancelText: {
        fontSize: 14,
        fontWeight: "bold",
        color: colors.secondaryText
    },
    logout: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        borderWidth: 1,
        borderColor: "#DC2626",
        borderRadius: 12,
        paddingVertical: 15,
        marginTop: 20
    },
    logoutText: {
        color: "#DC2626",
        fontWeight: "bold",
        fontSize: 16
    }
})
