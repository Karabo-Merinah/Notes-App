import CustomInput from "@/components/CustomInput"
import { Link } from "expo-router"
import { useState } from "react"
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native"

export default function Login() {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
            <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">

                <View style={styles.formContainer}>
                    {/* Heading */}
                    <View style={styles.header}>
                        <Text style={styles.heading}>Welcome Back</Text>
                        <Text style={styles.description}>Login to access your notes</Text>
                    </View>

                    {/* Login form */}
                    <View style={styles.form}>
                        <CustomInput name="Email Address" onChange={setEmail} />
                        <CustomInput name="Password" onChange={setPassword} />

                        <Pressable style={styles.button} onPress={() => console.log("Login")}>
                            <Text style={styles.buttonText}>Login</Text>
                        </Pressable>
                    </View>

                    {/* Register link */}
                    <View style={styles.register}>
                        <Text style={styles.registerText}>Don't have an account? </Text>
                        <Link href="/authenticationPages/register" style={styles.registerLink}>Sign up</Link>
                    </View>
                </View>

            </ScrollView>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF"
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: "center",
        padding: 20
    },
    formContainer: {
        width: "100%",
        maxWidth: 400,
        alignSelf: "center"
    },
    header: {
        alignItems: "center",
        marginBottom: 30
    },
    logo: {
        width: 65,
        height: 65,
        borderRadius: 18,
        backgroundColor: "#FFCC00",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20
    },
    logoText: {
        fontSize: 32,
        fontWeight: "bold",
        color: "#000000"
    },
    heading: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#000000",
        marginBottom: 8
    },
    description: {
        fontSize: 15,
        color: "#777777",
        textAlign: "center"
    },
    form: {
        width: "100%"
    },
    button: {
        backgroundColor: "#FFCC00",
        borderRadius: 9,
        paddingVertical: 15,
        alignItems: "center",
        marginTop: 20,
        width: "100%"
    },
    buttonText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#000000"
    },
    register: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 25,
        flexWrap: "wrap"
    },
    registerText: {
        fontSize: 14,
        color: "#555555"
    },
    registerLink: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#000000",
        textDecorationLine: "underline"
    }
})
