import { colors } from "@/constants/cardColors"
import AsyncStorage from "@react-native-async-storage/async-storage"
import bcrypt from "bcryptjs"
import * as Crypto from "expo-crypto"
import { Link, router } from "expo-router"
import { Eye, EyeOff, LockKeyhole, Mail, UserRound, UserRoundPlus } from "lucide-react-native"
import { useState } from "react"
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"


export default function Register() {

    const [email, setEmail] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [emailError, setEmailError] = useState("")
    const [passwordError, setPasswordError] = useState("")
    const [usernameError, setUsernameError] = useState("")
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    //provide secure random bytes for bcryptjs in React Native
    bcrypt.setRandomFallback((length) => {
        return Array.from(Crypto.getRandomBytes(length))
    })

    const registering = async () => {

        if (loading) {
            return
        }
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
        if (!isValid) {
            return
        }

        setLoading(true)

        try {
            //get existing registered users
            const storedUsers = await AsyncStorage.getItem("users")
            const users = storedUsers ? JSON.parse(storedUsers) : []

            //check if the email is already registered
            const existingUser = users.find(
                (user: { email: string }) => user.email === email.trim().toLowerCase()
            )

            if (existingUser) {
                setEmailError("This email is already registered.")
                return
            }

            //check the password type and bcrypt version
            console.log("Password type:", typeof password)

            //generate the salt
            const salt = await bcrypt.genSalt(10)

            //check the generated salt
            console.log("Salt type:", typeof salt)

            //hash the password before saving
            const hashedPassword = await bcrypt.hash(password, salt)

            //create the new user
            const newUser = {
                id: Date.now().toString(),
                username: username.trim(),
                email: email.trim().toLowerCase(),
                password: hashedPassword
            }
            //save the registered user
            users.push(newUser)
            await AsyncStorage.setItem("users", JSON.stringify(users))

            Alert.alert("Success", "Account created successfully!", [
                { text: "Login", onPress: () => router.replace("/authenticationPages/login") }
            ])
        }
        catch (error) {
            console.log(error)
            Alert.alert("Error", "Could not create your account.")
        }
        finally {
            setLoading(false)
        }
    }

    return (
        <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
            <KeyboardAvoidingView style={styles.keyboardContainer} behavior={Platform.OS === "ios" ? "padding" : undefined}>
                <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                    <View style={styles.formContainer}>
                        <View style={styles.header}>
                            <View style={styles.headerIconShadow}>
                                <View style={styles.headerIcon}>
                                    <UserRoundPlus size={30} color="#000000" />
                                </View>
                            </View>
                            <Text style={styles.heading}>Create Account</Text>
                            <Text style={styles.description}>Sign up to start organising your notes</Text>
                        </View>
                        <View style={styles.form}>
                            <Text style={styles.label}>Email Address</Text>
                            <View style={styles.emailShadow}>
                                <View style={styles.inputContainer}>
                                    <Mail size={20} color={colors.text} />
                                    <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Enter your email" placeholderTextColor="#999999" keyboardType="email-address" autoCapitalize="none" autoCorrect={false} />
                                </View>
                            </View>
                            {emailError !== "" && <Text style={styles.errors}>{emailError}</Text>}
                            <Text style={styles.label}>Username</Text>
                            <View style={styles.usernameShadow}>
                                <View style={styles.inputContainer}>
                                    <UserRound size={20} color={colors.text} />
                                    <TextInput style={styles.input} value={username} onChangeText={setUsername} placeholder="Enter your username" placeholderTextColor="#999999" autoCapitalize="none" autoCorrect={false} />
                                </View>
                            </View>
                            {usernameError !== "" && <Text style={styles.errors}>{usernameError}</Text>}
                            <Text style={styles.label}>Create Password</Text>

                            <View style={styles.passwordShadow}>
                                <View style={styles.inputContainer}>
                                    <LockKeyhole size={20} color={colors.text} />

                                    <TextInput
                                        style={styles.input}
                                        value={password}
                                        onChangeText={setPassword}
                                        placeholder="Create a password"
                                        placeholderTextColor="#999999"
                                        secureTextEntry={!showPassword}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                    />

                                    {/* toggle password visibility */}
                                    <Pressable style={styles.eyeButton} onPress={() => setShowPassword(!showPassword)} accessibilityRole="button" accessibilityLabel={showPassword ? "Hide password" : "Show password"} >
                                        {showPassword ? (
                                            <EyeOff size={21} color={colors.text} />
                                        ) : (
                                            <Eye size={21} color={colors.text} />
                                        )}
                                    </Pressable>
                                </View>
                            </View>
                            {passwordError !== "" && <Text style={styles.errors}>{passwordError}</Text>}
                            <Text style={styles.passwordInstruction}>At least 8 characters,digit and special character.</Text>
                            <View style={styles.buttonShadow}>
                                <Pressable style={[styles.button, loading && styles.disabledButton]} onPress={registering} disabled={loading}>
                                    <Text style={styles.buttonText}>{loading ? "Registering..." : "Create Account"}</Text>
                                </Pressable>
                            </View>
                        </View>
                        <View style={styles.login}>
                            <Text style={styles.loginText}>Already have an account? </Text>
                            <Link href="/authenticationPages/login" style={styles.loginLink}>Login</Link>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background
    },
    keyboardContainer: {
        flex: 1
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: "center",
        padding: 20,
        paddingVertical: 35
    },
    formContainer: {
        width: "100%",
        maxWidth: 400,
        alignSelf: "center"
    },
    header: {
        alignItems: "center",
        marginBottom: 32
    },
    headerIconShadow: {
        backgroundColor: colors.pink,
        borderRadius: 18,
        paddingRight: 5,
        paddingBottom: 5,
        marginBottom: 22
    },
    headerIcon: {
        width: 68,
        height: 68,
        borderRadius: 18,
        backgroundColor: colors.primary,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: "center",
        justifyContent: "center"
    },
    heading: {
        fontSize: 29,
        fontWeight: "bold",
        color: colors.text,
        marginBottom: 7
    },
    description: {
        fontSize: 15,
        color: colors.secondaryText,
        textAlign: "center"
    },
    form: {
        width: "100%"
    },
    label: {
        fontSize: 15,
        fontWeight: "bold",
        color: colors.text,
        marginBottom: 10
    },
    emailShadow: {
        backgroundColor: colors.pink,
        borderRadius: 12,
        paddingRight: 4,
        paddingBottom: 4,
        marginBottom: 22
    },
    usernameShadow: {
        backgroundColor: colors.blue,
        borderRadius: 12,
        paddingRight: 4,
        paddingBottom: 4,
        marginBottom: 22
    },
    passwordShadow: {
        backgroundColor: colors.green,
        borderRadius: 12,
        paddingRight: 4,
        paddingBottom: 4,
        marginBottom: 12
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 12,
        backgroundColor: colors.background,
        paddingHorizontal: 15,
        minHeight: 54
    },
    input: {
        flex: 1,
        paddingVertical: 14,
        fontSize: 15,
        color: colors.text
    },
    passwordInstruction: {
        fontSize: 12,
        color: colors.secondaryText,
        lineHeight: 19,
        marginBottom: 25,
        fontWeight: 'bold'
    },
    eyeButton: {
        padding: 10,
        alignItems: "center",
        justifyContent: "center"
    },
    buttonShadow: {
        backgroundColor: colors.text,
        borderRadius: 12,
        paddingRight: 5,
        paddingBottom: 5
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
        fontSize: 16,
        fontWeight: "bold",
        color: colors.text
    },
    login: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 30,
        flexWrap: "wrap"
    },
    loginText: {
        fontSize: 14,
        color: colors.secondaryText
    },
    loginLink: {
        fontSize: 14,
        fontWeight: "bold",
        color: colors.text,
        textDecorationLine: "underline"
    },
    errors: {
        color: "#DC2626",
        fontSize: 13,
        marginTop: -14,
        marginBottom: 15
    }
})
