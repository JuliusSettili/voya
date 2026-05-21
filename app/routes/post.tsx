import type { Route } from "./+types/post";
import { fetchPost } from "../../api/posts";
import React, { useEffect, useState } from "react";
import ReactCountryFlag from "react-country-flag";
import { Link } from "react-router";
import { SubPost } from "~/components/SubPost";
import { deleteSubPost } from "../../api/subposts";
import { postBelongsToCurrentUser } from "../../api/posts";

export async function clientLoader({
  params,
}: Route.ClientLoaderArgs) {
  return await fetchPost(params.id);
}

export default function PostPage({
  loaderData: post,
}: Route.ComponentProps) {
  const [postState, setPostState] = useState(post);
  const [canDeleteSubPosts, setCanDeleteSubPosts] = useState(false);

  useEffect(() => {
    setPostState(post);
  }, [post]);

  useEffect(() => {
    let isMounted = true;

    async function loadOwnership() {
      const belongsToUser = await postBelongsToCurrentUser(postState);
      if (isMounted) {
        setCanDeleteSubPosts(belongsToUser);
      }
    }

    loadOwnership();

    return () => {
      isMounted = false;
    };
  }, [postState]);

  const handleDelete = async (id: number) => {
    try {
      await deleteSubPost(id);
      setPostState((p) => ({
        ...p,
        sub_posts: p.sub_posts ? p.sub_posts.filter((s) => s.id !== id) : p.sub_posts,
      }));
    } catch (err) {
      console.error("Failed to delete sub post", err);
      alert("Löschen fehlgeschlagen: " + (err instanceof Error ? err.message : String(err)));
    }
  };

  return (
    <main className="p-6 grid grid-cols-4 gap-6 [grid-template-areas:'image_title_title_flags''description_description_description_description''content_content_content_content'] lg:[grid-template-areas:'title_flags_flags_image''description_description_description_image''content_content_content_image']">
      <img className="[grid-area:image]" src={postState.title_image_url} alt={postState.title} />
      <div className="[grid-area:title]">
        <h1 className="mb-1 text-2xl font-semibold ">{postState.title}</h1>
        <Link to={`/user/${postState.profiles.id}`} className="text-sm text-gray-600">@{postState.profiles.display_name}</Link>
      </div>
      <div className="mr-3 [grid-area:flags] justify-self-end">
        {postState.countries.map((country) => (
          <ReactCountryFlag key={country.id} countryCode={country.code} svg />
        ))}
      </div>
      <p className="[grid-area:description]">{postState.description}</p>
      <div className="[grid-area:content]">
        {postState.sub_posts?.map((subPost) => (
          <SubPost
            key={subPost.id}
            subPost={subPost}
            containerClass="mb-6"
            onDelete={canDeleteSubPosts ? handleDelete : undefined}
          />
        ))}
      </div>
    </main>
  );
}
