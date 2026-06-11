import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import EditField from "./EditField";

const INITIAL_TEXT_VALUE = "Startwert";
const UPDATED_TEXT_VALUE = "Geänderter Wert";
const PLACEHOLDER_TEXT = "Bitte Wert eingeben";
const EMPTY_INPUT_VALUE = "";

const ERROR_MESSAGE_EMPTY = "Feld darf nicht leer sein!";
const BUTTON_TITLE_EDIT = "Bearbeiten";
const BUTTON_TITLE_SAVE = "Änderungen speichern";
const INPUT_ROLE_TEXTBOX = "textbox";

const EXPECTED_CALL_COUNT_ON_SUCCESS = 1;
const EXPECTED_CALL_COUNT_ON_ERROR = 0;

describe("EditField Component", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders the initial value and edit button correctly", () => {
        const mockOnChange = vi.fn();

        render(
            <EditField
                value={INITIAL_TEXT_VALUE}
                placeholderValue={PLACEHOLDER_TEXT}
                onChange={mockOnChange}
            />
        );

        expect(screen.getByText(INITIAL_TEXT_VALUE)).toBeInTheDocument();
        expect(screen.getByTitle(BUTTON_TITLE_EDIT)).toBeInTheDocument();
    });

    it("renders the placeholder text when the initial value is empty", () => {
        const mockOnChange = vi.fn();

        render(
            <EditField
                value={EMPTY_INPUT_VALUE}
                placeholderValue={PLACEHOLDER_TEXT}
                onChange={mockOnChange}
            />
        );

        expect(screen.getByText(PLACEHOLDER_TEXT)).toBeInTheDocument();
    });

    it("switches to edit mode and displays input field when edit button is clicked", async () => {
        const user = userEvent.setup();
        const mockOnChange = vi.fn();
        render(
            <EditField
                value={INITIAL_TEXT_VALUE}
                placeholderValue={PLACEHOLDER_TEXT}
                onChange={mockOnChange}
            />
        );

        const editButton = screen.getByTitle(BUTTON_TITLE_EDIT);
        await user.click(editButton);

        const inputField = screen.getByRole(INPUT_ROLE_TEXTBOX);
        expect(inputField).toBeInTheDocument();
        expect(inputField).toHaveValue(INITIAL_TEXT_VALUE);
        expect(screen.getByTitle(BUTTON_TITLE_SAVE)).toBeInTheDocument();
    });

    it("saves the new value, calls onChange, and closes edit mode on success", async () => {
        const user = userEvent.setup();
        const mockOnChange = vi.fn();
        render(
            <EditField
                value={INITIAL_TEXT_VALUE}
                placeholderValue={PLACEHOLDER_TEXT}
                onChange={mockOnChange}
            />
        );

        await user.click(screen.getByTitle(BUTTON_TITLE_EDIT));

        const inputField = screen.getByRole(INPUT_ROLE_TEXTBOX);
        await user.clear(inputField);
        await user.type(inputField, UPDATED_TEXT_VALUE);

        await user.click(screen.getByTitle(BUTTON_TITLE_SAVE));

        expect(mockOnChange).toHaveBeenCalledWith(UPDATED_TEXT_VALUE);
        expect(mockOnChange).toHaveBeenCalledTimes(EXPECTED_CALL_COUNT_ON_SUCCESS);
        expect(screen.queryByRole(INPUT_ROLE_TEXTBOX)).not.toBeInTheDocument();
    });

    it("displays an error message and prevents saving when input is empty", async () => {
        const user = userEvent.setup();
        const mockOnChange = vi.fn();
        render(
            <EditField
                value={INITIAL_TEXT_VALUE}
                placeholderValue={PLACEHOLDER_TEXT}
                onChange={mockOnChange}
            />
        );

        await user.click(screen.getByTitle(BUTTON_TITLE_EDIT));

        const inputField = screen.getByRole(INPUT_ROLE_TEXTBOX);
        await user.clear(inputField);

        await user.click(screen.getByTitle(BUTTON_TITLE_SAVE));

        expect(screen.getByText(ERROR_MESSAGE_EMPTY)).toBeInTheDocument();
        expect(mockOnChange).toHaveBeenCalledTimes(EXPECTED_CALL_COUNT_ON_ERROR);
        expect(screen.getByRole(INPUT_ROLE_TEXTBOX)).toBeInTheDocument();
    });

    it("clears the error message as soon as the user starts typing again", async () => {
        const user = userEvent.setup();
        render(
            <EditField
                value={INITIAL_TEXT_VALUE}
                placeholderValue={PLACEHOLDER_TEXT}
                onChange={vi.fn()}
            />
        );

        await user.click(screen.getByTitle(BUTTON_TITLE_EDIT));
        const inputField = screen.getByRole(INPUT_ROLE_TEXTBOX);
        await user.clear(inputField);
        await user.click(screen.getByTitle(BUTTON_TITLE_SAVE));

        expect(screen.getByText(ERROR_MESSAGE_EMPTY)).toBeInTheDocument();

        await user.type(inputField, "A");

        expect(screen.queryByText(ERROR_MESSAGE_EMPTY)).not.toBeInTheDocument();
    });
});