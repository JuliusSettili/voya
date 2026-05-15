import Card from "~/components/Card";
import { fetchPosts } from "../../api/posts";
import { useEffect, useState } from "react";
import type { Post } from "../../api/supabaseClient";

export default function Explore() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        async function loadPosts() {
            try {
                const res = await fetchPosts();
                setPosts(res);
                console.log(res);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        loadPosts();
    }, []);

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
                {loading ? (
                    <p>Lade...</p>
                ) : posts.length === 0 ? (
                    <p>Keine Posts gefunden.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {posts.map((post) => (
                            <Card
                                key={post.id}
                                title={post.title}
                                description={post.description}
                                imageUrl={post.title_image_url}
                                tags={post.countries.map((country) => country.name)}
                            />
                        ))}
                    </div>
                )}
        </main>
    );
}
