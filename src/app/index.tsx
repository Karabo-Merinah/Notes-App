import { StyleSheet, Text, View } from "react-native";
import Register from "./authenticationPages/register";

export default function Home() {
  return (
    <View style={styles.container}>
      <Text>Notes Application</Text>
          <Register/>
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