import { StyleSheet } from "react-native";
import { Redirect } from "expo-router";

export default function Home() {
    return <Redirect href="/onboarding" />
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
})