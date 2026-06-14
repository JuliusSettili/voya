import type { Route } from "./+types/post";
import {fetchPost, updatePostCountries} from "../../api/posts";
import { useEffect, useState } from "react";
import ReactCountryFlag from "react-country-flag";
import { SubPost } from "~/components/SubPost";
import { deleteSubPost, addEmptySubPost } from "../../api/subposts";
import { postBelongsToCurrentUser } from "../../api/posts";
import EditField from "~/components/EditField";
import { updatePostData } from "../../api/posts";
import CountriesInput from "~/components/CountriesInput";
import {useBlocker} from "react-router";
import UnsavedChangesModal from "~/modals/UnsavedChangesModal";

export async function clientLoader({
  params,
}: Route.ClientLoaderArgs) {
  return await fetchPost(params.id);
}

export default function PostPage({
  loaderData: post,
}: Route.ComponentProps) {
  const [postState, setPostState] = useState(post);
  const [belongsToUser, setBelongsToUser] = useState(false);
  const [editingCount, setEditingCount] = useState(0);
  const isEditing = editingCount > 0;

  const blocker = useBlocker(
      ({ currentLocation, nextLocation }) =>
          isEditing && currentLocation.pathname !== nextLocation.pathname
  );

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isEditing) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isEditing]);

  useEffect(() => {
    setPostState(post);
  }, [post]);

  useEffect(() => {
    let isMounted = true;

    async function loadOwnership() {
      const belongsToUser = await postBelongsToCurrentUser(postState);
      if (isMounted) {
        setBelongsToUser(belongsToUser);
      }
    }

    loadOwnership();

    return () => {
      isMounted = false;
    };
  }, [postState]);

  const createEmptySubPost = async () => {
    const newSubPost = await addEmptySubPost(postState.id);

    if (!newSubPost) {
      console.error("Fehler: API hat kein gültiges SubPost zurückgegeben");
      return;
    }

    setPostState((p) => ({
      ...p,
      sub_posts: p.sub_posts ? [...p.sub_posts, newSubPost] : [newSubPost],
    }));
  };

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

  const handleEditTitle = async (newTitle: string) => {
    await updatePostData(postState.id, { title: newTitle });
    setPostState((p) => ({ ...p, title: newTitle }));
  };

  const handleEditDescription = async (newDescription: string) => {
    await updatePostData(postState.id, { description: newDescription });
    setPostState((p) => ({ ...p, description: newDescription }));
  };

  const handleEditCountries = async (countryIds: number[]) => {
    try {
      await updatePostCountries(postState.id, countryIds);

      const updatedPost = await fetchPost(postState.id);
      setPostState(updatedPost);
    } catch (error) {
      console.error("Fehler beim Speichern der Länder:", error);
      alert("Fehler beim Speichern! Hast du die INSERT und DELETE Policies für 'post_country_relation' angelegt?");
    }
  };

  const handleEditStateChange = (editing: boolean) => {
    setEditingCount((prev) => (editing ? prev + 1 : Math.max(0, prev - 1)));
  };

  return (
      <>
        <UnsavedChangesModal
            isOpen={blocker.state === "blocked"}
            onProceed={() => blocker.proceed?.()}
            onCancel={() => blocker.reset?.()}
        />
        <main className="p-6 grid grid-cols-1 lg:grid-cols-4 gap-6 [grid-template-areas:'image'_'title'_'flags'_'description'_'content']
        lg:[grid-template-areas:'title_title_flags_image''description_description_description_image''content_content_content_image']">
          <img className="[grid-area:image]" src={postState.title_image_url} alt={postState.title} />
          <div className="[grid-area:title]">
            {belongsToUser ? (
                <div className="mb-1 text-2xl font-semibold">
                  <EditField
                      placeholderValue="Titel Post"
                      value={postState.title}
                      onChange={handleEditTitle}
                      onEditStateChange={handleEditStateChange}
                  />
                </div>
            ) : (
                <h1 className="mb-1 text-2xl font-semibold">{postState.title}</h1>
            )}
            <div className="text-sm text-gray-600">@{postState.profiles.display_name}</div>
          </div>
          <div className="mr-3 [grid-area:flags] justify-self-start lg:justify-self-end flex items-center gap-2 relative z-50">            {belongsToUser ? (
                <div className="min-w-[200px]">
                  <CountriesInput
                      value={postState.countries.map(country => country.id)}
                      onChange={handleEditCountries}
                  />
                </div>
            ) : (
                postState.countries.map((country) => (
                    <ReactCountryFlag key={country.id} countryCode={country.code} svg />
                ))
            )}
          </div>
          <div className="[grid-area:description]">
            {belongsToUser ? (
                <EditField
                    placeholderValue="Beschreibung Post"
                    value={postState.description}
                    onChange={handleEditDescription}
                    onEditStateChange={handleEditStateChange}
                    isTextarea
                />
            ) : (
                <p>{postState.description}</p>
            )}
          </div>
          <div className="[grid-area:content]">
            {postState.sub_posts?.map((subPost) => (
                <SubPost
                    key={subPost.id}
                    subPost={subPost}
                    containerClass="mb-6"
                    onDelete={belongsToUser ? handleDelete : undefined}
                    postBelongsToCurrentUser={belongsToUser}
                    onEditStateChange={handleEditStateChange}
                />
            ))}
          </div>
          {belongsToUser && (
              <button className="btn btn-primary" type="button" onClick={createEmptySubPost}>
                Subpost hinzufügen
              </button>
          )}
        </main>
      </>

  );
}
