import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {

  const navigation = useNavigation()

  return (
    <View style={styles.container}>
      <Text>Home Screen</Text>
      <Text onPress = {()=> navigation.navigate("Entry")}>Go to Photo Entry</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});