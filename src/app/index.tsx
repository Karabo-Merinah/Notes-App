import { Redirect } from "expo-router";
import { StyleSheet, View } from "react-native";
import HomePage from "./pages/home";

export default function Home() {
  return (
    
    <View style={styles.container}>
      {/* return <Redirect href="/onboarding"/> */}
      <HomePage/>
          {/* <AddNotes/>
          <GetNotes/> */}
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