import CustomInput from "@/components/CustomInput"
import { Link } from "expo-router"
import { useState } from "react"
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native"

export default function Register() {

    const [email, setEmail] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [emailError, setEmailError] = useState("")
    const [passwordError, setPasswordError] = useState("")
    const [usernameError, setUsernameError] = useState("")

    const registering = () => {

        let isValid = true

        // Validate email format
        if (!email.includes("@") || !(email.includes(".com") || email.includes(".co.za"))) {
            setEmailError("Invalid email format. Example: test@example.com")
            isValid = false
        }
        else {
            setEmailError("")
        }

        // Check password requirements
        const number = "0123456789"
        const hasDigit = password.split("").some((num) => number.includes(num))
        const specialCharacter = "@&*%$"
        const hasSpecialCharacter = password.split("").some((char) => specialCharacter.includes(char))

        if (password.length < 8 || !hasDigit || !hasSpecialCharacter) {
            setPasswordError("Password must contain at least 8 characters, a digit and a special character.")
            isValid = false
        }
        else {
            setPasswordError("")
        }

        // Validate username length
        if (username.trim().length < 5) {
            setUsernameError("Username must contain at least 5 characters.")
            isValid = false
        }
        else {
            setUsernameError("")
        }

        // Only register when fields are valid
        if (isValid) {
            Alert.alert("Success", "Registration details are valid!")
        }
    }

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
            <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">

                <View style={styles.formContainer}>
                    {/* Heading */}
                    <View style={styles.header}>
                        <Text style={styles.heading}>Create Account</Text>
                        <Text style={styles.description}>Sign up to start organising your notes</Text>
                    </View>

                    {/* Registration form */}
                    <View style={styles.form}>
                        <CustomInput name="Email Address" onChange={setEmail} />
                        {emailError !== "" && <Text style={styles.errors}>{emailError}</Text>}

                        <CustomInput name="Username" onChange={setUsername} />
                        {usernameError !== "" && <Text style={styles.errors}>{usernameError}</Text>}

                        <CustomInput name="Create Password" onChange={setPassword} />
                        {passwordError !== "" && <Text style={styles.errors}>{passwordError}</Text>}

                        <Pressable style={styles.button} onPress={registering}>
                            <Text style={styles.buttonText}>Register</Text>
                        </Pressable>
                    </View>

                    {/* Login link */}
                    <View style={styles.login}>
                        <Text style={styles.loginText}>Already have an account? </Text>
                        <Link href="/authenticationPages/login" style={styles.loginLink}>Login</Link>
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
    login: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 25,
        flexWrap: "wrap"
    },
    loginText: {
        fontSize: 14,
        color: "#555555"
    },
    loginLink: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#000000",
        textDecorationLine: "underline"
    },
    errors: {
        color: "red",
        fontSize: 13,
        marginBottom: 10
    }
})
