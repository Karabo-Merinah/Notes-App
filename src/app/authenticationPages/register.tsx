import { View, Text, StyleSheet } from "react-native"

export default function Register() {

    return (
        <View>
            <Text style={styles.register_heading}>Register  </Text>
        </View>
    )
}
const styles = StyleSheet.create({
    register_heading: {
        textAlign: 'center',
        fontSize: 12
    }
})