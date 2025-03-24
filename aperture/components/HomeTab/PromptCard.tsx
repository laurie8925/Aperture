import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
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
  return (
    <View>
      <Text style={styles.title}>Today's Prompt</Text>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("UploadEntry", {
            token: token,
            promptId: promptId,
            prompt: prompt,
            size: 300,
          })
        }
        style={styles.cardcontainer}
      >
        <Text style={styles.promptstyle}>{prompt}</Text>
        {/* add icon for adding */}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  // container: {
  //   margin: 20,
  // },
  title: {
    fontSize: 24,
    color: "#fff",
    marginBottom: 10,
    fontFamily: "PlayfairDisplayBold",
    paddingLeft: 20,
  },
  promptstyle: {
    fontSize: 20,
    color: "#360C0C",
    fontFamily: "RedHatDisplayBold",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  cardcontainer: {
    backgroundColor: "#F7EAD8",
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 30,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});

export default PromptCard;
