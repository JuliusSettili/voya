import { describe, it, expect, vi, beforeEach } from "vitest";
import { login, logout } from "./login";
import { getSupabaseClient } from "./supabaseClient";
import { fetchProfileById } from "./profile";

vi.mock("./supabaseClient", () => ({
    getSupabaseClient: vi.fn(),
}));

vi.mock("./profile", () => ({
    fetchProfileById: vi.fn(),
}));

const MOCK_USER_ID = "user-123";
const VALID_EMAIL = "test@example.com";
const VALID_PASSWORD = "password123";
const ERROR_MISSING_CREDENTIALS = "Bitte E-Mail und Passwort eingeben.";
const ERROR_BLOCKED_ACCOUNT = "Ihr Konto ist gesperrt.";
const ERROR_INVALID_CREDENTIALS = "Invalid login credentials";

const createFormData = (email?: string, password?: string) => {
    const formData = new FormData();
    if (email) formData.append("email", email);
    if (password) formData.append("password", password);
    return formData;
};

describe("Auth API Module (login & logout)", () => {
    let mockSignInWithPassword: ReturnType<typeof vi.fn>;
    let mockGetUser: ReturnType<typeof vi.fn>;
    let mockSignOut: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        vi.clearAllMocks();

        mockSignInWithPassword = vi.fn().mockResolvedValue({ error: null });
        mockGetUser = vi.fn().mockResolvedValue({ data: { user: { id: MOCK_USER_ID } } });
        mockSignOut = vi.fn().mockResolvedValue({ error: null });

        (getSupabaseClient as any).mockReturnValue({
            auth: {
                signInWithPassword: mockSignInWithPassword,
                getUser: mockGetUser,
                signOut: mockSignOut,
            },
        });

        (fetchProfileById as any).mockResolvedValue({ blocked: false });
    });

    describe("login()", () => {
        it("fails immediately if email or password is missing", async () => {
            const formData = createFormData("", "");

            const result = await login(formData);

            expect(result).toEqual({ success: false, error: ERROR_MISSING_CREDENTIALS });
            expect(mockSignInWithPassword).not.toHaveBeenCalled();
        });

        it("fails and signs out if the user profile is blocked", async () => {
            const formData = createFormData(VALID_EMAIL, VALID_PASSWORD);
            (fetchProfileById as any).mockResolvedValueOnce({ blocked: true });

            const result = await login(formData);

            expect(fetchProfileById).toHaveBeenCalledWith(MOCK_USER_ID);
            expect(mockSignOut).toHaveBeenCalledTimes(1);
            expect(result).toEqual({ success: false, error: ERROR_BLOCKED_ACCOUNT });
        });

        it("fails if Supabase authentication returns an error", async () => {
            const formData = createFormData(VALID_EMAIL, VALID_PASSWORD);
            mockSignInWithPassword.mockResolvedValueOnce({ error: { message: ERROR_INVALID_CREDENTIALS } });

            const result = await login(formData);

            expect(result).toEqual({ success: false, error: ERROR_INVALID_CREDENTIALS });
        });

        it("succeeds for valid credentials and unblocked profile", async () => {
            const formData = createFormData(VALID_EMAIL, VALID_PASSWORD);

            const result = await login(formData);

            expect(mockSignInWithPassword).toHaveBeenCalledWith({ email: VALID_EMAIL, password: VALID_PASSWORD });
            expect(result).toEqual({ success: true });
        });
    });

    describe("logout()", () => {
        it("succeeds when Supabase sign out is successful", async () => {
            const result = await logout();

            expect(mockSignOut).toHaveBeenCalledTimes(1);
            expect(result).toEqual({ success: true });
        });

        it("fails and returns error message when Supabase sign out fails", async () => {
            const mockError = "Network Error";
            mockSignOut.mockResolvedValueOnce({ error: { message: mockError } });

            const result = await logout();

            expect(result).toEqual({ success: false, error: mockError });
        });
    });
});