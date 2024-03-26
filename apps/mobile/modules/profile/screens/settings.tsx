import { useSession } from "@/lib/providers/session";
import { WIDTH } from "@/lib/utils/constants";
import { Screen } from "@/modules/common/ui/screen";
import { useColorMode } from "@gluestack-style/react";
import { Stack } from "expo-router";
import { useState } from "react";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import AccountSettings from "../components/settings/account";
import ProfileSettings from "../components/settings/profile";

export default function SettingsScreen() {
  const { session, deleteAccount } = useSession();
  const colorMode = useColorMode();
  const [index, setIndex] = useState(0);

  const renderScene = SceneMap({
    profileSettings: () => <ProfileSettings session={session} />,
    accountSettings: () => (
      <AccountSettings session={session} deleteAccount={deleteAccount} />
    )
  });

  const [routes] = useState([
    { key: "profileSettings", title: "Profile" },
    { key: "accountSettings", title: "Account" }
  ]);
  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: "#0e96f8" }}
      style={{ backgroundColor: colorMode == "light" ? "#F6F6F6" : "#171717" }}
      labelStyle={{
        color: "#0e96f8",
        fontFamily: "Inter_500Medium"
      }}
    />
  );

  return (
    <>
      <Stack.Screen options={{ headerBackButtonMenuEnabled: true }} />
      <Screen edges={["bottom"]} paddingHorizontal={"$0"}>
        <TabView
          renderTabBar={renderTabBar}
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: WIDTH }}
        />
      </Screen>
    </>
  );
}
