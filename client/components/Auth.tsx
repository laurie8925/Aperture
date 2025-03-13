import React, { useState } from 'react';
import { Alert, StyleSheet, View, Text } from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome";
import { supabase } from '../lib/supabase';
import { Button, Input } from '@rneui/themed';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    setLoading(true)
    console.log("Sign In triggered");
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    console.log

    const user = data.user; // get user from the response
  if (user) {
    const { error: updateError } = await supabase
      .from('profiles') // Replace 'users' with your actual table name
      .update({ is_active: true })
      .eq('id', user.id); // match user by their ID

    if (updateError) {
      console.error('Failed to update is_active:', updateError.message);
      Alert.alert('Error updating user status');
    }
  }
    if (error) Alert.alert(error.message)
    setLoading(false)
  }

  async function signUpWithEmail() {
    setLoading(true)
    console.log("Sign up triggered");
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    })

    if (error) Alert.alert(error.message)
    if (!session) Alert.alert('Please check your inbox for email verification!')
    setLoading(false)
  }

  return (
    <View style={styles.container}>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Input style={styles.placeholder}
          inputStyle={styles.text} // Styles the text inside the input
          label={ <View style={styles.labelContainer}>
          <Icon name="envelope" color="#360C0C" size={23}/>
          <Text style={styles.text}>Email</Text>
        </View>} 
        //   leftIcon={{ type: 'font-awesome', name: 'envelope' }}
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@email.com"
          placeholderTextColor="#c2b6b6"
          autoCapitalize="none"
          keyboardType="email-address" // Better for Android
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Input style={[styles.placeholder, styles.text]}
         label={ 
         <View style={styles.labelContainer}>
            <Icon name="lock" color="#360C0C" size={30}/>
            <Text style={styles.text}>Password</Text>
        </View>} 
        //   label={<Text style={styles.text}>Password</Text>} 
        //   leftIcon={{ type: 'font-awesome', name: 'lock' }}
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          placeholderTextColor="#c2b6b6"
          autoCapitalize="none"
        />
      </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
  <Button 
    buttonStyle={styles.button} 
    title="Sign In"
    titleStyle={styles.buttonText}
    disabled={loading}
    onPress={signInWithEmail}
  />
</View>
<View style={styles.verticallySpaced}>
  <Button 
    buttonStyle={styles.button} 
    title="Sign Up"
    titleStyle={styles.buttonText}
    disabled={loading}
    onPress={signUpWithEmail}
  />
</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 40, padding: 12 },
  verticallySpaced: { paddingTop: 4, paddingBottom: 4, justifyContent: "center", 
    alignItems: "center",},
  mt20: { marginTop: 20 },
  placeholder: {
    backgroundColor: "#f6ebd9", // Light beige
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 999, // Fully rounded
    shadowColor: "#000",
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5, 
    alignItems: "center",
  },
  text: {
    color: "#360C0C", 
    fontSize: 16,
    fontWeight: "bold",
  },

  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
    gap: 10
  },

  button:{ 
    backgroundColor: "#360C0C", 
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 999, 
    shadowColor: "#000",
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5, 
    width: 200,
    alignItems: "center",
  },

  buttonText:{ 
    color: "#F7EAD8", 
    fontSize: 16,
    fontWeight: "bold",
    textAlign: 'center'
  }
});