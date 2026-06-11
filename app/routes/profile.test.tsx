import {render, screen, fireEvent, waitFor} from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ProfilePage from "./profile";
import * as profileApi from "../../api/profile";
import {MemoryRouter} from "react-router";

vi.mock("../../api/profile", () => ({
    updateProfileDisplayName: vi.fn(),
}));

vi.mock("~/components/AsyncEditField", () => ({
    default: ({ value, onChange }: any) => (
        <input
            data-testid="edit-field"
            value={value}
            onChange={(e) => onChange(e.target.value)}
        />
    ),
}));

vi.mock("~/components/PostList", () => ({
    default: () => <div data-testid="post-list" />
}));

vi.mock("react-country-flag", () => ({
    ReactCountryFlag: () => <span data-testid="flag" />
}));

const mockLoaderData = {
    profile: { id: "p1", display_name: "TestUser", email: "test@example.com" },
    posts: [],
    countries: [{ code: "DE" }]
};

describe("ProfilePage", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders profile information", () => {
        const mockProps = {
            loaderData: mockLoaderData,
            params: { id: "p1" },
            matches: []
        } as any;

        render(
            <MemoryRouter>
                <ProfilePage {...mockProps} />
            </MemoryRouter>
        );

        expect(screen.getByDisplayValue("TestUser")).toBeInTheDocument();
        expect(screen.getByText("test@example.com")).toBeInTheDocument();
        expect(screen.getByTestId("post-list")).toBeInTheDocument();
    });

    it("updates display name on change", async () => {
        vi.mocked(profileApi.updateProfileDisplayName).mockResolvedValue({} as any);

        const mockProps = {
            loaderData: mockLoaderData,
            params: { id: "p1" },
            matches: []
        } as any;

        render(
            <MemoryRouter>
                <ProfilePage {...mockProps} />
            </MemoryRouter>
        );

        const input = screen.getByTestId("edit-field");

        fireEvent.change(input, { target: { value: "NewName" } });

        await waitFor(() => {
            expect(profileApi.updateProfileDisplayName).toHaveBeenCalledWith("p1", "NewName");
        });
    });
});