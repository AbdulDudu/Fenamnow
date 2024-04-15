import Storage from "@/lib/utils/storage";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { focusManager, QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { AppStateStatus, Platform } from "react-native";
import { useAppState } from "../hooks/use-app-state";
import { useOnlineManager } from "../hooks/use-online-manager";

function onAppStateChange(status: AppStateStatus) {
  if (Platform.OS !== "web") {
    focusManager.setFocused(status === "active");
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      gcTime: 1000 * 60 * 60 * 24 // 24 hours
    }
  }
});

const asyncStoragePersister = createAsyncStoragePersister({
  storage: Storage
});
export default function QueryProvider({
  children
}: {
  children: React.ReactNode;
}) {
  useOnlineManager();

  useAppState(onAppStateChange);

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister: asyncStoragePersister }}
    >
      {children}
      {/* <DevToolsBubble /> */}
    </PersistQueryClientProvider>
  );
}
