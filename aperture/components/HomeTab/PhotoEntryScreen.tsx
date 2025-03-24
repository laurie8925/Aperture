import { View } from "react-native";
import { usePhotoEntry } from "../../hooks/usePhotoEntry";
import UploadEntry from "./UploadEntry";
import { RootStackParamList } from "../../types/NavigationType";
import { NavigationProp } from "@react-navigation/native";
import { useEffect } from "react"; // Add useEffect

interface Props {
  navigation: NavigationProp<RootStackParamList>;
}

export default function PhotoEntryScreen({ navigation }: Props) {
  const { token, prompt, promptId } = usePhotoEntry(navigation);

  return (
    <View>
      <UploadEntry
        token={token}
        promptId={promptId}
        navigation={navigation}
        prompt={prompt}
        size={150}
      />
    </View>
  );
}
