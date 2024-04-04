import { Separator } from "@fenamnow/ui/components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@fenamnow/ui/components/ui/tabs";
import AccountAndSecuritySettings from "../components/account-and-security";
import ProfileSettings from "../components/profile";

export default function SettingsScreen() {
  return (
    <div className="container flex size-full flex-col justify-between pt-2">
      <div className="h-[90%] flex-1">
        <Tabs
          defaultValue="profile"
          orientation="vertical"
          className="flex size-full"
        >
          <div className="flex h-full w-1/4 flex-col justify-start py-12">
            <TabsList className="h-max max-w-full flex-col items-start space-y-4">
              <TabsTrigger className="w-full" value="profile">
                Profile
              </TabsTrigger>
              <TabsTrigger className="w-full" value="account">
                Account and Security
              </TabsTrigger>

              {/* <TabsTrigger className="w-full" value="security">
                Notifications
              </TabsTrigger> */}
            </TabsList>
          </div>
          <Separator orientation="vertical" className="mx-8" />
          <TabsContent value="profile" className="h-full w-3/4 py-10">
            <ProfileSettings />
          </TabsContent>
          <TabsContent value="account" className="h-full w-3/4 py-10">
            <AccountAndSecuritySettings />
          </TabsContent>
          <TabsContent value="security" className="h-full w-3/4 p-10">
            {/* <Card className="w-full">
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
              </CardHeader>
            </Card> */}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
