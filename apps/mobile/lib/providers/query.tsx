import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import {
  focusManager,
  onlineManager,
  QueryClient
} from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { AppStateStatus, Platform } from "react-native";
import { useAppState } from "../hooks/use-app-state";
import { useOnlineManager } from "../hooks/use-online-manager";

function onAppStateChange(status: AppStateStatus) {
  if (Platform.OS !== "web") {
    focusManager.setFocused(status === "active");
  }
}

onlineManager.setEventListener(setOnline => {
  return NetInfo.addEventListener(state => {
    setOnline(!!state.isConnected);
  });
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 4,
      networkMode: "offlineFirst",
      gcTime: 1000 * 60 * 60 * 24
    }
  }
});

const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage
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
    </PersistQueryClientProvider>
  );
}
