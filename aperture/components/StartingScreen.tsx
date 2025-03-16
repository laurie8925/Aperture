import { View, Text, Button,StyleSheet } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'

const StartingScreen = () => {
    const navigation = useNavigation()
  return (
    <View style={styles.container}>
      <Text>StartingScreen</Text>
      <View >
        <Button
          title="StartingScreen"
          
          onPress={()=>navigation.navigate('SignIn')}
        />
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default StartingScreen