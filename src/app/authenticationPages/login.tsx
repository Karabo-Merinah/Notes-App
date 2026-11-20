import { colors } from "@/constants/cardColors"
import AsyncStorage from "@react-native-async-storage/async-storage"
import bcrypt from "bcryptjs"
import { Link, router } from "expo-router"
import { Eye, EyeOff, LockKeyhole, LogIn, Mail } from "lucide-react-native"
import { useState } from "react"
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

export default function Login() {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)


    //login the registered user
    const login = async () => {
        if (loading) {
            return
        }

        //validate the login fields
        if (email.trim() === "" || password.trim() === "") {
            Alert.alert("Error", "Please enter your email and password.")
            return
        }

        setLoading(true)

        try {
            //get registered users
            const storedUsers = await AsyncStorage.getItem("users")

            if (storedUsers === null) {
                Alert.alert("Error", "Invalid email or password.")
                return
            }

            //convert saved users into an array
            const users = JSON.parse(storedUsers)
            //find the user by email
            const user = users.find((item: {
                email: string
            }) => item.email === email.trim().toLowerCase()
            )

            if (!user) {
                Alert.alert("Error", "Invalid email or password.")
                return
            }

            //compare the entered password with the saved password hash
            const passwordMatches = await bcrypt.compare(password, user.password)

            if (!passwordMatches) {
                Alert.alert("Error", "Invalid email or password.")
                return
            }

            //save the logged in user's details without the password
            const loggedInUser = {
                id: user.id,
                username: user.username,
                email: user.email
            }

            await AsyncStorage.setItem("user", JSON.stringify(loggedInUser))

            //redirect to the home page
            router.replace("/pages/home")
        }
        catch (error) {
            console.log(error)
            Alert.alert("Error", "Could not log in.")
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

                        {/* Heading */}
                        <View style={styles.header}>
                            <View style={styles.headerIconShadow}>
                                <View style={styles.headerIcon}>
                                    <LogIn size={30} color="#000000" />
                                </View>
                            </View>
                            <Text style={styles.heading}>Welcome Back</Text>
                            <Text style={styles.description}>Login to access your notes</Text>
                        </View>

                        {/* Login form */}
                        <View style={styles.form}>
                            <Text style={styles.label}>Email Address</Text>
                            <View style={styles.emailShadow}>
                                <View style={styles.inputContainer}>
                                    <Mail size={20} color={colors.text} />
                                    <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Enter your email" placeholderTextColor="#999999" keyboardType="email-address" autoCapitalize="none" autoCorrect={false} autoComplete="email" />
                                </View>
                            </View>
                            <Text style={styles.label}>Password</Text>

                            <View style={styles.passwordShadow}>
                                <View style={styles.inputContainer}>
                                    <LockKeyhole size={20} color={colors.text} />
                                    <TextInput style={styles.input} value={password}  onChangeText={setPassword} placeholder="Enter your password"   placeholderTextColor="#999999"  secureTextEntry={!showPassword} autoCapitalize="none" autoCorrect={false}  />
                                    {/* toggle password visibility */}
                                    <Pressable style={styles.eyeButton} onPress={() => setShowPassword(!showPassword)}  accessibilityRole="button" accessibilityLabel={showPassword ? "Hide password" : "Show password"} >
                                        {showPassword ? (
                                            <EyeOff size={21} color={colors.text} />
                                        ) : (
                                            <Eye size={21} color={colors.text} />
                                        )}
                                    </Pressable>
                                </View>
                            </View>

                            <View style={styles.buttonShadow}>
                                <Pressable style={[styles.button, loading && styles.disabledButton]} onPress={login} disabled={loading}>
                                    <Text style={styles.buttonText}>{loading ? "Logging in..." : "Login"}</Text>
                                </Pressable>
                            </View>

                        </View>

                        {/* Register link */}
                        <View style={styles.register}>
                            <Text style={styles.registerText}>Don't have an account? </Text>
                            <Link href="/authenticationPages/register" style={styles.registerLink}>Sign up</Link>
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
        marginBottom: 35
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
        marginBottom: 24
    },
    passwordShadow: {
        backgroundColor: colors.blue,
        borderRadius: 12,
        paddingRight: 4,
        paddingBottom: 4,
        marginBottom: 30
    },
    eyeButton: {
    padding: 10,
    alignItems: "center",
    justifyContent: "center"
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
    register: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 30,
        flexWrap: "wrap"
    },
    registerText: {
        fontSize: 14,
        color: colors.secondaryText
    },
    registerLink: {
        fontSize: 14,
        fontWeight: "bold",
        color: colors.text,
        textDecorationLine: "underline"
    }
})
