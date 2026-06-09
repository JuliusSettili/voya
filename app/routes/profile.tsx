import { fetchProfileById, updateProfileDisplayName } from "../../api/profile";
import { deletePost, fetchPostsByProfileId, updatePostPrivacy } from "../../api/posts";
import { fetchCountriesForProfile } from "../../api/countries";
import type { Route } from "./+types/profile";
import PostList from "~/components/PostList";
import AsyncEditField from "~/components/AsyncEditField";
import { ReactCountryFlag } from "react-country-flag";
import { Link } from "react-router";
import { MdAdd } from "react-icons/md";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const [profile, posts, countries] = await Promise.all([
    fetchProfileById(params.id),
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

  if (intent === "toggle-privacy") {
    const postId = String(formData.get("postId") ?? "");
    const isPrivate = formData.get("isPrivate") === "true";

    if (postId) {
      await updatePostPrivacy(postId, isPrivate);
    }
  }

  return null;
}

export default function ProfilePage({ loaderData }: Route.ComponentProps) {
  const { profile, posts, countries } = loaderData;

  return (
    <main className="p-8">
      <div className="mb-8 flex justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">
            <AsyncEditField value={profile.display_name} onChange={async (value) => {await updateProfileDisplayName(profile.id, value)}} />
          </h1>
          <div className="mb-2 badge badge-secondary">{profile.email}</div>
          <div className="mb-2">{countries.map((country) => (
              <ReactCountryFlag className="me-2" key={country.code} countryCode={country.code} svg />
            ))}
          </div>
        </div>
        <Link className="btn btn-primary" to="/new-post">
          <MdAdd size={16} />
          Post erstellen
        </Link>
      </div>
      <PostList posts={posts} />
    </main>
  );
}
