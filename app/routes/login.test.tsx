import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import LoginPage from "./login";
import { login } from "../../api/login";
import { useNavigate, useSearchParams, useNavigation } from "react-router";

vi.mock("../../api/login", () => ({
    login: vi.fn(),
}));

vi.mock("react-router", () => ({
    useNavigate: vi.fn(),
    useSearchParams: vi.fn(),
    useNavigation: vi.fn(),
    Link: ({ children, to }: any) => <a href={to}>{children}</a>,
}));

vi.mock("~/components/InputField", () => ({
    default: ({ label, ...props }: any) => (
        <div>
            <label htmlFor={props.id}>{label}</label>
            <input {...props} />
        </div>
    )
}));

describe("LoginPage Component", () => {
    const mockNavigate = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        (useNavigate as any).mockReturnValue(mockNavigate);
        (useSearchParams as any).mockReturnValue([new URLSearchParams()]);
        (useNavigation as any).mockReturnValue({ state: "idle" });
    });

    it("renders login form correctly", () => {
        render(<LoginPage />);
        expect(screen.getByText("Willkommen zurück!")).toBeInTheDocument();
        expect(screen.getByLabelText(/E-Mail Adresse/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
    });

    it("navigates to home on successful login", async () => {
        (login as any).mockResolvedValue({ success: true });

        render(<LoginPage />);

        fireEvent.submit(screen.getByRole("button", { name: /login/i }).closest('form')!);

        await waitFor(() => {
            expect(login).toHaveBeenCalled();
            expect(mockNavigate).toHaveBeenCalledWith("/");
        });
    });

    it("displays error message on failed login", async () => {
        (login as any).mockResolvedValue({ success: false, error: "Ungültige Daten" });

        render(<LoginPage />);

        fireEvent.submit(screen.getByRole("button", { name: /login/i }).closest('form')!);

        await waitFor(() => {
            expect(screen.getByRole("alert")).toHaveTextContent("Ungültige Daten");
        });
    });

    it("shows loading state while submitting", async () => {
        (useNavigation as any).mockReturnValue({ state: "submitting" });

        render(<LoginPage />);

        const submitButton = screen.getByRole("button", { name: /login/i });

        expect(submitButton).toBeDisabled();
        expect(submitButton).toHaveTextContent("Login...");
    });
});