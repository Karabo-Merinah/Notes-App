import CustomInput from "@/components/CustomInput"
import { Link } from "expo-router"
import { useState } from "react"
import { Alert, KeyboardAvoidingView, Pressable, StyleSheet, Text, View } from "react-native"


export default function Register() {

    const [email, setEmail] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [emailError, setEmailError] = useState("")
    const [passwordError, setPasswordError] = useState("")
    const [usernameError, setUsernameError] = useState("")


    const registering = () => {

        let isValid=true 

        //validates the email format 
        if (!email.includes('@') || !(email.includes('.com') || email.includes('.co.za'))) {
            setEmailError('Invalid email format.Example test@example.com')
        }
        else {
            setEmailError("")
        }

        //checks if  password requirements are met 
        const number = '0123456789'
        const hasDigit = password.split("").some((num) => number.includes(num))
        const specialCharacter = '@&*%$'
        const hasSpecialCharacter = password.split("").some((char) => specialCharacter.includes(char))

        if (password.length < 8 || !hasDigit || !hasSpecialCharacter) {
            setPasswordError("Password should contain at least minimum of 8 characters,digit and special character.")
        }
        else {
            setPasswordError("")
        }
        //validate the username length 
        if (username.trim().length < 5) {
            setUsernameError("Username shouldn't be less than 5 characters.")
        }
        else {
            setUsernameError("")
        }

        //only register when the fields are validated 
        if(isValid){
           Alert.alert("Success","Registered successfully !")
        }
    }

    return (
        <View style={styles.register}>
            <Text style={styles.register_heading}>Register</Text>
            <KeyboardAvoidingView behavior="padding">
                <CustomInput name={'Email Address'} onChange={setEmail} />
                {emailError !== "" && (
                    <Text style={styles.errors}>{emailError}</Text>
                )}
                <CustomInput name={'Username'} onChange={setUsername} />
                {usernameError !== "" && (
                    <Text style={styles.errors}>{usernameError}</Text>
                )}
                <CustomInput name={'Create Password'} onChange={setPassword} />
                {passwordError !== "" && (
                    <Text style={styles.errors}>{passwordError}</Text>
                )}
                <View style={styles.registerAndLogin}>
                    <Pressable onPress={registering}>
                        <Text style={styles.button}>Register</Text>
                    </Pressable>
                    <View style={styles.login}>
                        <Text style={styles.login_register}>Already have account? </Text>
                        <Link href="/authenticationPages/login" style={styles.login_register_link}> Login</Link>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </View>
    )
}
const styles = StyleSheet.create({
    register: {
        backgroundColor: '#FDFDFD',
        justifyContent: 'center',
        flex: 1,
        padding: 20,
        borderWidth: 1,
        color: '#EDEDED',
        borderRadius: 9

    },
    register_heading: {
        textAlign: 'center',
        fontSize: 20,
        marginTop: 10
    },
    button: {
        fontSize: 18,
        backgroundColor: 'black',
        color: '#FDFDFD',
        textAlign: 'center',
        borderRadius: 8,
        width: 250,
        height: 40,
        paddingTop: 10,
        justifyContent: 'center'
    },
    login: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    login_register: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    login_register_link: {
        textDecorationLine: 'underline',
        color: 'blue'
    },
    registerAndLogin: {
        gap: 15,
        justifyContent: 'center',
        padding: 20
    },
    errors: {
        color: 'red'
    }
})