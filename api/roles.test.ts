import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchRoles } from "./roles";
import { getSupabaseClient } from "./supabaseClient";
import type { Role } from "./supabaseClient";

vi.mock("./supabaseClient", () => ({
    getSupabaseClient: vi.fn(),
}));

const MOCK_ERROR_MSG = "Database error fetching roles";

const MOCK_ROLE_ADMIN = { id: 0, name: "Admin" } as Role;
const MOCK_ROLE_USER = { id: 1, name: "User" } as Role;
const MOCK_ROLES = [MOCK_ROLE_ADMIN, MOCK_ROLE_USER];

describe("Roles API Module", () => {
    let mockOrder: ReturnType<typeof vi.fn>;
    let mockSelect: ReturnType<typeof vi.fn>;
    let mockFrom: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        vi.clearAllMocks();

        mockOrder = vi.fn().mockResolvedValue({ data: MOCK_ROLES, error: null });
        mockSelect = vi.fn().mockReturnValue({ order: mockOrder });
        mockFrom = vi.fn().mockReturnValue({ select: mockSelect });

        (getSupabaseClient as any).mockReturnValue({ from: mockFrom });
    });

    describe("fetchRoles()", () => {
        it("fetches and returns a list of roles successfully", async () => {
            const result = await fetchRoles();

            expect(mockFrom).toHaveBeenCalledWith("roles");
            expect(mockSelect).toHaveBeenCalledWith("id, name");
            expect(mockOrder).toHaveBeenCalledWith("id", { ascending: true });
            expect(result).toEqual(MOCK_ROLES);
        });

        it("returns an empty array if data is null", async () => {
            mockOrder.mockResolvedValueOnce({ data: null, error: null });

            const result = await fetchRoles();

            expect(result).toEqual([]);
        });

        it("throws an error if the database query fails", async () => {
            mockOrder.mockResolvedValueOnce({ data: null, error: { message: MOCK_ERROR_MSG } });

            await expect(fetchRoles()).rejects.toThrow(MOCK_ERROR_MSG);
        });
    });
});