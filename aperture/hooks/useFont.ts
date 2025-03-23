// utils/useCustomFonts.ts
import { useFonts } from "expo-font";
import {
  PlayfairDisplay_400Regular,
  PlayfairDisplay_700Bold,
} from "@expo-google-fonts/playfair-display";
import {
  RedHatDisplay_400Regular,
  RedHatDisplay_500Medium,
  RedHatDisplay_700Bold,
} from "@expo-google-fonts/red-hat-display";

export const useCustomFonts = () => {
  const [fontsLoaded] = useFonts({
    PlayfairDisplay: PlayfairDisplay_400Regular,
    PlayfairDisplayBold: PlayfairDisplay_700Bold,
    RedHatDisplay: RedHatDisplay_400Regular,
    RedHatDisplayMed: RedHatDisplay_500Medium,
    RedHatDisplayBold: RedHatDisplay_700Bold,
  });

  if (fontsLoaded) {
    console.log(
      "Fonts loaded: PlayfairDisplay, RedHatDisplay, RedHatDisplayBold"
    );
  }
  return fontsLoaded;
};
