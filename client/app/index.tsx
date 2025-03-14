import 'react-native-url-polyfill/auto'
import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase'
import Auth from '../components/Auth'
import { View, Text, StyleSheet } from 'react-native'
import { Session } from '@supabase/supabase-js'
import { Link, Stack } from 'expo-router';

export default function App() {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  return (
    <View style={styles.container}>
       <Stack.Screen
        options={{
          title: 'Aperture',
          headerStyle: { backgroundColor: '#f4511e' },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Auth />
      {/* {session && session.user && <Text>{session.user.id}</Text>} */}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { backgroundColor:'#888E62', height:"100%", display:"flex", justifyContent:"center"},
});