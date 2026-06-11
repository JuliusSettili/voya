import { describe, it, expect, vi, beforeEach, beforeAll } from "vitest";
import {
    uploadPostImage,
    fetchPosts,
    fetchPostsByProfileId,
    fetchPost,
    deletePost,
    postBelongsToCurrentUser,
    createPost,
    blockPost,
    unblockPost,
    updatePostPrivacy,
    updatePostData,
    updatePostCountries
} from "./posts";
import { getSupabaseClient } from "./supabaseClient";
import { getUser } from "./auth";
import type { Post } from "./supabaseClient";

vi.mock("./supabaseClient", () => ({
    getSupabaseClient: vi.fn(),
}));

vi.mock("./auth", () => ({
    getUser: vi.fn(),
}));

const MOCK_ERROR_MSG = "Database error";
const MOCK_UUID = "1234-abcd";
const MOCK_PROFILE_ID = "user-123";
const MOCK_POST_ID = "post-99";

const MOCK_FILE = new File(["dummy content"], "test-image.png", { type: "image/png" });
const MOCK_PUBLIC_URL = "https://example.com/test-image.png";

const MOCK_POST = { id: MOCK_POST_ID, title: "Test Post", profiles: { id: MOCK_PROFILE_ID } } as unknown as Post;

describe("Posts API Module", () => {
    let mockFrom: ReturnType<typeof vi.fn>;

    beforeAll(() => {
        vi.stubGlobal("crypto", { randomUUID: () => MOCK_UUID });
    });

    beforeEach(() => {
        vi.clearAllMocks();
        mockFrom = vi.fn();
        (getSupabaseClient as any).mockReturnValue({
            from: mockFrom,
            storage: { from: mockFrom },
        });
    });

    describe("uploadPostImage()", () => {
        it("uploads a file and returns the public URL", async () => {
            const mockUpload = vi.fn().mockResolvedValue({ error: null });
            const mockGetPublicUrl = vi.fn().mockReturnValue({ data: { publicUrl: MOCK_PUBLIC_URL } });
            mockFrom.mockReturnValue({ upload: mockUpload, getPublicUrl: mockGetPublicUrl });

            const url = await uploadPostImage(MOCK_FILE);

            expect(mockFrom).toHaveBeenCalledWith("Post_Images");
            expect(mockUpload).toHaveBeenCalledWith(`posts/${MOCK_UUID}.png`, MOCK_FILE, expect.any(Object));
            expect(url).toBe(MOCK_PUBLIC_URL);
        });

        it("throws an error if the upload fails", async () => {
            const mockUpload = vi.fn().mockResolvedValue({ error: { message: MOCK_ERROR_MSG } });
            mockFrom.mockReturnValue({ upload: mockUpload });

            await expect(uploadPostImage(MOCK_FILE)).rejects.toThrow(MOCK_ERROR_MSG);
        });
    });

    describe("fetchPosts() & fetchPostsByProfileId()", () => {
        it("fetches all posts successfully", async () => {
            const mockOrder = vi.fn().mockResolvedValue({ data: [MOCK_POST], error: null });
            const mockSelect = vi.fn().mockReturnValue({ order: mockOrder });
            mockFrom.mockReturnValue({ select: mockSelect });

            const result = await fetchPosts();

            expect(mockFrom).toHaveBeenCalledWith("posts");
            expect(result).toEqual([MOCK_POST]);
        });

        it("fetches posts for a specific profile ID", async () => {
            const mockOrder = vi.fn().mockResolvedValue({ data: [MOCK_POST], error: null });
            const mockEq = vi.fn().mockReturnValue({ order: mockOrder });
            const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
            mockFrom.mockReturnValue({ select: mockSelect });

            const result = await fetchPostsByProfileId(MOCK_PROFILE_ID);

            expect(mockEq).toHaveBeenCalledWith("user_id", MOCK_PROFILE_ID);
            expect(result).toEqual([MOCK_POST]);
        });
    });

    describe("fetchPost()", () => {
        it("fetches a single post by ID", async () => {
            const mockSingle = vi.fn().mockResolvedValue({ data: MOCK_POST, error: null });
            const mockEq = vi.fn().mockReturnValue({ single: mockSingle });
            const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
            mockFrom.mockReturnValue({ select: mockSelect });

            const result = await fetchPost(MOCK_POST_ID);

            expect(mockEq).toHaveBeenCalledWith("id", MOCK_POST_ID);
            expect(result).toEqual(MOCK_POST);
        });
    });

    describe("deletePost()", () => {
        it("deletes a post by ID", async () => {
            const mockEq = vi.fn().mockResolvedValue({ error: null });
            const mockDelete = vi.fn().mockReturnValue({ eq: mockEq });
            mockFrom.mockReturnValue({ delete: mockDelete });

            await deletePost(MOCK_POST_ID);

            expect(mockEq).toHaveBeenCalledWith("id", MOCK_POST_ID);
        });
    });

    describe("postBelongsToCurrentUser()", () => {
        it("returns true if the post belongs to the authenticated user", async () => {
            (getUser as any).mockResolvedValue({ id: MOCK_PROFILE_ID });

            const result = await postBelongsToCurrentUser(MOCK_POST);

            expect(result).toBe(true);
        });

        it("returns false if there is no authenticated user or ID mismatch", async () => {
            (getUser as any).mockResolvedValue(null);

            const resultNullUser = await postBelongsToCurrentUser(MOCK_POST);
            expect(resultNullUser).toBe(false);

            (getUser as any).mockResolvedValue({ id: "different-id" });
            const resultWrongUser = await postBelongsToCurrentUser(MOCK_POST);
            expect(resultWrongUser).toBe(false);
        });
    });

    describe("createPost()", () => {
        const postData = {
            title: "New", description: "Desc", titleImageUrl: "url", countryIds: [1, 2], isPrivate: false
        };

        it("creates a post and its country relations", async () => {
            (getUser as any).mockResolvedValue({ id: MOCK_PROFILE_ID });

            const mockSingle = vi.fn().mockResolvedValue({ data: MOCK_POST, error: null });
            const mockSelect = vi.fn().mockReturnValue({ single: mockSingle });
            const mockInsert = vi.fn().mockReturnValue({ select: mockSelect });

            const mockRelationInsert = vi.fn().mockResolvedValue({ error: null });

            mockFrom.mockImplementation((table: string) => {
                if (table === "posts") return { insert: mockInsert };
                if (table === "post_country_relation") return { insert: mockRelationInsert };
            });

            const result = await createPost(postData);

            expect(mockInsert).toHaveBeenCalled();
            expect(mockRelationInsert).toHaveBeenCalled();
            expect(result).toEqual(MOCK_POST);
        });

        it("rolls back the post creation if country relation insertion fails", async () => {
            (getUser as any).mockResolvedValue({ id: MOCK_PROFILE_ID });

            const mockSingle = vi.fn().mockResolvedValue({ data: MOCK_POST, error: null });
            const mockInsert = vi.fn().mockReturnValue({ select: vi.fn().mockReturnValue({ single: mockSingle }) });

            const mockRelationInsert = vi.fn().mockResolvedValue({ error: { message: MOCK_ERROR_MSG } });

            const mockDeleteEq = vi.fn().mockResolvedValue({ error: null });
            const mockDelete = vi.fn().mockReturnValue({ eq: mockDeleteEq });

            mockFrom.mockImplementation((table: string) => {
                if (table === "posts") return { insert: mockInsert, delete: mockDelete };
                if (table === "post_country_relation") return { insert: mockRelationInsert };
            });

            await expect(createPost(postData)).rejects.toThrow(MOCK_ERROR_MSG);

            // Verifiziert, dass bei Fehler in der Relation der neu erstellte Post wieder gelöscht wird
            expect(mockDeleteEq).toHaveBeenCalledWith("id", MOCK_POST_ID);
        });

        it("throws if user is not authenticated", async () => {
            (getUser as any).mockResolvedValue(null);
            await expect(createPost(postData)).rejects.toThrow("User not authenticated");
        });
    });

    describe("Update Functions (block, unblock, update privacy, update data)", () => {
        it("calls the update method with correct parameters", async () => {
            const mockEq = vi.fn().mockResolvedValue({ error: null });
            const mockUpdate = vi.fn().mockReturnValue({ eq: mockEq });
            mockFrom.mockReturnValue({ update: mockUpdate });

            await blockPost(MOCK_POST_ID, "Spam");
            expect(mockUpdate).toHaveBeenCalledWith({ is_blocked: true, reason_is_blocked: "Spam" });

            await unblockPost(MOCK_POST_ID);
            expect(mockUpdate).toHaveBeenCalledWith({ is_blocked: false, reason_is_blocked: null });

            await updatePostPrivacy(MOCK_POST_ID, true);
            expect(mockUpdate).toHaveBeenCalledWith({ is_private: true });

            await updatePostData(MOCK_POST_ID, { title: "Updated" });
            expect(mockUpdate).toHaveBeenCalledWith({ title: "Updated" });

            expect(mockEq).toHaveBeenCalledTimes(4);
            expect(mockFrom).toHaveBeenCalledWith("posts");
        });
    });

    describe("updatePostCountries()", () => {
        it("deletes old relations and inserts new ones if countryIds exist", async () => {
            const mockDeleteEq = vi.fn().mockResolvedValue({ error: null });
            const mockDelete = vi.fn().mockReturnValue({ eq: mockDeleteEq });
            const mockInsert = vi.fn().mockResolvedValue({ error: null });

            mockFrom.mockReturnValue({ delete: mockDelete, insert: mockInsert });

            await updatePostCountries(MOCK_POST_ID, [1]);

            expect(mockDeleteEq).toHaveBeenCalledWith("post_id", MOCK_POST_ID);
            expect(mockInsert).toHaveBeenCalledWith([{ post_id: MOCK_POST_ID, country_id: 1 }]);
        });

        it("only deletes old relations if the new countryIds array is empty", async () => {
            const mockDeleteEq = vi.fn().mockResolvedValue({ error: null });
            const mockDelete = vi.fn().mockReturnValue({ eq: mockDeleteEq });
            const mockInsert = vi.fn();

            mockFrom.mockReturnValue({ delete: mockDelete, insert: mockInsert });

            await updatePostCountries(MOCK_POST_ID, []);

            expect(mockDeleteEq).toHaveBeenCalled();
            expect(mockInsert).not.toHaveBeenCalled();
        });
    });
});