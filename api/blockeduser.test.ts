import { describe, it, expect, vi, beforeEach } from "vitest";
import { insertBlockedUser, deleteBlockedUser } from "./blockeduser";
import { getSupabaseClient } from "./supabaseClient";

vi.mock("./supabaseClient", () => ({
    getSupabaseClient: vi.fn(),
}));

const MOCK_PROFILE_ID = "user-123";
const MOCK_REASON = "Spamming the feed";
const MOCK_ERROR_MESSAGE = "Database connection failed";

describe("BlockedUser API Module", () => {
    let mockInsert: ReturnType<typeof vi.fn>;
    let mockEq: ReturnType<typeof vi.fn>;
    let mockDelete: ReturnType<typeof vi.fn>;
    let mockFrom: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        vi.clearAllMocks();

        mockInsert = vi.fn().mockResolvedValue({ error: null });
        mockEq = vi.fn().mockResolvedValue({ error: null });
        mockDelete = vi.fn().mockReturnValue({ eq: mockEq });

        mockFrom = vi.fn().mockReturnValue({
            insert: mockInsert,
            delete: mockDelete,
        });

        (getSupabaseClient as any).mockReturnValue({ from: mockFrom });
    });

    describe("insertBlockedUser()", () => {
        it("inserts a blocked user successfully", async () => {
            await insertBlockedUser(MOCK_PROFILE_ID, MOCK_REASON);

            expect(mockFrom).toHaveBeenCalledWith("blocked_users");
            expect(mockInsert).toHaveBeenCalledWith({
                user_id: MOCK_PROFILE_ID,
                block_text: MOCK_REASON,
            });
        });

        it("throws an error if the insertion fails", async () => {
            mockInsert.mockResolvedValueOnce({ error: { message: MOCK_ERROR_MESSAGE } });

            await expect(insertBlockedUser(MOCK_PROFILE_ID, MOCK_REASON)).rejects.toThrow(MOCK_ERROR_MESSAGE);
        });
    });

    describe("deleteBlockedUser()", () => {
        it("deletes a blocked user successfully", async () => {
            await deleteBlockedUser(MOCK_PROFILE_ID);

            expect(mockFrom).toHaveBeenCalledWith("blocked_users");
            expect(mockDelete).toHaveBeenCalled();
            expect(mockEq).toHaveBeenCalledWith("user_id", MOCK_PROFILE_ID);
        });

        it("throws an error if the deletion fails", async () => {
            mockEq.mockResolvedValueOnce({ error: { message: MOCK_ERROR_MESSAGE } });

            await expect(deleteBlockedUser(MOCK_PROFILE_ID)).rejects.toThrow(MOCK_ERROR_MESSAGE);
        });
    });
});