import CustomInput from "@/components/CustomInput"
import { Link } from "expo-router"
import { useState } from "react"
import { KeyboardAvoidingView, Pressable, StyleSheet, Text, View } from "react-native"


export default function Login() {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    return (

        <KeyboardAvoidingView behavior="padding" style={styles.loginContainer}>
            <View style={styles.container}>
                <Text style={styles.formTitle}>Login</Text>
                <View style={styles.form}>
                    <CustomInput name={'Email Address'} onChange={setEmail} />
                    <CustomInput name={'Password'} onChange={setPassword} />
                    <Pressable onPress={() => console.log('Login')}>
                        <Text style={styles.button}>Login </Text>
                    </Pressable>
                    <View style={styles.register_login}>
                        <Text style={styles.register}>Don't have account yet? </Text>
                        <Link href="/authenticationPages/register" style={styles.register_style}> Sign up </Link>
                    </View>
                </View>
            </View>
        </KeyboardAvoidingView>

    )
}

const styles = StyleSheet.create({
    loginContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FDFDFD',
        padding: 20
    },
    container: {
        borderWidth: 1,
        color: '#EDEDED',
        borderRadius: 9,
        width: '100%',
        maxWidth: 350,
        padding: 20
    },
    formTitle: {
        fontWeight: 'bold',
        fontSize: 20,
        textAlign: 'center'
    },
    form: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    button: {
        backgroundColor: 'black',
        color: '#FDFDFD',
        width: 250,
        borderRadius: 9,
        height: 35,
        textAlign: 'center',
        paddingTop: 10,
        fontSize:16
    },
    register_login: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop:15
    },
    register: {
        color: 'black'

    },
    register_style: {
        color: 'blue',
        textDecorationLine: 'underline'
    }
})