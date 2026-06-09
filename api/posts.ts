import { getSupabaseClient } from "./supabaseClient";
import type { Post } from "./supabaseClient";
import { getUser } from "./auth";

const POST_IMAGES_BUCKET = "Post_Images";

export async function uploadPostImage(file: File): Promise<string> {
  const supabase = getSupabaseClient();
  const fileExtension = file.name.split(".").pop() || "jpg";
  const filePath = `posts/${crypto.randomUUID()}.${fileExtension}`;

  const { error } = await supabase.storage
    .from(POST_IMAGES_BUCKET)
    .upload(filePath, file, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  const { data } = supabase.storage
    .from(POST_IMAGES_BUCKET)
    .getPublicUrl(filePath);

  return data.publicUrl;
}

export async function fetchPosts(): Promise<Post[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("posts")
    .select("id, title, description, title_image_url, is_blocked, is_private, countries (id, name, code), profiles (id, display_name)")
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function fetchPostsByProfileId(profileId: string): Promise<Post[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("posts")
    .select("id, title, description, title_image_url, is_blocked, is_private, countries (id, name, code), profiles (id, display_name)")
    .eq("user_id", profileId)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function fetchPost(id: string): Promise<Post> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("posts")
    .select("id, title, description, title_image_url, is_blocked, is_private, countries (id, name, code), profiles (id, display_name), sub_posts (id, title, content, sub_post_images (id, image_url))")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Post;
}

export async function deletePost(id: string): Promise<void> {
  const supabase = getSupabaseClient();

  let { error } = await supabase.from("posts").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}

export async function postBelongsToCurrentUser(post: Post): Promise<boolean> {
  const user = await getUser();

  if (!user?.id) {
    return false;
  }

  return post.profiles.id === user.id;
}

export async function createPost(postData: {
  title: string;
  description: string;
  titleImageUrl: string;
  countryIds: number[];
  isPrivate: boolean;
}): Promise<Post> {
  const supabase = getSupabaseClient();
  const user = await getUser();
  const { title, description, titleImageUrl, countryIds, isPrivate } = postData;

  if (!user?.id) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("posts")
    .insert([
      {
        title,
        description,
        title_image_url: titleImageUrl,
        is_private: isPrivate,
      },
    ] as any)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  const createdPost = data as Post;

  if (countryIds.length > 0) {
    const { error: relationError } = await supabase
      .from("post_country_relation")
      .insert(
        countryIds.map((countryId) => ({
          post_id: createdPost.id,
          country_id: countryId,
        })) as any,
      );

    if (relationError) {
      await supabase.from("posts").delete().eq("id", createdPost.id);
      throw new Error(relationError.message);
    }
  }

  return createdPost;
}

export async function blockPost(id: string, reason: string): Promise<void> {
  const supabase = getSupabaseClient();

  const { error } = await supabase
      .from("posts")
      .update({
        is_blocked: true,
        reason_is_blocked: reason,
      } as never)
      .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}

export async function unblockPost(id: string): Promise<void> {
  const supabase = getSupabaseClient();

  const { error } = await supabase
      .from("posts")
      .update({
        is_blocked: false,
        reason_is_blocked: null,
      } as never)
      .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}

export async function updatePostPrivacy(id: string, isPrivate: boolean): Promise<void> {
  const supabase = getSupabaseClient();

  const { error } = await supabase
      .from("posts")
      .update({
        is_private: isPrivate,
      } as never)
      .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}
