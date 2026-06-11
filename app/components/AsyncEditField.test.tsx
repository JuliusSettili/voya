import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import AsyncEditField from "./AsyncEditField";

const INITIAL_TEXT_VALUE = "Hello World";
const UPDATED_TEXT_VALUE = "Updated Content";
const ERROR_MESSAGE_NETWORK = "Network error while saving.";

const BUTTON_TITLE_EDIT = "Bearbeiten";
const BUTTON_TITLE_SAVE = "Änderungen speichern";
const INPUT_ROLE_TEXTBOX = "textbox";

const EXPECTED_API_CALL_COUNT_ON_SUCCESS = 1;

describe("AsyncEditField Component", () => {
    it("renders the initial value and edit button correctly", () => {
        const mockOnChange = vi.fn().mockResolvedValue(undefined);

        render(<AsyncEditField value={INITIAL_TEXT_VALUE} onChange={mockOnChange} />);

        expect(screen.getByText(INITIAL_TEXT_VALUE)).toBeInTheDocument();
        expect(screen.getByTitle(BUTTON_TITLE_EDIT)).toBeInTheDocument();
    });

    it("switches to edit mode and displays input field when edit button is clicked", async () => {
        const user = userEvent.setup();
        const mockOnChange = vi.fn().mockResolvedValue(undefined);
        render(<AsyncEditField value={INITIAL_TEXT_VALUE} onChange={mockOnChange} />);

        const editButton = screen.getByTitle(BUTTON_TITLE_EDIT);
        await user.click(editButton);

        const inputField = screen.getByRole(INPUT_ROLE_TEXTBOX);
        expect(inputField).toBeInTheDocument();
        expect(inputField).toHaveValue(INITIAL_TEXT_VALUE);
        expect(screen.getByTitle(BUTTON_TITLE_SAVE)).toBeInTheDocument();
    });

    it("saves the new value, calls onChange, and closes edit mode on success", async () => {
        const user = userEvent.setup();
        const mockOnChange = vi.fn().mockResolvedValue(undefined);
        render(<AsyncEditField value={INITIAL_TEXT_VALUE} onChange={mockOnChange} />);

        await user.click(screen.getByTitle(BUTTON_TITLE_EDIT));

        const inputField = screen.getByRole(INPUT_ROLE_TEXTBOX);
        await user.clear(inputField);
        await user.type(inputField, UPDATED_TEXT_VALUE);

        await user.click(screen.getByTitle(BUTTON_TITLE_SAVE));

        expect(mockOnChange).toHaveBeenCalledWith(UPDATED_TEXT_VALUE);
        expect(mockOnChange).toHaveBeenCalledTimes(EXPECTED_API_CALL_COUNT_ON_SUCCESS);
        expect(screen.queryByRole(INPUT_ROLE_TEXTBOX)).not.toBeInTheDocument();
    });

    it("displays an error message and stays in edit mode when saving fails", async () => {
        const user = userEvent.setup();
        const expectedError = new Error(ERROR_MESSAGE_NETWORK);
        const mockOnChange = vi.fn().mockRejectedValue(expectedError);

        render(<AsyncEditField value={INITIAL_TEXT_VALUE} onChange={mockOnChange} />);

        await user.click(screen.getByTitle(BUTTON_TITLE_EDIT));
        await user.click(screen.getByTitle(BUTTON_TITLE_SAVE));

        expect(await screen.findByText(ERROR_MESSAGE_NETWORK)).toBeInTheDocument();
        expect(screen.getByRole(INPUT_ROLE_TEXTBOX)).toBeInTheDocument();
    });
});