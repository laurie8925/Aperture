import { View, Text } from "react-native";
import { Button } from "@rneui/themed";
import { RootStackParamList } from "../../types/NavigationType";
import { NavigationProp } from "@react-navigation/native";

interface PromptCardProps {
  token: string;
  prompt: string;
  promptId: string;
  navigation: NavigationProp<RootStackParamList>;
}

const PromptCard = ({
  token,
  prompt,
  promptId,
  navigation,
}: PromptCardProps) => {
  console.log("from prompt card", token, prompt, promptId);
  return (
    <View>
      <Text>Today's Prompt</Text>
      <Text>{prompt}</Text>
      <Button
        title="Add"
        onPress={() =>
          navigation.navigate("UploadEntry", {
            token: token,
            promptId: promptId,
            prompt: prompt,
            navigation: navigation,
            size: 150,
          })
        }
      />
    </View>
  );
};

export default PromptCard;
