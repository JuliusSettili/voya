import { fetchPosts, deletePost, blockPost, unblockPost } from "../../api/posts";
import type { Route } from "./+types/explore";
import PostList from "~/components/PostList";
import SearchBar from "~/components/SearchBar";
import FilterComponent from "~/components/FilterComponent";
import {useSearchParams} from "react-router";
import { checkIsAdmin } from "../../api/auth";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Voya" },
    { name: "description", content: "Welcome to Voya!" },
  ];
}

export async function clientLoader() {
    const posts = await fetchPosts();
    const isAdmin = await checkIsAdmin();

    return { posts, isAdmin };
}

export async function clientAction({
  request,
}: Route.ClientActionArgs) {
  let formData = await request.formData();
  let intent = String(formData.get("intent") ?? "");

    console.log("Action gestartet! Intent lautet:", intent);

  if (intent === "delete-post") {
      const postId = String(formData.get("postId") ?? "");
      if (postId) {
          await deletePost(postId);
      }
  }

  if (intent === "block-post") {
      const postId = String(formData.get("postId") ?? "");
      const reason = String(formData.get("reason") ?? "");

      console.log("Sperren-Daten empfangen -> PostID:", postId, "| Reason:", reason);

      if (postId && reason.trim().length > 0) {
          try {
              console.log("Sende Anfrage an Supabase...");
              await blockPost(postId, reason);
              console.log("Erfolgreich in Supabase gespeichert!");
          } catch (error) {
              console.error("FEHLER VON SUPABASE:", error);
          }
      } else {
          console.warn("Abbruch: PostID fehlt");
      }
  }

  if (intent === "unblock-post") {
      const postId = String(formData.get("postId") ?? "");
      if (postId) {
          try {
              await unblockPost(postId);
              console.log("Erfolgreich freigegeben!");
          } catch (error) {
              console.error("FEHLER VON SUPABASE:", error);
          }
      }
  }

  return null;
}

export default function Explore({ loaderData }: Route.ComponentProps) {
    const {posts, isAdmin} = loaderData;

    const [searchParams] = useSearchParams();

    const searchQuery = searchParams.get("searchQuery") ?? "";
    const countryIds = searchParams.getAll("countryIds");

    const filteredPosts = posts.filter((post) => {
        if (post.is_private) {
            return false;
        }

        if (post.is_blocked && !isAdmin) {
            return false;
        }

        // Such-String in einzelne Wörter (Kleinbuchstaben) aufteilen
        const searchTerms = searchQuery.toLowerCase().split(/\s+/).filter(Boolean);

        // Titel-Suche: Prüft, ob JEDES eingegebene Wort im Titel vorkommt
        const matchesTitle = searchTerms.length === 0 || searchTerms.every(term =>
            post.title.toLowerCase().includes(term)
        );

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

            <PostList posts={filteredPosts} isAdmin={isAdmin}/>
        </main>
    );
}