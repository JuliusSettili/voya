import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach, beforeAll } from "vitest";
import AdminPage from "./admin-page";
import * as profileApi from "../../api/profile";

vi.mock("../../api/profile", () => ({
    fetchProfiles: vi.fn(),
    updateProfileRole: vi.fn(),
    blockProfile: vi.fn(),
    unblockProfile: vi.fn(),
}));

vi.mock("../../api/roles", () => ({
    fetchRoles: vi.fn(),
}));

vi.mock("../../api/supabaseClient", () => ({
    getSupabaseClient: vi.fn(() => ({
        auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: "admin1" } } }) }
    }))
}));

vi.mock("~/modals/BlockUserModal", () => ({
    default: ({ profile, onConfirm }: any) => (
        <div data-testid={`mock-modal-${profile.id}`}>
            <button
                data-testid={`trigger-confirm-${profile.id}`}
                onClick={() => onConfirm(profile.id, !profile.blocked, "Test Grund")}
            >
                Confirm
            </button>
        </div>
    )
}));

const mockProfiles = [
    { id: "admin1", display_name: "Admin", email: "admin@test.com", blocked: false, roles: { id: 1 }, blocked_users: [] },
    { id: "user2", display_name: "User Two", email: "two@test.com", blocked: true, roles: { id: 2 }, blocked_users: [{ block_text: "Spam" }] }
] as any;

const mockRoles = [
    { id: 1, name: "Admin" },
    { id: 2, name: "User" }
];

describe("AdminPage", () => {
    beforeAll(() => {
        HTMLDialogElement.prototype.showModal = vi.fn();
    });

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders profiles and roles", () => {
        const mockProps = {
            loaderData: { profiles: mockProfiles, roles: mockRoles, currentUserId: "admin1" },
            params: {},
            matches: []
        } as any;

        render(<AdminPage {...mockProps} />);

        expect(screen.getByText("Admin", { selector: "td.font-medium" })).toBeInTheDocument();
        expect(screen.getByText("User Two", { selector: "td.font-medium" })).toBeInTheDocument();
    });

    it("filters profiles by search query", async () => {
        const user = userEvent.setup();
        const mockProps = {
            loaderData: { profiles: mockProfiles, roles: mockRoles, currentUserId: "admin1" },
            params: {},
            matches: []
        } as any;

        render(<AdminPage {...mockProps} />);

        const searchInput = screen.getByPlaceholderText("Suche nach Namen...");
        await user.type(searchInput, "Two");

        expect(screen.queryByText("Admin", { selector: "td.font-medium" })).not.toBeInTheDocument();
        expect(screen.getByText("User Two", { selector: "td.font-medium" })).toBeInTheDocument();
    });

    it("updates a user role", async () => {
        const user = userEvent.setup();
        vi.mocked(profileApi.fetchProfiles).mockResolvedValue(mockProfiles);

        const mockProps = {
            loaderData: { profiles: mockProfiles, roles: mockRoles, currentUserId: "admin1" },
            params: {},
            matches: []
        } as any;

        render(<AdminPage {...mockProps} />);

        const selects = screen.getAllByRole("combobox");
        await user.selectOptions(selects[1], "1");

        expect(profileApi.updateProfileRole).toHaveBeenCalledWith("user2", 1);
        await waitFor(() => {
            expect(profileApi.fetchProfiles).toHaveBeenCalled();
        });
    });

    it("toggles block status via modal", async () => {
        const user = userEvent.setup();
        vi.mocked(profileApi.fetchProfiles).mockResolvedValue(mockProfiles);

        const mockProps = {
            loaderData: { profiles: mockProfiles, roles: mockRoles, currentUserId: "admin1" },
            params: {},
            matches: []
        } as any;

        render(<AdminPage {...mockProps} />);

        const confirmBtn = screen.getByTestId("trigger-confirm-user2");
        await user.click(confirmBtn);

        expect(profileApi.unblockProfile).toHaveBeenCalledWith("user2");
        await waitFor(() => {
            expect(profileApi.fetchProfiles).toHaveBeenCalled();
        });
    });
});