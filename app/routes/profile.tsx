import { fetchFullProfile, updateProfileDisplayName } from "../../api/profile";
import { deletePost, fetchPostsByProfileId } from "../../api/posts";
import { fetchCountriesForProfile } from "../../api/countries";
import type { Route } from "./+types/profile";
import PostList from "~/components/PostList";
import AsyncEditField from "~/components/AsyncEditField";
import { ReactCountryFlag } from "react-country-flag";
import { Link } from "react-router";
import { MdAdd } from "react-icons/md";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const [profile, posts, countries] = await Promise.all([
    fetchFullProfile(params.id),
    fetchPostsByProfileId(params.id),
    fetchCountriesForProfile(params.id),
  ]);

  return { profile, posts, countries };
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  const intent = String(formData.get("intent") ?? "");

  if (intent === "delete-post") {
    const postId = String(formData.get("postId") ?? "");
    if (postId) {
      await deletePost(postId);
    }
  }

  return null;
}

export default function ProfilePage({ loaderData }: Route.ComponentProps) {
  const { profile, posts, countries } = loaderData;

  return (
    <main className="p-8">
      <div className="grid grid-cols-1 mb-8 border pb-4 px-4">
        <div>
          <div className="font-bold text-lg">Profil:</div>
          <AsyncEditField value={profile.display_name} onChange={async (value) => {await updateProfileDisplayName(profile.id, value)}} />
        </div>
        <div>
          <div className="font-bold text-lg">Email:</div>
          <div className="flex items-center gap-2">{profile.email}</div>
        </div>
        <div>
          <div className="font-bold text-lg">Länder:</div>
          <div className="flex flex-wrap">
            {countries.map((country) => (
              <ReactCountryFlag key={country.code} countryCode={country.code} svg />
            ))}
          </div>
        </div>
        <div className="mt-4">
          <Link to="/new-post">
            <button type="button" className="w-40 h-12 border flex bg-blue-500 items-center justify-center">
              <MdAdd size={48} />
            </button>
          </Link>
        </div>
      </div>
      <PostList posts={posts} />
    </main>
  );
}
