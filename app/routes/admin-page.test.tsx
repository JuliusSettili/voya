import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import AdminPage from "./admin-page";

vi.mock("../../api/profile", () => ({
    fetchProfiles: vi.fn(),
    updateProfileRole: vi.fn(),
    blockProfile: vi.fn(),
    unblockProfile: vi.fn(),
}));

vi.mock("../../api/roles", () => ({
    fetchRoles: vi.fn(),
}));

describe("AdminPage", () => {
    it("deaktiviert das Rollen-Dropdown und den Sperr-Button für den aktuell eingeloggten Benutzer", () => {
        const mockProfiles = [
            {
                id: "admin-123",
                display_name: "IchSelbst",
                email: "ich@test.de",
                roles: { id: 1 },
                blocked: false,
                blocked_users: []
            },
            {
                id: "user-456",
                display_name: "AndererUser",
                email: "anderer@test.de",
                roles: { id: 2 },
                blocked: true,
                blocked_users: [{ block_text: "Fiese Aussage" }]
            }
        ];

        const mockRoles = [
            { id: 1, name: "Admin" },
            { id: 2, name: "User" }
        ];

        render(
            <AdminPage
                {...({
                    loaderData: {
                        profiles: mockProfiles,
                        roles: mockRoles,
                        currentUserId: "admin-123"
                    }
                } as any)}
            />
        );

        const selects = screen.getAllByRole("combobox");
        expect(selects[0]).toBeDisabled();
        expect(selects[1]).not.toBeDisabled();

        const buttons = screen.getAllByRole("button", { name: /Aktiv|Gesperrt/i });
        expect(buttons[0]).toBeDisabled();
        expect(buttons[1]).not.toBeDisabled();
    });
});