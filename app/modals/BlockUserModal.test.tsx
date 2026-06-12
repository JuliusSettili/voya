import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import BlockUserModal from "./BlockUserModal";

const mockProfileActive = { id: "1", display_name: "TestUser", blocked: false };
const mockProfileBlocked = { id: "2", display_name: "BlockedUser", blocked: true };

describe("BlockUserModal", () => {
    it("renders correctly for an active user", () => {
        render(<BlockUserModal profile={mockProfileActive} onConfirm={vi.fn()} />);

        expect(screen.getByText("Nutzer sperren")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Grund für Sperrung...")).toBeInTheDocument();
        expect(screen.getByText("Bestätigen")).toHaveClass("btn-error");
    });

    it("renders correctly for a blocked user", () => {
        render(<BlockUserModal profile={mockProfileBlocked} blockReason="Spam" onConfirm={vi.fn()} />);

        expect(screen.getByText("Nutzer entsperren")).toBeInTheDocument();
        expect(screen.getByDisplayValue("Spam")).toBeDisabled();
        expect(screen.getByText("Bestätigen")).toHaveClass("btn-success");
    });

    it("calls onConfirm with reason when blocking a user", async () => {
        const mockOnConfirm = vi.fn();
        const user = userEvent.setup();

        render(<BlockUserModal profile={mockProfileActive} onConfirm={mockOnConfirm} />);

        const input = screen.getByPlaceholderText("Grund für Sperrung...");
        await user.type(input, "Regelverstoß");

        const confirmBtn = screen.getByText("Bestätigen");
        await user.click(confirmBtn);

        expect(mockOnConfirm).toHaveBeenCalledWith("1", true, "Regelverstoß");
    });

    it("calls onConfirm without reason when unblocking a user", async () => {
        const mockOnConfirm = vi.fn();
        const user = userEvent.setup();

        render(<BlockUserModal profile={mockProfileBlocked} onConfirm={mockOnConfirm} />);

        const confirmBtn = screen.getByText("Bestätigen");
        await user.click(confirmBtn);

        expect(mockOnConfirm).toHaveBeenCalledWith("2", false, "");
    });
});