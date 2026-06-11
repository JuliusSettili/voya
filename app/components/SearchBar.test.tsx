import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import SearchBar from "./SearchBar";

const INPUT_ROLE = "textbox";
const DEFAULT_TYPE = "text";
const DEFAULT_NAME = "searchQuery";
const DEFAULT_CLASS = "input input-bordered w-full";

const CUSTOM_PLACEHOLDER = "Suchen...";
const CUSTOM_CLASS = "custom-search-class";
const TYPED_TEXT = "React";

describe("SearchBar Component", () => {
    it("renders correctly with default attributes", () => {
        render(<SearchBar />);

        const input = screen.getByRole(INPUT_ROLE);

        expect(input).toBeInTheDocument();
        expect(input).toHaveAttribute("type", DEFAULT_TYPE);
        expect(input).toHaveAttribute("name", DEFAULT_NAME);
        expect(input).toHaveAttribute("class", DEFAULT_CLASS);
    });

    it("applies custom attributes passed via props", () => {
        render(<SearchBar placeholder={CUSTOM_PLACEHOLDER} required={true} />);

        const input = screen.getByPlaceholderText(CUSTOM_PLACEHOLDER);

        expect(input).toBeInTheDocument();
        expect(input).toBeRequired();
    });

    it("overwrites the default className when a custom className is provided", () => {
        render(<SearchBar className={CUSTOM_CLASS} />);

        const input = screen.getByRole(INPUT_ROLE);

        expect(input).toHaveAttribute("class", CUSTOM_CLASS);
        expect(input).not.toHaveAttribute("class", DEFAULT_CLASS);
    });

    it("calls the onChange handler when the user types", async () => {
        const user = userEvent.setup();
        const mockOnChange = vi.fn();

        render(<SearchBar onChange={mockOnChange} />);

        const input = screen.getByRole(INPUT_ROLE);
        await user.type(input, TYPED_TEXT);

        expect(mockOnChange).toHaveBeenCalled();
        expect(input).toHaveValue(TYPED_TEXT);
    });
});