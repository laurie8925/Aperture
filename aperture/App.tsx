import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { supabase } from "./utils/supabase";
import Auth from "./components/Auth";
import { Session } from "@supabase/supabase-js";
import AppNavigator from "./navigation/AppNavigator";

export default function App() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return <AppNavigator/>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#888E62",
    height: "100%",
  },
});
