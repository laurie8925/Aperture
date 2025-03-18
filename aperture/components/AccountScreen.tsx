import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { emitSignOut } from '../utils/authEvent';

interface AccountProps {
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AccountScreen({ setIsAuthenticated }:AccountProps) {
  const handleSignOut = async () => {
    try {
      console.log('signing out...');
      await AsyncStorage.removeItem('token'); // Clear the token
      console.log('Token removed');
      emitSignOut();
      setIsAuthenticated(false);
    } catch (err) {
      console.error('Error during sign-out:', err);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Profile Screen</Text>
      <Button title="Sign Out" onPress={handleSignOut} />
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