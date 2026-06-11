import { describe, it, expect, vi, beforeEach } from "vitest";
import { signup } from "./signup";
import { getSupabaseClient } from "./supabaseClient";

vi.mock("./supabaseClient", () => ({
    getSupabaseClient: vi.fn(),
}));

const VALID_EMAIL = "test@example.com";
const VALID_DISPLAY_NAME = "Max Mustermann";
const VALID_PASSWORD = "securePassword123";

const ERROR_MISSING_CREDENTIALS = "Bitte E-Mail und Passwort eingeben.";
const ERROR_SIGNUP_FAILED = "User already registered";

const createFormData = (email?: string, displayName?: string, password?: string) => {
    const formData = new FormData();
    if (email) formData.append("email", email);
    if (displayName) formData.append("displayName", displayName);
    if (password) formData.append("password", password);
    return formData;
};

describe("Signup API Module", () => {
    let mockSignUp: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        vi.clearAllMocks();

        mockSignUp = vi.fn().mockResolvedValue({ error: null });

        (getSupabaseClient as any).mockReturnValue({
            auth: {
                signUp: mockSignUp,
            },
        });
    });

    describe("signup()", () => {
        it("fails immediately if email or password is missing", async () => {
            const formData = createFormData("", VALID_DISPLAY_NAME, "");

            const result = await signup(formData);

            expect(result).toEqual({ success: false, error: ERROR_MISSING_CREDENTIALS });
            expect(mockSignUp).not.toHaveBeenCalled();
        });

        it("fails if Supabase signup returns an error", async () => {
            const formData = createFormData(VALID_EMAIL, VALID_DISPLAY_NAME, VALID_PASSWORD);
            mockSignUp.mockResolvedValueOnce({ error: { message: ERROR_SIGNUP_FAILED } });

            const result = await signup(formData);

            expect(result).toEqual({ success: false, error: ERROR_SIGNUP_FAILED });
        });

        it("succeeds and passes the correct payload including metadata to Supabase", async () => {
            const formData = createFormData(VALID_EMAIL, VALID_DISPLAY_NAME, VALID_PASSWORD);

            const result = await signup(formData);

            expect(mockSignUp).toHaveBeenCalledWith({
                email: VALID_EMAIL,
                password: VALID_PASSWORD,
                options: {
                    data: {
                        display_name: VALID_DISPLAY_NAME,
                        blocked: false,
                    },
                },
            });
            expect(result).toEqual({ success: true });
        });
    });
});