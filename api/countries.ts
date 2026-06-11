import { getSupabaseClient } from "./supabaseClient";
import type { Country } from "./supabaseClient";

export async function fetchCountries(): Promise<Country[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("countries")
    .select("id, name, code")
    .order("id", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function fetchCountriesForProfile(profileId: string): Promise<Country[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("posts")
    .select("post_country_relation(countries(id, name, code))")
    .eq("user_id", profileId);

  if (error) {
    throw new Error(error.message);
  }

  const countries =
    data?.flatMap((post: any) =>
      post.post_country_relation.map((relation: any) =>
        relation.countries)) ?? [];

  return countries;
}