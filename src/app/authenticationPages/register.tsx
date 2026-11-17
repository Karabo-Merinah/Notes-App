import CustomInput from "@/components/CustomInput"
import { Link } from "expo-router"
import { useState } from "react"
import { KeyboardAvoidingView, Pressable, StyleSheet, Text, View } from "react-native"


export default function Register() {

    // Store the values entered by the user
    const [email, setEmail] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    return (
        <View style={styles.register}>
            <Text style={styles.register_heading}>Register</Text>
           <KeyboardAvoidingView behavior="padding">
            <CustomInput name={'Email Address'} onChange={setEmail} />
            <CustomInput name="Username" onChange={setUsername} />
            <CustomInput name="Create Password" onChange={setPassword} />
            <View style={styles.registerAndLogin}>
            <Pressable onPress={() => console.log("Register button pressed")}>
                <Text style={styles.button}>Register</Text>
            </Pressable>
            <View style={styles.login}>
                <Text style={styles.login_register}>Already have account?</Text>
                <Link href='./login' style={styles.login_register_link}>Login</Link>
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
        flex:1,
        padding:20,

    },
    register_heading: {
        textAlign: 'center',
        fontSize: 20
    },
    button: {
        fontSize: 18,
        backgroundColor:'black',
        color:'#FDFDFD',
        textAlign:'center',
        borderRadius:8,
        borderWidth:1,
        width:250
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
        color:'blue'
    },
    registerAndLogin:{
        gap:15
    }
})