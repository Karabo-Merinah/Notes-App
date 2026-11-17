import { StyleSheet, Text, View } from "react-native";
import Register from "./authenticationPages/register";
import Login from "./authenticationPages/login";

export default function Home() {
  return (
    <View style={styles.container}>
      <Text>Notes Application</Text>
          <Register/>
          <Login/>
    </View>

  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
})