import { describe, it, expect, vi, beforeEach } from "vitest";
import {
    deleteSubPost,
    updateSubPost,
    addSubPostImage,
    getSubPostById,
    deleteSubPostImage,
    addEmptySubPost
} from "./subposts";
import { getSupabaseClient } from "./supabaseClient";
import type { SubPost } from "./supabaseClient";

vi.mock("./supabaseClient", () => ({
    getSupabaseClient: vi.fn(),
}));

const MOCK_SUBPOST_ID = 42;
const MOCK_POST_ID = 10;
const MOCK_IMAGE_ID = 99;
const MOCK_IMAGE_URL = "https://example.com/image.jpg";
const MOCK_ERROR_MSG = "Database operation failed";

const MOCK_SUBPOST_DATA = {
    id: MOCK_SUBPOST_ID,
    title: "Test",
    content: "Content",
    sub_post_images: []
} as unknown as SubPost;

describe("Subposts API Module", () => {
    let mockFrom: ReturnType<typeof vi.fn>;
    let mockDelete: ReturnType<typeof vi.fn>;
    let mockUpdate: ReturnType<typeof vi.fn>;
    let mockInsert: ReturnType<typeof vi.fn>;
    let mockSelect: ReturnType<typeof vi.fn>;
    let mockEq: ReturnType<typeof vi.fn>;
    let mockSingle: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        vi.clearAllMocks();

        mockSingle = vi.fn();
        mockEq = vi.fn();
        mockSelect = vi.fn().mockReturnValue({
            eq: mockEq,
            single: mockSingle,
        });
        mockInsert = vi.fn();
        mockUpdate = vi.fn().mockReturnValue({ eq: mockEq });
        mockDelete = vi.fn().mockReturnValue({ eq: mockEq });

        mockFrom = vi.fn().mockReturnValue({
            delete: mockDelete,
            update: mockUpdate,
            insert: mockInsert,
            select: mockSelect,
        });

        (getSupabaseClient as any).mockReturnValue({ from: mockFrom });
    });

    describe("deleteSubPost()", () => {
        it("deletes a subpost successfully", async () => {
            mockEq.mockResolvedValueOnce({ error: null });

            await deleteSubPost(MOCK_SUBPOST_ID);

            expect(mockFrom).toHaveBeenCalledWith("sub_posts");
            expect(mockDelete).toHaveBeenCalled();
            expect(mockEq).toHaveBeenCalledWith("id", MOCK_SUBPOST_ID);
        });

        it("throws an error if deletion fails", async () => {
            mockEq.mockResolvedValueOnce({ error: { message: MOCK_ERROR_MSG } });

            await expect(deleteSubPost(MOCK_SUBPOST_ID)).rejects.toThrow(MOCK_ERROR_MSG);
        });
    });

    describe("updateSubPost()", () => {
        const updateData = { title: "New Title" };

        it("updates a subpost successfully", async () => {
            mockEq.mockResolvedValueOnce({ error: null });

            await updateSubPost(MOCK_SUBPOST_ID, updateData);

            expect(mockFrom).toHaveBeenCalledWith("sub_posts");
            expect(mockUpdate).toHaveBeenCalledWith(updateData);
            expect(mockEq).toHaveBeenCalledWith("id", MOCK_SUBPOST_ID);
        });

        it("throws an error if update fails", async () => {
            mockEq.mockResolvedValueOnce({ error: { message: MOCK_ERROR_MSG } });

            await expect(updateSubPost(MOCK_SUBPOST_ID, updateData)).rejects.toThrow(MOCK_ERROR_MSG);
        });
    });

    describe("addSubPostImage()", () => {
        it("inserts a new subpost image successfully", async () => {
            mockInsert.mockResolvedValueOnce({ error: null });

            await addSubPostImage(MOCK_SUBPOST_ID, MOCK_IMAGE_URL);

            expect(mockFrom).toHaveBeenCalledWith("sub_post_images");
            expect(mockInsert).toHaveBeenCalledWith({
                image_url: MOCK_IMAGE_URL,
                subpost_id: MOCK_SUBPOST_ID,
            });
        });

        it("throws an error if inserting the image fails", async () => {
            mockInsert.mockResolvedValueOnce({ error: { message: MOCK_ERROR_MSG } });

            await expect(addSubPostImage(MOCK_SUBPOST_ID, MOCK_IMAGE_URL)).rejects.toThrow(MOCK_ERROR_MSG);
        });
    });

    describe("getSubPostById()", () => {
        it("fetches and returns a subpost successfully", async () => {
            mockEq.mockReturnValueOnce({ single: mockSingle });
            mockSingle.mockResolvedValueOnce({ data: MOCK_SUBPOST_DATA, error: null });

            const result = await getSubPostById(MOCK_SUBPOST_ID);

            expect(mockFrom).toHaveBeenCalledWith("sub_posts");
            expect(mockSelect).toHaveBeenCalledWith("id, title, content, sub_post_images (id, image_url)");
            expect(mockEq).toHaveBeenCalledWith("id", MOCK_SUBPOST_ID);
            expect(result).toEqual(MOCK_SUBPOST_DATA);
        });

        it("throws an error if fetching the subpost fails", async () => {
            mockEq.mockReturnValueOnce({ single: mockSingle });
            mockSingle.mockResolvedValueOnce({ data: null, error: { message: MOCK_ERROR_MSG } });

            await expect(getSubPostById(MOCK_SUBPOST_ID)).rejects.toThrow(MOCK_ERROR_MSG);
        });
    });

    describe("deleteSubPostImage()", () => {
        it("deletes a subpost image successfully", async () => {
            mockEq.mockResolvedValueOnce({ error: null });

            await deleteSubPostImage(MOCK_IMAGE_ID);

            expect(mockFrom).toHaveBeenCalledWith("sub_post_images");
            expect(mockDelete).toHaveBeenCalled();
            expect(mockEq).toHaveBeenCalledWith("id", MOCK_IMAGE_ID);
        });

        it("throws an error if deleting the image fails", async () => {
            mockEq.mockResolvedValueOnce({ error: { message: MOCK_ERROR_MSG } });

            await expect(deleteSubPostImage(MOCK_IMAGE_ID)).rejects.toThrow(MOCK_ERROR_MSG);
        });
    });

    describe("addEmptySubPost()", () => {
        it("creates and returns a new empty subpost", async () => {
            // Verkettung: insert -> select -> single
            mockInsert.mockReturnValueOnce({ select: mockSelect });
            mockSelect.mockReturnValueOnce({ single: mockSingle });
            mockSingle.mockResolvedValueOnce({ data: MOCK_SUBPOST_DATA, error: null });

            const result = await addEmptySubPost(MOCK_POST_ID);

            expect(mockFrom).toHaveBeenCalledWith("sub_posts");
            expect(mockInsert).toHaveBeenCalledWith({
                title: "",
                content: "",
                post_id: MOCK_POST_ID,
            });
            expect(mockSelect).toHaveBeenCalledWith("id, title, content, sub_post_images (id, image_url)");
            expect(result).toEqual(MOCK_SUBPOST_DATA);
        });

        it("throws an error if creating the empty subpost fails", async () => {
            mockInsert.mockReturnValueOnce({ select: mockSelect });
            mockSelect.mockReturnValueOnce({ single: mockSingle });
            mockSingle.mockResolvedValueOnce({ data: null, error: { message: MOCK_ERROR_MSG } });

            await expect(addEmptySubPost(MOCK_POST_ID)).rejects.toThrow(MOCK_ERROR_MSG);
        });
    });
});