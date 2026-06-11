import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import CountriesInput from "./CountriesInput";
import { fetchCountries } from "../../api/countries";

// Mocking der API, um echte Netzwerkaufrufe zu verhindern und Tests deterministisch zu machen.
vi.mock("../../api/countries", () => ({
    fetchCountries: vi.fn(),
}));

const MOCK_COUNTRIES = [
    { id: 1, name: "Germany", code: "DE" },
    { id: 2, name: "France", code: "FR" },
    { id: 3, name: "Spain", code: "ES" },
];

const COUNTRY_ID_GERMANY = 1;
const COUNTRY_ID_FRANCE = 2;

const PLACEHOLDER_SEARCH = "Länder suchen...";
const MSG_MIN_CHARS = "Bitte mindestens 3 Zeichen eingeben.";
const MSG_NO_RESULTS = "Keine Länder gefunden.";

const SEARCH_INPUT_TOO_SHORT = "Ge";
const SEARCH_INPUT_VALID_MATCH = "Ger";
const SEARCH_INPUT_VALID_NO_MATCH = "Xyz";

const EXPECTED_API_CALL_COUNT = 1;

describe("CountriesInput Component", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (fetchCountries as any).mockResolvedValue(MOCK_COUNTRIES);
    });

    it("renders correctly and fetches initial countries", async () => {
        const mockOnChange = vi.fn();

        render(<CountriesInput value={[]} onChange={mockOnChange} />);

        expect(screen.getByPlaceholderText(PLACEHOLDER_SEARCH)).toBeInTheDocument();

        await waitFor(() => {
            expect(fetchCountries).toHaveBeenCalledTimes(EXPECTED_API_CALL_COUNT);
        });
    });

    it("displays initially selected countries based on the value prop", async () => {
        const mockOnChange = vi.fn();
        const initialValue = [COUNTRY_ID_GERMANY];

        render(<CountriesInput value={initialValue} onChange={mockOnChange} />);

        const germanyBadge = await screen.findByText("Germany");
        expect(germanyBadge).toBeInTheDocument();
        expect(screen.queryByPlaceholderText(PLACEHOLDER_SEARCH)).not.toBeInTheDocument();
    });

    it("shows a warning message if the search term is shorter than 3 characters", async () => {
        const user = userEvent.setup();
        render(<CountriesInput value={[]} onChange={vi.fn()} />);
        const inputField = screen.getByRole("textbox");

        await user.type(inputField, SEARCH_INPUT_TOO_SHORT);

        expect(await screen.findByText(MSG_MIN_CHARS)).toBeInTheDocument();
    });

    it("shows a not-found message if the search term yields no results", async () => {
        const user = userEvent.setup();
        render(<CountriesInput value={[]} onChange={vi.fn()} />);
        const inputField = screen.getByRole("textbox");

        await user.type(inputField, SEARCH_INPUT_VALID_NO_MATCH);

        expect(await screen.findByText(MSG_NO_RESULTS)).toBeInTheDocument();
    });

    it("filters the country list and calls onChange when a new country is selected", async () => {
        const user = userEvent.setup();
        const mockOnChange = vi.fn();
        render(<CountriesInput value={[]} onChange={mockOnChange} />);
        const inputField = screen.getByRole("textbox");

        await user.type(inputField, SEARCH_INPUT_VALID_MATCH);

        const germanyResultButton = await screen.findByText("Germany");
        await user.click(germanyResultButton);

        expect(mockOnChange).toHaveBeenCalledWith([COUNTRY_ID_GERMANY]);
        expect(mockOnChange).toHaveBeenCalledTimes(1);
        expect(inputField).toHaveValue("");
    });

    it("calls onChange removing the country ID when an already selected country is removed", async () => {
        const user = userEvent.setup();
        const mockOnChange = vi.fn();
        const initialValue = [COUNTRY_ID_GERMANY, COUNTRY_ID_FRANCE];
        render(<CountriesInput value={initialValue} onChange={mockOnChange} />);

        const removeGermanyButton = await screen.findByTitle("Germany entfernen");
        await user.click(removeGermanyButton);

        expect(mockOnChange).toHaveBeenCalledWith([COUNTRY_ID_FRANCE]);
    });
});