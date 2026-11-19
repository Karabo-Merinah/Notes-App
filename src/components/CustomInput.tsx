import { Eye, EyeOff } from "lucide-react-native"
import React, { useState } from "react"
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native"

interface Props {
    name: string
    onChange: (text: string) => void
}

const CustomInput: React.FC<Props> = ({ name, onChange }) => {

     const [showPassword, setShowPassword] = useState(false)
    // Check whether the input is for a password
    const isPassword = name.toLowerCase().includes("password")
    const isEmail = name.toLowerCase().includes("email")

    return (
        <View style={styles.inputContainer}>
            <Text style={styles.label}>{name}</Text>
            <View style={styles.inputWrapper}>
                <TextInput  style={styles.input} placeholder={isPassword ? "Enter your password" : `Enter ${name.toLowerCase()}`} placeholderTextColor="#888888"  onChangeText={onChange}  secureTextEntry={isPassword && !showPassword} keyboardType={isEmail ? "email-address" : "default"}  autoCapitalize={isEmail || isPassword ? "none" : "sentences"} />
                {isPassword && (
                    <Pressable style={styles.eyeButton} onPress={() => setShowPassword(!showPassword)} accessibilityRole="button" accessibilityLabel={showPassword ? "Hide password" : "Show password"}>
                        {showPassword ? <EyeOff size={21} color="#555555" /> : <Eye size={21} color="#555555" />}
                    </Pressable>
                )}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    inputContainer: {
        width: "100%",
        marginBottom: 18
    },
    label: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#000000",
        marginBottom: 9
    },
    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#E5E5E5",
        borderRadius: 12,
        backgroundColor: "#FAFAFA"
    },
    input: {
        flex: 1,
        paddingHorizontal: 15,
        paddingVertical: 14,
        fontSize: 15,
        color: "#000000"
    },
    eyeButton: {
        padding: 12
    }
})

export default CustomInput
