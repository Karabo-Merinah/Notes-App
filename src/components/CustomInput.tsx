import React from "react"
import { StyleSheet, Text, TextInput, View } from "react-native"

interface Props {
    name: string,
    onChange: (text: string) => void
}


const CustomInput: React.FC<Props> = ({ name, onChange }) => {
    return (
        <View style={styles.inputContainer}>
            <Text style={styles.labels}>{name}</Text>
            <TextInput placeholder={name} style={styles.input} placeholderTextColor="#717171" onChangeText={onChange} />
        </View>
    )
}

export default CustomInput

const styles = StyleSheet.create({
    inputContainer: {
        justifyContent: 'center',
        marginHorizontal: 20,
        paddingVertical: 10
    },
    labels: {
        color: 'black',
        fontWeight: 'bold'
    },
    input: {
        borderColor: '#EDEDED',
        borderWidth: 1,
        borderRadius: 9,
        marginTop: 10,
        width: 250
    },
})