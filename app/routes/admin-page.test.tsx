import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import AdminPage from "./admin-page";
import { fetchProfiles, updateProfileRole } from "../../api/profile";
import { fetchRoles } from "../../api/roles";

vi.mock("../../api/profile", () => ({
    fetchProfiles: vi.fn(),
    updateProfileRole: vi.fn(),
    blockProfile: vi.fn(),
    unblockProfile: vi.fn(),
}));

vi.mock("../../api/roles", () => ({
    fetchRoles: vi.fn(),
}));

const MOCK_MATCHES = [
    { id: "root", params: {}, pathname: "/", data: undefined, loaderData: undefined, handle: undefined },
    { id: "layouts/default", params: {}, pathname: "/", data: undefined, loaderData: undefined, handle: undefined },
    { id: "routes/admin", params: {}, pathname: "/admin", data: undefined, loaderData: undefined, handle: undefined }
] as any;

const MOCK_PROFILES = [
    {
        id: "1",
        display_name: "User A",
        email: "a@test.com",
        blocked: false,
        role_id: 1,
        roles: { id: 1, name: "User" },
        blocked_users: { id: "1", block_text: "" }
    },
    {
        id: "2",
        display_name: "User B",
        email: "b@test.com",
        blocked: true,
        role_id: 2,
        roles: { id: 2, name: "Admin" },
        blocked_users: { id: "2", block_text: "Spam" }
    }
];

const MOCK_ROLES = [{ id: 1, name: "User" }, { id: 2, name: "Admin" }];

describe("AdminPage Component", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (fetchProfiles as any).mockResolvedValue(MOCK_PROFILES);
        (fetchRoles as any).mockResolvedValue(MOCK_ROLES);
    });

    it("renders the dashboard with profiles", async () => {
        render(<AdminPage loaderData={{ profiles: MOCK_PROFILES, roles: MOCK_ROLES }} params={{}} matches={MOCK_MATCHES} />);

        expect(screen.getByText("Admin Dashboard")).toBeInTheDocument();
        expect(screen.getByText("User A")).toBeInTheDocument();
        expect(screen.getByText("User B")).toBeInTheDocument();
    });

    it("filters profiles by search query", async () => {
        render(<AdminPage loaderData={{ profiles: MOCK_PROFILES, roles: MOCK_ROLES }} params={{}} matches={MOCK_MATCHES} />);

        const searchInput = screen.getByPlaceholderText("Suche nach Namen...");
        fireEvent.change(searchInput, { target: { value: "User A" } });

        expect(screen.getByText("User A")).toBeInTheDocument();
        expect(screen.queryByText("User B")).not.toBeInTheDocument();
    });

    it("updates role when selection changes", async () => {
        (updateProfileRole as any).mockResolvedValue({});
        (fetchProfiles as any).mockResolvedValue(MOCK_PROFILES);

        render(<AdminPage loaderData={{ profiles: MOCK_PROFILES, roles: MOCK_ROLES }} params={{}} matches={MOCK_MATCHES} />);

        const select = screen.getAllByRole("combobox")[0];
        fireEvent.change(select, { target: { value: "2" } });

        await waitFor(() => {
            expect(updateProfileRole).toHaveBeenCalledWith("1", 2);
        });
    });
});