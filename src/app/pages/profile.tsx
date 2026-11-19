import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { UserRound } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";


export default function Profile() {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [editing, setEditing] = useState(false)

    //get logged in user details 
    const getUser = async () => {
        try {
            const data = await AsyncStorage.getItem("user")
            if (data !== null) {
                //convert saved data to an object
                const user = JSON.parse(data)
                //display the saved username and email 
                setUsername(user.username)
                setEmail(user.email)

            }
        }
        catch (error) {
            console.log(error)
        }
    }
//load user details when the page first opens
    useEffect(() => {
        getUser()
    }, [])

    //update username 
    const saveProfile = async () => {
        //prevents the user from removing the username and saving empty username 
        if (username.trim() == "") {
            Alert.alert("Error", "username cannot be empty")
            return
        }
        try {
            //get the currently logged in user 
            const userdata = await AsyncStorage.getItem("user")

            if (userdata !== null) {
                const user = JSON.parse(userdata)

                //update the username
                user.username = username.trim()
                //save the updated user details 
                await AsyncStorage.setItem("user", JSON.stringify(user))

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
        }
    }

    return (
         <ScrollView style={styles.container} contentContainerStyle={styles.profile} keyboardShouldPersistTaps="handled">
            <Text style={styles.heading}>My Profile</Text>
            <Text style={styles.description}>Manage your account details</Text>
            <View style={styles.avatarContainer}>
                <View style={styles.avatar}><UserRound size={45} color="#000000" /></View>
            </View>
            <Text style={styles.label}>Username</Text>
            <TextInput style={[styles.input, !editing && styles.disabledInput]} value={username} onChangeText={setUsername} editable={editing} />
            <Text style={styles.label}>Email</Text>
            <TextInput style={[styles.input, styles.disabledInput]} value={email} editable={false} />
            <Pressable style={styles.button} onPress={editing ? saveProfile : () => setEditing(true)}>
                <Text style={styles.buttonText}>{editing ? "Save Changes" : "Edit Profile"}</Text>
            </Pressable>
            <Pressable style={styles.logout} onPress={logout}>
                <Text style={styles.logoutText}>Logout</Text>
            </Pressable>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF"
    },
    profile: {
        padding: 20,
        paddingBottom: 40
    },
    heading: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#000000",
        marginBottom: 8
    },
    description: {
        fontSize: 16,
        color: "#777777",
        marginBottom: 25
    },
    avatarContainer: {
        alignItems: "center",
        marginBottom: 30
    },
    avatar: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: "#FFF8D6",
        borderWidth: 2,
        borderColor: "#FFCC00",
        alignItems: "center",
        justifyContent: "center"
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#000000",
        marginBottom: 8
    },
    input: {
        borderWidth: 1,
        borderColor: "#DDDDDD",
        borderRadius: 9,
        paddingHorizontal: 12,
        paddingVertical: 12,
        fontSize: 15,
        color: "#000000",
        backgroundColor: "#FFFFFF",
        marginBottom: 20,
        width: "100%"
    },
    disabledInput: {
        backgroundColor: "#F5F5F5"
    },
    button: {
        backgroundColor: "#FFCC00",
        borderRadius: 9,
        paddingVertical: 15,
        alignItems: "center",
        marginTop: 10,
        width: "100%"
    },
    buttonText: {
        color: "#000000",
        fontWeight: "bold",
        fontSize: 16
    },
    logout: {
        borderWidth: 1,
        borderColor: "#000000",
        borderRadius: 9,
        paddingVertical: 15,
        alignItems: "center",
        marginTop: 15,
        width: "100%"
    },
    logoutText: {
        color: "#000000",
        fontWeight: "bold",
        fontSize: 16
    }
})