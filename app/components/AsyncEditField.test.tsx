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

    it("switches to edit mode, displays input field and calls onEditStateChange when edit button is clicked", async () => {
        const user = userEvent.setup();
        const mockOnChange = vi.fn().mockResolvedValue(undefined);
        const mockOnEditStateChange = vi.fn(); // NEU: Mock für die neue Prop

        render(<AsyncEditField value={INITIAL_TEXT_VALUE} onChange={mockOnChange} onEditStateChange={mockOnEditStateChange} />);

        const editButton = screen.getByTitle(BUTTON_TITLE_EDIT);
        await user.click(editButton);

        const inputField = screen.getByRole(INPUT_ROLE_TEXTBOX);
        expect(inputField).toBeInTheDocument();
        expect(inputField).toHaveValue(INITIAL_TEXT_VALUE);
        expect(screen.getByTitle(BUTTON_TITLE_SAVE)).toBeInTheDocument();

        expect(mockOnEditStateChange).toHaveBeenCalledWith(true);
    });

    it("saves the new value, calls onChange, closes edit mode and calls onEditStateChange on success", async () => {
        const user = userEvent.setup();
        const mockOnChange = vi.fn().mockResolvedValue(undefined);
        const mockOnEditStateChange = vi.fn(); // NEU

        render(<AsyncEditField value={INITIAL_TEXT_VALUE} onChange={mockOnChange} onEditStateChange={mockOnEditStateChange} />);

        await user.click(screen.getByTitle(BUTTON_TITLE_EDIT));

        const inputField = screen.getByRole(INPUT_ROLE_TEXTBOX);
        await user.clear(inputField);
        await user.type(inputField, UPDATED_TEXT_VALUE);

        await user.click(screen.getByTitle(BUTTON_TITLE_SAVE));

        expect(mockOnChange).toHaveBeenCalledWith(UPDATED_TEXT_VALUE);
        expect(mockOnChange).toHaveBeenCalledTimes(EXPECTED_API_CALL_COUNT_ON_SUCCESS);
        expect(screen.queryByRole(INPUT_ROLE_TEXTBOX)).not.toBeInTheDocument();

        expect(mockOnEditStateChange).toHaveBeenCalledWith(false);
    });

    it("displays an error message and stays in edit mode when saving fails", async () => {
        const user = userEvent.setup();
        const expectedError = new Error(ERROR_MESSAGE_NETWORK);
        const mockOnChange = vi.fn().mockRejectedValue(expectedError);
        const mockOnEditStateChange = vi.fn(); // NEU

        render(<AsyncEditField value={INITIAL_TEXT_VALUE} onChange={mockOnChange} onEditStateChange={mockOnEditStateChange} />);

        await user.click(screen.getByTitle(BUTTON_TITLE_EDIT));

        mockOnEditStateChange.mockClear();

        await user.click(screen.getByTitle(BUTTON_TITLE_SAVE));

        expect(await screen.findByText(ERROR_MESSAGE_NETWORK)).toBeInTheDocument();
        expect(screen.getByRole(INPUT_ROLE_TEXTBOX)).toBeInTheDocument();

        expect(mockOnEditStateChange).not.toHaveBeenCalledWith(false);
    });
});