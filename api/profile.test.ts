import { describe, it, expect, vi, beforeEach } from "vitest";
import {
    fetchProfiles,
    blockProfile,
    unblockProfile,
    updateProfileDisplayName,
    updateProfileRole,
    fetchProfileById
} from "./profile";
import { getSupabaseClient } from "./supabaseClient";
import { insertBlockedUser, deleteBlockedUser } from "./blockeduser";
import type { Profile } from "./supabaseClient";

vi.mock("./supabaseClient", () => ({
    getSupabaseClient: vi.fn(),
}));

vi.mock("./blockeduser", () => ({
    insertBlockedUser: vi.fn().mockResolvedValue(undefined),
    deleteBlockedUser: vi.fn().mockResolvedValue(undefined),
}));

const MOCK_PROFILE_ID = "user-123";
const MOCK_REASON = "Verstoß gegen Richtlinien";
const MOCK_DISPLAY_NAME = "NeuerName123";
const MOCK_ROLE_ID = 0;
const MOCK_ERROR_MSG = "Database error";

const MOCK_PROFILE = { id: MOCK_PROFILE_ID, display_name: "TestUser" } as unknown as Profile;

describe("Profile API Module", () => {
    let mockFrom: ReturnType<typeof vi.fn>;
    let mockSelect: ReturnType<typeof vi.fn>;
    let mockUpdate: ReturnType<typeof vi.fn>;
    let mockEq: ReturnType<typeof vi.fn>;
    let mockOrder: ReturnType<typeof vi.fn>;
    let mockSingle: ReturnType<typeof vi.fn>;
    let mockAuthGetUser: ReturnType<typeof vi.fn>;
    let mockAuthUpdateUser: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        vi.clearAllMocks();

        mockOrder = vi.fn().mockResolvedValue({ data: [MOCK_PROFILE], error: null });
        mockSingle = vi.fn().mockResolvedValue({ data: MOCK_PROFILE, error: null });
        mockEq = vi.fn().mockReturnValue({ single: mockSingle });
        mockSelect = vi.fn().mockReturnValue({ order: mockOrder, eq: mockEq });
        mockUpdate = vi.fn().mockReturnValue({ eq: mockEq });

        mockFrom = vi.fn().mockReturnValue({
            select: mockSelect,
            update: mockUpdate,
        });

        mockAuthGetUser = vi.fn().mockResolvedValue({ data: { user: { id: MOCK_PROFILE_ID } } });
        mockAuthUpdateUser = vi.fn().mockResolvedValue({ error: null });

        (getSupabaseClient as any).mockReturnValue({
            from: mockFrom,
            auth: {
                getUser: mockAuthGetUser,
                updateUser: mockAuthUpdateUser,
            },
        });
    });

    describe("fetchProfiles()", () => {
        it("fetches and returns all profiles", async () => {
            const result = await fetchProfiles();

            expect(mockFrom).toHaveBeenCalledWith("profiles");
            expect(mockSelect).toHaveBeenCalledWith(expect.stringContaining("id, display_name, blocked"));
            expect(mockOrder).toHaveBeenCalledWith("id", { ascending: true });
            expect(result).toEqual([MOCK_PROFILE]);
        });

        it("throws an error if fetching fails", async () => {
            mockOrder.mockResolvedValueOnce({ error: { message: MOCK_ERROR_MSG } });

            await expect(fetchProfiles()).rejects.toThrow(MOCK_ERROR_MSG);
        });
    });

    describe("blockProfile()", () => {
        it("updates the profile to blocked and inserts a blocked user reason", async () => {
            mockEq.mockResolvedValueOnce({ error: null });

            await blockProfile(MOCK_PROFILE_ID, MOCK_REASON);

            expect(mockUpdate).toHaveBeenCalledWith({ blocked: true });
            expect(mockEq).toHaveBeenCalledWith("id", MOCK_PROFILE_ID);
            expect(insertBlockedUser).toHaveBeenCalledWith(MOCK_PROFILE_ID, MOCK_REASON);
        });

        it("throws an error if updating the profile fails", async () => {
            mockEq.mockResolvedValueOnce({ error: { message: MOCK_ERROR_MSG } });

            await expect(blockProfile(MOCK_PROFILE_ID, MOCK_REASON)).rejects.toThrow(MOCK_ERROR_MSG);
            expect(insertBlockedUser).not.toHaveBeenCalled();
        });
    });

    describe("unblockProfile()", () => {
        it("updates the profile to unblocked and deletes the block reason", async () => {
            mockEq.mockResolvedValueOnce({ error: null });

            await unblockProfile(MOCK_PROFILE_ID);

            expect(mockUpdate).toHaveBeenCalledWith({ blocked: false });
            expect(mockEq).toHaveBeenCalledWith("id", MOCK_PROFILE_ID);
            expect(deleteBlockedUser).toHaveBeenCalledWith(MOCK_PROFILE_ID);
        });
    });

    describe("updateProfileDisplayName()", () => {
        it("updates the display name in the database and auth metadata", async () => {
            mockEq.mockResolvedValueOnce({ error: null });

            await updateProfileDisplayName(MOCK_PROFILE_ID, MOCK_DISPLAY_NAME);

            expect(mockAuthGetUser).toHaveBeenCalled();
            expect(mockUpdate).toHaveBeenCalledWith({ display_name: MOCK_DISPLAY_NAME });
            expect(mockEq).toHaveBeenCalledWith("id", MOCK_PROFILE_ID);
            expect(mockAuthUpdateUser).toHaveBeenCalledWith({ data: { display_name: MOCK_DISPLAY_NAME } });
        });

        it("throws an error if the user is not logged in", async () => {
            mockAuthGetUser.mockResolvedValueOnce({ data: { user: null } });

            await expect(updateProfileDisplayName(MOCK_PROFILE_ID, MOCK_DISPLAY_NAME)).rejects.toThrow("Nicht angemeldet");
        });

        it("throws a specific error if the display name is already taken", async () => {
            mockEq.mockResolvedValueOnce({ error: { code: "23505", message: MOCK_ERROR_MSG } });

            await expect(updateProfileDisplayName(MOCK_PROFILE_ID, MOCK_DISPLAY_NAME)).rejects.toThrow(
                "Der Anzeigename ist bereits vergeben. Bitte wählen Sie einen anderen Namen."
            );
            expect(mockAuthUpdateUser).not.toHaveBeenCalled();
        });

        it("throws an error if auth metadata update fails", async () => {
            mockEq.mockResolvedValueOnce({ error: null });
            mockAuthUpdateUser.mockResolvedValueOnce({ error: { message: MOCK_ERROR_MSG } });

            await expect(updateProfileDisplayName(MOCK_PROFILE_ID, MOCK_DISPLAY_NAME)).rejects.toThrow(MOCK_ERROR_MSG);
        });
    });

    describe("updateProfileRole()", () => {
        it("updates the role id successfully", async () => {
            mockEq.mockResolvedValueOnce({ error: null });

            await updateProfileRole(MOCK_PROFILE_ID, MOCK_ROLE_ID);

            expect(mockUpdate).toHaveBeenCalledWith({ role_id: MOCK_ROLE_ID });
            expect(mockEq).toHaveBeenCalledWith("id", MOCK_PROFILE_ID);
        });
    });

    describe("fetchProfileById()", () => {
        it("fetches a single profile successfully", async () => {
            const result = await fetchProfileById(MOCK_PROFILE_ID);

            expect(mockEq).toHaveBeenCalledWith("id", MOCK_PROFILE_ID);
            expect(mockSingle).toHaveBeenCalled();
            expect(result).toEqual(MOCK_PROFILE);
        });
    });
});