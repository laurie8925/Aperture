import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import { supabase } from "./utils/supabase";
import { Session } from "@supabase/supabase-js";
import AppNavigator from "./navigation/AppNavigator";
import { useCustomFonts } from "./hooks/useFont";

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const fontsLoaded = useCustomFonts();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return <AppNavigator session={session} />;
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
