import { render, screen, fireEvent } from "@testing-library/react";
import { vi, describe, it, expect, beforeAll } from "vitest";
import DeleteImageModal from "./DeleteImageModal";

describe("DeleteImageModal", () => {
    beforeAll(() => {
        HTMLDialogElement.prototype.close = vi.fn();
    });

    it("closes modal on cancel", () => {
        render(<DeleteImageModal imageId={1} onConfirm={vi.fn()} />);

        fireEvent.click(screen.getByRole("button", { name: /abbrechen/i, hidden: true }));
        expect(HTMLDialogElement.prototype.close).toHaveBeenCalled();
    });

    it("calls onConfirm and closes modal on confirm", () => {
        const onConfirm = vi.fn();
        render(<DeleteImageModal imageId={1} onConfirm={onConfirm} />);

        fireEvent.click(screen.getByRole("button", { name: /löschen/i, hidden: true }));

        expect(onConfirm).toHaveBeenCalled();
        expect(HTMLDialogElement.prototype.close).toHaveBeenCalled();
    });
});