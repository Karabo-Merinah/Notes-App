import { Pressable, StyleSheet, Text, TextInput, View, Alert } from "react-native"

export default function Register() {

    return (
        <View style={styles.register}>
            <Text style={styles.register_heading}>Register  </Text>
            <Text style={styles.labels}>Email address</Text>
            <TextInput style={styles.input} keyboardType="email-address" placeholder="test@example.com" placeholderTextColor={'gray'} autoCapitalize="none" />
            <Text style={styles.labels}>Username</Text>
            <TextInput  style={styles.input} placeholder="Username" placeholderTextColor={'gray'} />
            <Text style={styles.labels}>Create Password</Text>
            <TextInput style={styles.input} placeholder="password" placeholderTextColor={'gray'} />
            <Pressable onPress={() => console.log('Registered!')}>
                <Text style={styles.button}>Register</Text>
            </Pressable>
        </View>
    )
}
const styles = StyleSheet.create({
    register: {
        backgroundColor: '#FDFDFD',
        justifyContent: 'center'
    },
    register_heading: {
        textAlign: 'center',
        fontSize: 20
    },
    labels: {
        color: 'black',
        fontWeight: 'bold'
    },
    input: {
        borderColor: '#941818',
        borderWidth: 1,
        borderRadius: 9
    },
    button: {
        fontSize: 18
    }
})