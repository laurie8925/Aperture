import { View, Text, Image, StyleSheet } from "react-native";
import { Button, Input } from "@rneui/themed";
import React from "react";

export default function ShowEntryScreen({ route }: { route: any }) {
  const { photoUrl, note, prompt } = route.params;
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: photoUrl }}
        style={[styles.avatar, styles.image, { width: 300, height: 300 }]}
      />
      <Input label="Prompt" value={prompt} disabled />
      <Input label="Note" value={note} disabled />
    </View>
  );
}

const styles = StyleSheet.create({
  // ... (keep your existing styles)
  container: {
    flex: 1,
    padding: 20,
  },
});
