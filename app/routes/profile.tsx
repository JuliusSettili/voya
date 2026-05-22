import { fetchProfile } from "../../api/auth";
import type { Profile } from "../../api/supabaseClient";

export async function clientLoader({ params }: { params: { id: string } }) {
  return await fetchProfile(params.id);
}

export default function ProfilePage({ loaderData: profile }: { loaderData: Profile }) {

  return (
    <main>Profile {profile.display_name}</main>
  );
}
