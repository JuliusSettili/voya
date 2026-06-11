import { describe, it, expect, vi, beforeEach } from "vitest";
import { updateProfileRole } from "./profile";
import { getSupabaseClient } from "./supabaseClient";

vi.mock("./supabaseClient", () => ({
    getSupabaseClient: vi.fn(),
}));

describe("Profile API", () => {
    let mockGetUser: ReturnType<typeof vi.fn>;
    let mockUpdate: ReturnType<typeof vi.fn>;
    let mockEq: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        vi.clearAllMocks();
        mockGetUser = vi.fn();
        mockEq = vi.fn();
        mockUpdate = vi.fn().mockReturnValue({ eq: mockEq });

        (getSupabaseClient as any).mockReturnValue({
            auth: { getUser: mockGetUser },
            from: vi.fn().mockReturnValue({ update: mockUpdate }),
        });
    });

    describe("updateProfileRole", () => {
        it("wirft einen Fehler, wenn der Benutzer versucht, seine eigene Rolle zu ändern", async () => {
            const MOCK_USER_ID = "admin-123";
            const NEW_ROLE_ID = 2;

            mockGetUser.mockResolvedValueOnce({ data: { user: { id: MOCK_USER_ID } } });

            await expect(updateProfileRole(MOCK_USER_ID, NEW_ROLE_ID)).rejects.toThrow(
                "Sicherheitsfehler: Du kannst deine eigene Rolle nicht ändern."
            );

            expect(mockUpdate).not.toHaveBeenCalled();
        });

        it("aktualisiert die Rolle erfolgreich für andere Benutzer", async () => {
            const MOCK_USER_ID = "admin-123";
            const TARGET_USER_ID = "user-456";
            const NEW_ROLE_ID = 2;

            mockGetUser.mockResolvedValueOnce({ data: { user: { id: MOCK_USER_ID } } });
            mockEq.mockResolvedValueOnce({ error: null });

            const result = await updateProfileRole(TARGET_USER_ID, NEW_ROLE_ID);

            expect(result).toBeUndefined();
            expect(mockUpdate).toHaveBeenCalledWith({ role_id: NEW_ROLE_ID });
            expect(mockEq).toHaveBeenCalledWith('id', TARGET_USER_ID);
        });
    });
});