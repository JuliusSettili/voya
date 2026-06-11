import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeAll, beforeEach } from "vitest";
import { useFetcher } from "react-router";
import BlockPostModal from "./BlockPostModal";

vi.mock("react-router", () => ({
    useFetcher: vi.fn(),
}));

describe("BlockPostModal", () => {
    beforeAll(() => {
        HTMLDialogElement.prototype.close = vi.fn();
    });

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(useFetcher).mockReturnValue({
            Form: ({ children, ...props }: any) => <form role="form" {...props}>{children}</form>,
            state: "idle",
        } as any);
    });

    it("shows error validation when reason is empty", () => {
        render(<BlockPostModal postId={1} />);

        const form = screen.getByRole("form", { hidden: true });
        fireEvent.submit(form);

        expect(screen.getByText(/Bitte gib eine gültige Begründung ein/i)).toBeInTheDocument();
        expect(HTMLDialogElement.prototype.close).not.toHaveBeenCalled();
    });

    it("submits form when reason is valid", () => {
        render(<BlockPostModal postId={1} />);

        const textarea = screen.getByPlaceholderText(/Begründung eingeben/i);
        fireEvent.change(textarea, { target: { value: "Sperrung wegen Verstoß" } });

        const form = screen.getByRole("form", { hidden: true });
        fireEvent.submit(form);

        expect(HTMLDialogElement.prototype.close).toHaveBeenCalled();
    });
});