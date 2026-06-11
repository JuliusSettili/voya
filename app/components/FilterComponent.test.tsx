import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import FilterComponent from "./FilterComponent";
import { useSearchParams } from "react-router";

vi.mock("react-router", () => ({
    useSearchParams: vi.fn(),
}));

// Isolierung der Komponente, da das echte CountriesInput API-Aufrufe enthält.
vi.mock("~/components/CountriesInput", () => ({
    default: ({ value, onChange }: { value: number[]; onChange: (v: number[]) => void }) => (
        <div data-testid="mock-countries-input">
            <span data-testid="mock-value">{value.join(",")}</span>
            <button
                data-testid="mock-change-button"
                onClick={() => onChange([3, 4])}
            >
                Simulate Change
            </button>
        </div>
    ),
}));

const COUNTRY_ID_GERMANY = 1;
const COUNTRY_ID_FRANCE = 2;
const UPDATED_COUNTRY_ID_1 = 3;
const UPDATED_COUNTRY_ID_2 = 4;

const URL_PARAM_NAME = "countryIds";
const HIDDEN_INPUT_NAME = "countryIds";

describe("FilterComponent", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders correctly with no initial URL parameters", () => {
        const mockSearchParams = new URLSearchParams();
        (useSearchParams as any).mockReturnValue([mockSearchParams]);

        render(<FilterComponent />);

        expect(screen.getByTestId("mock-value")).toHaveTextContent("");

        const hiddenInputs = document.querySelectorAll(`input[name="${HIDDEN_INPUT_NAME}"]`);
        expect(hiddenInputs.length).toBe(0);
    });

    it("initializes state and renders hidden inputs based on URL parameters", () => {
        const mockSearchParams = new URLSearchParams();
        mockSearchParams.append(URL_PARAM_NAME, String(COUNTRY_ID_GERMANY));
        mockSearchParams.append(URL_PARAM_NAME, String(COUNTRY_ID_FRANCE));
        (useSearchParams as any).mockReturnValue([mockSearchParams]);

        render(<FilterComponent />);

        expect(screen.getByTestId("mock-value")).toHaveTextContent(`${COUNTRY_ID_GERMANY},${COUNTRY_ID_FRANCE}`);

        const hiddenInputs = document.querySelectorAll<HTMLInputElement>(`input[name="${HIDDEN_INPUT_NAME}"]`);
        expect(hiddenInputs.length).toBe(2);
        expect(hiddenInputs[0].value).toBe(String(COUNTRY_ID_GERMANY));
        expect(hiddenInputs[1].value).toBe(String(COUNTRY_ID_FRANCE));
    });

    it("updates hidden inputs when CountriesInput triggers an onChange event", async () => {
        const user = userEvent.setup();
        const mockSearchParams = new URLSearchParams();
        (useSearchParams as any).mockReturnValue([mockSearchParams]);

        render(<FilterComponent />);

        const simulateChangeButton = screen.getByTestId("mock-change-button");
        await user.click(simulateChangeButton);

        expect(screen.getByTestId("mock-value")).toHaveTextContent(`${UPDATED_COUNTRY_ID_1},${UPDATED_COUNTRY_ID_2}`);

        const hiddenInputs = document.querySelectorAll<HTMLInputElement>(`input[name="${HIDDEN_INPUT_NAME}"]`);
        expect(hiddenInputs.length).toBe(2);
        expect(hiddenInputs[0].value).toBe(String(UPDATED_COUNTRY_ID_1));
        expect(hiddenInputs[1].value).toBe(String(UPDATED_COUNTRY_ID_2));
    });
});