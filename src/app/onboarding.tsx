
import { colors } from "@/constants/cardColors"
import { router } from "expo-router"
import { ArrowRight, UserPlus } from "lucide-react-native"
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

export default function Onboarding() {

    return (
        <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} >
                {/* display the onboarding illustration */}
                <View style={styles.imageContainer}>
                    <Image source={require("../../assets/illustrations/note_illustration.png")} style={styles.image} resizeMode="contain" />
                </View>


                {/* display the welcome heading and description */}
                <View style={styles.welcome}>
                    <Text style={styles.smallHeading}>WELCOME TO MY NOTES</Text>

                    <Text style={styles.heading}>Your thoughts, organised.  </Text>

                    <Text style={styles.description}> Capture your ideas, organise your notes and
                        keep everything in one place.
                    </Text>
                </View>

                {/* navigate to the login and registration pages */}
                <View style={styles.bottom}>
                    <View style={styles.signInShadow}>
                        <Pressable style={styles.signInButton} onPress={() => router.push("/authenticationPages/login")} >
                            <Text style={styles.signInText}>Sign In</Text>
                            <ArrowRight size={20} color={colors.text} />
                        </Pressable>
                    </View>

                    <View style={styles.signUpShadow}>
                        <Pressable style={styles.signUpButton} onPress={() => router.push("/authenticationPages/register")}>
                            <UserPlus size={20} color={colors.text} />
                            <Text style={styles.signUpText}>Create an Account</Text>
                        </Pressable>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background
    },
    content: {
        flexGrow: 1,
        justifyContent: "space-between",
        paddingHorizontal: 25,
        paddingTop: 25,
        paddingBottom: 30
    },
    imageContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 20
    },
    image: {
        width: 270,
        height: 270
    },
    welcome: {
        alignItems: "center",
        marginBottom: 35
    },
    smallHeading: {
        fontSize: 12,
        fontWeight: "bold",
        color: colors.text,
        letterSpacing: 2,
        marginBottom: 15
    },
    heading: {
        fontSize: 30,
        fontWeight: "bold",
        color: colors.text,
        textAlign: "center",
        lineHeight: 38,
        marginBottom: 12
    },
    headingUnderline: {
        width: 95,
        height: 6,
        backgroundColor: colors.primary,
        borderRadius: 5,
        marginBottom: 20
    },
    description: {
        fontSize: 15,
        color: colors.secondaryText,
        textAlign: "center",
        lineHeight: 24,
        maxWidth: 320
    },
    bottom: {
        width: "100%",
        gap: 18
    },
    signInShadow: {
        backgroundColor: colors.text,
        borderRadius: 12,
        paddingRight: 5,
        paddingBottom: 5
    },
    signInButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        backgroundColor: colors.primary,
        borderWidth: 1,
        borderColor: colors.border,
        paddingVertical: 16,
        borderRadius: 12
    },
    signInText: {
        color: colors.text,
        fontSize: 16,
        fontWeight: "bold"
    },
    signUpShadow: {
        backgroundColor: colors.blue,
        borderRadius: 12,
        paddingRight: 5,
        paddingBottom: 5
    },
    signUpButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        backgroundColor: colors.background,
        borderWidth: 1,
        borderColor: colors.border,
        paddingVertical: 16,
        borderRadius: 12
    },
    signUpText: {
        color: colors.text,
        fontSize: 16,
        fontWeight: "bold"
    }
})
