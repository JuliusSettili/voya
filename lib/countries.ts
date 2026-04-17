import { Country, getSupabaseClient } from "./supabaseClient";

export async function fetchCountries(): Promise<Country[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("countries")
    .select("id, name")
    .order("id", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}
