import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ProfilePage from "./profile";
import * as profileApi from "../../api/profile";
import { MemoryRouter } from "react-router";
import { useState } from "react";

vi.mock("../../api/profile", () => ({
    updateProfileDisplayName: vi.fn(),
}));

vi.mock("~/components/AsyncEditField", () => ({
    default: ({ value, onChange, onEditStateChange }: any) => {
        const MockField = () => {
            const [err, setErr] = useState("");
            return (
                <div>
                    <input
                        data-testid="edit-field"
                        defaultValue={value}
                        onChange={async (e) => {
                            try {
                                setErr("");
                                await onChange(e.target.value);
                            } catch (error: any) {
                                setErr(error.message);
                            }
                        }}
                    />
                    <button data-testid="trigger-edit" onClick={() => onEditStateChange(true)}>Edit</button>
                    {err && <span data-testid="error-message">{err}</span>}
                </div>
            );
        };
        return <MockField />;
    },
}));

vi.mock("~/components/PostList", () => ({
    default: () => <div data-testid="post-list" />
}));

vi.mock("react-country-flag", () => ({
    ReactCountryFlag: () => <span data-testid="flag" />
}));

vi.mock("~/modals/UnsavedChangesModal", () => ({
    default: ({ isOpen }: any) => isOpen ? <div data-testid="unsaved-modal" /> : null
}));

vi.mock("react-router", async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual as any,
        useBlocker: vi.fn(() => ({ state: "unblocked", proceed: vi.fn(), reset: vi.fn() })),
    };
});

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

    it("throws and displays a specific error when the API call fails", async () => {
        vi.mocked(profileApi.updateProfileDisplayName).mockRejectedValue(new Error("Database error: Unique constraint violation"));

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

        fireEvent.change(input, { target: { value: "TakenName" } });

        await waitFor(() => {
            expect(screen.getByTestId("error-message")).toHaveTextContent("Dieser Name ist bereits vergeben!");
        });
    });
});