import type { Route } from "./+types/post";
import { fetchPost } from "../../api/posts";

export async function clientLoader({
  params,
}: Route.ClientLoaderArgs) {
  return await fetchPost(params.id);
}

export default function CountriesPage({
  loaderData: post,
}: Route.ComponentProps) {

  return (
    <main className="p-6">
      <h1 className="mb-4 text-2xl font-semibold">{post.title}</h1>
      <p>{post.description}</p>
    </main>
  );
}
