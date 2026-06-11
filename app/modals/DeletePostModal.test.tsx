import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeAll, beforeEach } from "vitest";
import { useFetcher } from "react-router";
import DeletePostModal from "./DeletePostModal";

vi.mock("react-router", () => ({
    useFetcher: vi.fn(),
}));

describe("DeletePostModal", () => {
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

    it("closes modal on cancel", () => {
        render(<DeletePostModal postId={1} />);
        fireEvent.click(screen.getByRole("button", { name: /abbrechen/i, hidden: true }));
        expect(HTMLDialogElement.prototype.close).toHaveBeenCalled();
    });

    it("closes modal on submit", () => {
        render(<DeletePostModal postId={1} />);
        fireEvent.click(screen.getByRole("button", { name: /löschen/i, hidden: true }));
        expect(HTMLDialogElement.prototype.close).toHaveBeenCalled();
    });
});