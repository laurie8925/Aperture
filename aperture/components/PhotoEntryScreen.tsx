import { View } from "react-native";
import { usePhotoEntry } from "./usePhotoEntry";
import UploadEntry from "./UploadEntry";
import { useEffect } from "react";

export default function PhotoEntryScreen({ navigation }) {
  const { token, prompt, promptId, existingEntry, checkEntry } =
    usePhotoEntry(navigation);

  useEffect(() => {
    console.log(
      "PhotoEntryScreen - Rendered with existingEntry:",
      existingEntry
    );
  }, [existingEntry]);

  if (existingEntry) {
    console.log(
      "PhotoEntryScreen - existingEntry is true, should not render UploadEntry"
    );
    return null;
  }

  return (
    <View>
      <UploadEntry
        token={token}
        promptId={promptId}
        navigation={navigation}
        prompt={prompt}
        size={150}
        checkEntry={checkEntry}
      />
    </View>
  );
}
