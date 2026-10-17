import { useAuth } from "@clerk/expo";
import { Redirect } from "expo-router";
import { NativeTabs } from "expo-router/unstable-native-tabs";
import { useColorScheme } from "nativewind";

/**
 * Layout del gruppo (home): è la "guardia" dell'area protetta.
 * Ogni schermata dentro app/(home)/ è accessibile solo da autenticati.
 */
export default function TabsLayout() {
  const { isLoaded, isSignedIn } = useAuth();

  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const tabTintColor = isDark ? "hsl(142, 70%, 54%)" : "hsl(147, 75%, 33%)";
  console.log(
    "[(Tabs)/_layout] colorScheme",
    colorScheme,
    "isDark",
    isDark,
    "tabTintColor",
    tabTintColor,
  );
  if (!isLoaded) return null;

  // Non autenticato (primo avvio, logout, sessione scaduta) → login
  if (!isSignedIn) return <Redirect href="/sign-in" />;

  return (
    <NativeTabs tintColor={tabTintColor}>
      <NativeTabs.Trigger name="index">
        /*file name */
        <NativeTabs.Trigger.Label>List</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{
            default: "list.bullet.clipboard",
            selected: "list.bullet.clipboard.fill",
          }}
          md="list"
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="planner">
        <NativeTabs.Trigger.Icon
          sf={{
            default: "plus.circle",
            selected: "plus.circle.fill",
          }}
          md="add"
        />
        <NativeTabs.Trigger.Label>Planner</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="insights">
        <NativeTabs.Trigger.Icon
          sf={{
            default: "chart.bar",
            selected: "chart.bar.fill",
          }}
          md="analytics"
        />
        <NativeTabs.Trigger.Label>Insights</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
