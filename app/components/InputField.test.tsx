import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, it, expect } from "vitest";
import InputField from "./InputField";

const LABEL_TEXT = "Benutzername";
const PLACEHOLDER_TEXT = "Bitte eingeben";
const ERROR_TEXT = "Dieses Feld ist ein Pflichtfeld.";
const CUSTOM_ID = "custom-input-id";

describe("InputField Component", () => {
    it("renders correctly with a label and input element", () => {
        render(<InputField label={LABEL_TEXT} />);

        expect(screen.getByLabelText(LABEL_TEXT)).toBeInTheDocument();
        expect(screen.getByRole("textbox")).toBeInTheDocument();
    });

    it("passes custom attributes to the native input element", () => {
        render(
            <InputField
                label={LABEL_TEXT}
                type="email"
                placeholder={PLACEHOLDER_TEXT}
                required={true}
            />
        );

        const input = screen.getByLabelText(LABEL_TEXT);
        expect(input).toHaveAttribute("type", "email");
        expect(input).toHaveAttribute("placeholder", PLACEHOLDER_TEXT);
        expect(input).toBeRequired();
    });

    it("generates a fallback id and links the label to the input if no id is provided", () => {
        render(<InputField label={LABEL_TEXT} />);

        const input = screen.getByLabelText(LABEL_TEXT);
        expect(input.id).toMatch(/^input-/);
    });

    it("uses the provided id if passed via props", () => {
        render(<InputField label={LABEL_TEXT} id={CUSTOM_ID} />);

        const input = screen.getByLabelText(LABEL_TEXT);
        expect(input.id).toBe(CUSTOM_ID);
    });

    it("renders an error message and sets correct ARIA attributes when error is provided", () => {
        render(<InputField label={LABEL_TEXT} error={ERROR_TEXT} />);

        const input = screen.getByLabelText(LABEL_TEXT);
        const errorMessage = screen.getByRole("alert");

        expect(errorMessage).toHaveTextContent(ERROR_TEXT);
        expect(input).toHaveAttribute("aria-invalid", "true");
        expect(input).toHaveAttribute("aria-describedby", errorMessage.id);
    });

    it("forwards the ref to the native input element", () => {
        const ref = React.createRef<HTMLInputElement>();
        render(<InputField label={LABEL_TEXT} ref={ref} />);

        expect(ref.current).toBeInstanceOf(HTMLInputElement);
        expect(ref.current).toBe(screen.getByLabelText(LABEL_TEXT));
    });
});