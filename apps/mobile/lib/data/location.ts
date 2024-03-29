import { supabase } from "../helpers/supabase";

export const getLocations: Record<string, string[]> = {
  Freetown: [
    "Aberdeen",
    "Brookfields",
    "Central Freetown",
    "Congo Town",
    "Wilberforce",
    "Wellington",
    "Lumley",
    "Juba"
  ],
  Bo: ["Njai Town", "Shelmingo", "Cemetery", "Kowama", "New York"],
  Kenema: ["Daru", "Blama", "Tongo Field", "Hangha Town", "Nyandeyama"],
  Makeni: ["Magburaka", "Masuba", "Yeliboya", "Mabenteh", "Rogbane"],
  Koidu: ["Sandor", "Tankoro", "Konomanyi", "New Sembehun", "Mandu"]
};

export const fetchCities = async () => {
  return await supabase.from("cities").select("*, communities(*)");
};

export const fetchCommunities = async (city: string) => {
  return await supabase
    .from("communities")
    .select("id, name, cities!inner(name)")
    .eq("cities.name", city);
};
