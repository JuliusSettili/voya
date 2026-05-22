import { fetchProfile } from "../../api/profile";
import { deletePost, fetchPostsByProfileId } from "../../api/posts";
import type { Route } from "./+types/profile";
import PostList from "~/components/PostList";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const [profile, posts] = await Promise.all([
    fetchProfile(params.id),
    fetchPostsByProfileId(params.id),
  ]);

  return { profile, posts };
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
  const { profile, posts } = loaderData as Awaited<ReturnType<typeof clientLoader>>;

  return (
    <main className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Profil</h1>
        <h2 className="text-lg">@{profile.display_name}</h2>
      </div>
      <PostList posts={posts} />
    </main>
  );
}
