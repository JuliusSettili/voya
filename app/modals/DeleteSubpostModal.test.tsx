import { render, screen, fireEvent } from "@testing-library/react";
import { vi, describe, it, expect, beforeAll } from "vitest";
import DeleteSubpostModal from "./DeleteSubpostModal";

describe("DeleteSubpostModal", () => {
    beforeAll(() => {
        HTMLDialogElement.prototype.close = vi.fn();
    });

    it("closes on cancel", () => {
        render(<DeleteSubpostModal subPostId={1} onConfirm={vi.fn()} />);

        fireEvent.click(screen.getByRole("button", { name: /abbrechen/i, hidden: true }));
        expect(HTMLDialogElement.prototype.close).toHaveBeenCalled();
    });

    it("confirms and closes", () => {
        const onConfirm = vi.fn();
        render(<DeleteSubpostModal subPostId={1} onConfirm={onConfirm} />);

        fireEvent.click(screen.getByRole("button", { name: /löschen/i, hidden: true }));

        expect(onConfirm).toHaveBeenCalled();
        expect(HTMLDialogElement.prototype.close).toHaveBeenCalled();
    });
});