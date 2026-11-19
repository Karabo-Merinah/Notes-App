import { router } from "expo-router"
import { Image, Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native"

export default function Onboarding() {

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.imageContainer}>
                <Image source={require("../../assets/illustrations/note_illustration.png")} style={styles.image} resizeMode="contain" />
            </View>
            <View style={styles.welcome}>
                <Text style={styles.heading}>Your thoughts, organised.</Text>
                <Text style={styles.description}>Capture your ideas, organise your notes and keep everything in one place.</Text>
            </View>
            <View style={styles.bottom}>
                <Pressable style={styles.signInButton} onPress={() => router.push("/authenticationPages/login")}>
                    <Text style={styles.signInText}>Sign In</Text>
                </Pressable>

                <Pressable style={styles.signUpButton} onPress={() => router.push("/authenticationPages/register")}>
                    <Text style={styles.signUpText}>Sign Up</Text>
                </Pressable>
            </View>

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        paddingHorizontal: 20
    },
    imageContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    image: {
        width: 280,
        height: 320
    },
    welcome: {
        alignItems: "center",
        marginBottom: 45
    },
    heading: {
        fontSize: 30,
        fontWeight: "bold",
        color: "#000000",
        textAlign: "center",
        marginBottom: 15
    },
    description: {
        fontSize: 15,
        color: "#777777",
        textAlign: "center",
        lineHeight: 23,
        paddingHorizontal: 10
    },
    bottom: {
        paddingBottom: 30,
        gap: 12
    },
    signInButton: {
        backgroundColor: "#FFCC00",
        paddingVertical: 16,
        borderRadius: 10,
        alignItems: "center"
    },
    signInText: {
        color: "#000000",
        fontSize: 16,
        fontWeight: "bold"
    },
    signUpButton: {
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#000000",
        paddingVertical: 16,
        borderRadius: 10,
        alignItems: "center"
    },
    signUpText: {
        color: "#000000",
        fontSize: 16,
        fontWeight: "bold"
    }
})
