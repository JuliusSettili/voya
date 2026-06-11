import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeAll, beforeEach } from "vitest";
import { useFetcher } from "react-router";
import TogglePrivacyModal from "./TogglePrivacyModal";

vi.mock("react-router", () => ({
    useFetcher: vi.fn(),
}));

describe("TogglePrivacyModal", () => {
    beforeAll(() => {
        HTMLDialogElement.prototype.close = vi.fn();
    });

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(useFetcher).mockReturnValue({
            Form: ({ children, ...props }: any) => <form {...props}>{children}</form>,
            state: "idle",
        } as any);
    });

    it("displays correct action text", () => {
        render(<TogglePrivacyModal postId={1} currentIsPrivate={false} />);
        expect(screen.getByText(/privat/i)).toBeInTheDocument();
    });

    it("closes modal on cancel", () => {
        render(<TogglePrivacyModal postId={1} currentIsPrivate={false} />);
        fireEvent.click(screen.getByRole("button", { name: /abbrechen/i, hidden: true }));
        expect(HTMLDialogElement.prototype.close).toHaveBeenCalled();
    });

    it("closes modal on submit", () => {
        render(<TogglePrivacyModal postId={1} currentIsPrivate={false} />);
        fireEvent.click(screen.getByRole("button", { name: /bestätigen/i, hidden: true }));
        expect(HTMLDialogElement.prototype.close).toHaveBeenCalled();
    });
});