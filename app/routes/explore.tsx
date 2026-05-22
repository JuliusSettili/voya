import { fetchPosts, deletePost } from "../../api/posts";
import type { Route } from "./+types/explore";
import PostList from "~/components/PostList";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Voya" },
    { name: "description", content: "Welcome to Voya!" },
  ];
}

export async function clientLoader() {
  return await fetchPosts();
}

export async function clientAction({
  request,
}: Route.ClientActionArgs) {
  let formData = await request.formData();
    let intent = String(formData.get("intent") ?? "");

    if (intent === "delete-post") {
        const postId = String(formData.get("postId") ?? "");
        if (postId) {
            await deletePost(postId);
        }
    }

    return null;
}

export default function Explore({
    loaderData: posts,
}: Route.ComponentProps) {
    return (
        <main className="p-8">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">
                    Entdecken
                </h1>
                <h2>
                    Hier kannst du neue Reiseziele entdecken, die von anderen Nutzern geteilt wurden.
                </h2>
            </div>
            <PostList posts={posts} />
        </main>
    );
}
