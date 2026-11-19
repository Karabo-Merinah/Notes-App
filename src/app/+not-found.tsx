import {View,StyleSheet} from 'react-native'
import {Link,Stack} from 'expo-router'

export default function NotFoundScreen(){
    return(
        <>
        <Stack.Screen options={{title:'Oops! Page not found'}}/>
        <View style={styles.container}>
            <Link href="/authenticationPages/register" style={styles.button}>
            Go back to register page
            </Link>
        </View>
        </>
    )
}

const styles=StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center',
        justifyContent:'center'
    },
    button:{
        fontSize:20,
        textDecorationLine:'underline',
        color:'#FFFFFF'
    }
})