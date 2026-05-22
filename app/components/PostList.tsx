import PostCard from "~/components/PostCard";
import type { Post } from "../../api/supabaseClient";

export default function PostList({ posts }: { posts: Post[] }) {
  if (posts.length === 0) {
    return <p>Keine Posts gefunden.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          title={post.title}
          description={post.description}
          imageUrl={post.title_image_url}
          link={`/post/${post.id}`}
          profile={post.profiles}
          countries={post.countries}
          postId={post.id}
        />
      ))}
    </div>
  );
}
