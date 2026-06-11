import { describe, it, expect, vi, beforeEach } from "vitest";
import { getUser, checkIsAdmin } from "./auth";
import { getSupabaseClient } from "./supabaseClient";

vi.mock("./supabaseClient", () => ({
    getSupabaseClient: vi.fn(),
}));

const MOCK_USER_ID = "user-123";
const MOCK_USER = { id: MOCK_USER_ID, email: "test@test.de" };

const ROLE_ADMIN = 0;
const ROLE_USER = 1;

// Hilfsfunktion, um die tief verschachtelte Supabase API-Struktur sauber zu mocken
const setupSupabaseMock = (user: any | null, roleId: number | null = null) => {
    const mockSingle = vi.fn().mockResolvedValue({ data: roleId !== null ? { role_id: roleId } : null });
    const mockEq = vi.fn().mockReturnValue({ single: mockSingle });
    const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
    const mockFrom = vi.fn().mockReturnValue({ select: mockSelect });

    const supabaseMock = {
        auth: {
            getUser: vi.fn().mockResolvedValue({ data: { user } }),
        },
        from: mockFrom,
    };

    (getSupabaseClient as any).mockReturnValue(supabaseMock);

    return { mockFrom, mockSelect, mockEq, mockSingle };
};

describe("Auth API Module", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("getUser()", () => {
        it("returns the user object when authenticated", async () => {
            setupSupabaseMock(MOCK_USER);

            const user = await getUser();

            expect(user).toEqual(MOCK_USER);
        });

        it("returns null when no user is authenticated", async () => {
            setupSupabaseMock(null);

            const user = await getUser();

            expect(user).toBeNull();
        });
    });

    describe("checkIsAdmin()", () => {
        it("returns false if there is no authenticated user", async () => {
            setupSupabaseMock(null);

            const isAdmin = await checkIsAdmin();

            expect(isAdmin).toBe(false);
        });

        it("returns true if the user has the admin role (0)", async () => {
            const { mockFrom, mockSelect, mockEq } = setupSupabaseMock(MOCK_USER, ROLE_ADMIN);

            const isAdmin = await checkIsAdmin();

            expect(isAdmin).toBe(true);

            // Prüfen, ob die korrekte Tabelle und ID für die Abfrage genutzt wurden
            expect(mockFrom).toHaveBeenCalledWith("profiles");
            expect(mockSelect).toHaveBeenCalledWith("role_id");
            expect(mockEq).toHaveBeenCalledWith("id", MOCK_USER_ID);
        });

        it("returns false if the user has a regular user role (not 0)", async () => {
            setupSupabaseMock(MOCK_USER, ROLE_USER);

            const isAdmin = await checkIsAdmin();

            expect(isAdmin).toBe(false);
        });

        it("returns false if the profile data cannot be found", async () => {
            // roleId = null simuliert, dass die Datenbank keinen Eintrag findet
            setupSupabaseMock(MOCK_USER, null);

            const isAdmin = await checkIsAdmin();

            expect(isAdmin).toBe(false);
        });
    });
});