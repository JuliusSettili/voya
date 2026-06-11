import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import Navbar from "./Navbar";
import { logout } from "../../api/login";
import { getSupabaseClient } from "../../api/supabaseClient";
import { useNavigate } from "react-router";

vi.mock("react-router", () => ({
    Link: ({ to, children }: { to: string; children: React.ReactNode }) => <a href={to}>{children}</a>,
    useNavigate: vi.fn(),
}));

vi.mock("../../api/login", () => ({
    logout: vi.fn(),
}));

vi.mock("../../api/supabaseClient", () => ({
    getSupabaseClient: vi.fn(),
}));

const MOCK_USER_ID = "user-123";
const MOCK_DISPLAY_NAME = "Max Mustermann";

const TEXT_LOGO = "Voya";
const TEXT_DISCOVER = "Entdecken";
const TEXT_LOGIN = "Login";
const TEXT_PROFILE = "Profil";
const TEXT_ADMIN_PANEL = "Benutzerverwaltung";
const TEXT_LOGOUT = "Abmelden";
const ROUTE_HOME = "/";

const ROLE_ADMIN = 0;
const ROLE_USER = 1;

// Hilfsfunktion, um die verketteten Aufrufe des Supabase-Clients (auth, from, select, eq, single) zu mocken
const setupSupabaseMock = (user: any | null, roleId: number | null = null) => {
    const mockUnsubscribe = vi.fn();
    const supabaseMock = {
        auth: {
            getUser: vi.fn().mockResolvedValue({ data: { user } }),
            onAuthStateChange: vi.fn().mockReturnValue({
                data: { subscription: { unsubscribe: mockUnsubscribe } }
            }),
        },
        from: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                    single: vi.fn().mockResolvedValue({ data: roleId !== null ? { role_id: roleId } : null })
                })
            })
        })
    };
    (getSupabaseClient as Mock).mockReturnValue(supabaseMock);
    return { mockUnsubscribe };
};

describe("Navbar Component", () => {
    let mockNavigate: Mock;

    beforeEach(() => {
        vi.clearAllMocks();
        mockNavigate = vi.fn();
        (useNavigate as Mock).mockReturnValue(mockNavigate);
    });

    it("renders public links when user is not authenticated", async () => {
        setupSupabaseMock(null);

        render(<Navbar />);

        expect(screen.getByText(TEXT_LOGO)).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText(TEXT_LOGIN)).toBeInTheDocument();
        });

        expect(screen.queryByText(TEXT_DISCOVER)).not.toBeInTheDocument();
        expect(screen.queryByText(TEXT_PROFILE)).not.toBeInTheDocument();
        expect(screen.queryByText(TEXT_ADMIN_PANEL)).not.toBeInTheDocument();
    });

    it("renders user-specific links and hides admin panel for regular users", async () => {
        const mockUser = { id: MOCK_USER_ID, user_metadata: { display_name: MOCK_DISPLAY_NAME } };
        setupSupabaseMock(mockUser, ROLE_USER);

        render(<Navbar />);

        expect(await screen.findByText(TEXT_DISCOVER)).toBeInTheDocument();
        expect(screen.getByText(MOCK_DISPLAY_NAME)).toBeInTheDocument();
        expect(screen.getByText(TEXT_PROFILE)).toBeInTheDocument();
        expect(screen.getByText(TEXT_LOGOUT)).toBeInTheDocument();

        expect(screen.queryByText(TEXT_LOGIN)).not.toBeInTheDocument();
        expect(screen.queryByText(TEXT_ADMIN_PANEL)).not.toBeInTheDocument();
    });

    it("renders the admin panel link for admin users", async () => {
        const mockUser = { id: MOCK_USER_ID, user_metadata: { display_name: MOCK_DISPLAY_NAME } };
        setupSupabaseMock(mockUser, ROLE_ADMIN);

        render(<Navbar />);

        expect(await screen.findByText(TEXT_ADMIN_PANEL)).toBeInTheDocument();
    });

    it("calls logout and navigates to home when logout button is clicked", async () => {
        const userEventSetup = userEvent.setup();
        const mockUser = { id: MOCK_USER_ID, user_metadata: { display_name: MOCK_DISPLAY_NAME } };
        setupSupabaseMock(mockUser, ROLE_USER);
        (logout as Mock).mockResolvedValue({ success: true });

        render(<Navbar />);

        const logoutButton = await screen.findByText(TEXT_LOGOUT);
        await userEventSetup.click(logoutButton);

        expect(logout).toHaveBeenCalledTimes(1);
        expect(mockNavigate).toHaveBeenCalledWith(ROUTE_HOME);
    });

    it("does not navigate if logout fails", async () => {
        const userEventSetup = userEvent.setup();
        const mockUser = { id: MOCK_USER_ID, user_metadata: { display_name: MOCK_DISPLAY_NAME } };
        setupSupabaseMock(mockUser, ROLE_USER);
        (logout as Mock).mockResolvedValue({ success: false });

        render(<Navbar />);

        const logoutButton = await screen.findByText(TEXT_LOGOUT);
        await userEventSetup.click(logoutButton);

        expect(logout).toHaveBeenCalledTimes(1);
        expect(mockNavigate).not.toHaveBeenCalled();
    });
});