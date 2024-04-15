import { MMKV } from "react-native-mmkv";

const storage = new MMKV();

export default {
  setItem: (key: string, data: string) => storage.set(key, data),
  getItem: (key: string) => storage.getString(key) ?? "",
  removeItem: (key: string) => storage.delete(key)
};
