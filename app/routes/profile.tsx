import { fetchProfile } from "../../api/profile";
import type { Route } from "./+types/profile";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  return await fetchProfile(params.id);
}

export default function ProfilePage({ loaderData: profile }: Route.ComponentProps) {

  return (
    <main>Profile {profile.display_name}</main>
  );
}
