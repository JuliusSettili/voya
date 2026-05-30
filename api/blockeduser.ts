import { getSupabaseClient } from "./supabaseClient";

export async function insertBlockedUser(profileId: string, reason: string): Promise<void> {
    const supabase = getSupabaseClient();
    const { error: blockReasonError } = await supabase
        .from("blocked_users")
        .insert({ user_id: profileId, block_text: reason });

    if (blockReasonError) {
        throw new Error(blockReasonError.message);
    }
}

export async function deleteBlockedUser(profileId: string): Promise<void> {
    const supabase = getSupabaseClient();
    const { error: blockReasonError } = await supabase
        .from("blocked_users")
        .delete()
        .eq("user_id", profileId);

    if (blockReasonError) {
        throw new Error(blockReasonError.message);
    }
}
