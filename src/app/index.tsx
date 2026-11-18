import { StyleSheet, View } from "react-native";
import AddNotes from "./notes/addNotes";
import GetNotes from "./notes/gettingNotes";

export default function Home() {
  return (
    
    <View style={styles.container}>
          <AddNotes/>
          <GetNotes/>
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