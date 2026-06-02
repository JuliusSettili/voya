import { fetchPosts, deletePost } from "../../api/posts";
import type { Route } from "./+types/explore";
import PostList from "~/components/PostList";
import SearchBar from "~/components/SearchBar";
import FilterComponent from "~/components/FilterComponent";
import {useSearchParams} from "react-router";

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

export default function Explore({ loaderData: posts }: Route.ComponentProps) {

    const [searchParams] = useSearchParams();

    const searchQuery = searchParams.get("searchQuery") ?? "";
    const countryIds = searchParams.getAll("countryIds");

    const filteredPosts = posts.filter((post) => {
        // Titel-Suche
        const matchesTitle = post.title.toLowerCase().includes(searchQuery.toLowerCase());

        // Länder-Filter (Prüft, ob der Post ALLE ausgewählten IDs besitzt)
        const matchesCountries =
            countryIds.length === 0 ||
            countryIds.every((selectedId) =>
                post.countries?.some((country) => String(country.id) === selectedId)
            );

        return matchesTitle && matchesCountries;
    });

    return (
        <main className="p-8">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">Entdecken</h1>
                <h2>Hier kannst du neue Reiseziele entdecken, die von anderen Nutzern geteilt wurden.</h2>
            </div>

            <form
                method="get"
                className="mb-8 w-full flex flex-col md:flex-row gap-4 items-start md:items-stretch"
            >
                <div className="w-full md:w-5/10 flex flex-col justify-start">
                    <SearchBar placeholder="Beitrag Titel suchen..." defaultValue={searchQuery} />
                </div>

                <div className="w-full md:w-4/10 flex flex-col justify-start">
                    <FilterComponent />
                </div>

                <div className="w-full md:w-1/10">
                    <button
                        type="submit"
                        className="btn btn-primary w-full"
                    >
                        Suchen
                    </button>
                </div>
            </form>

            <PostList posts={filteredPosts} />
        </main>
    );
}