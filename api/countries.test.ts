import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchCountries, fetchCountriesForProfile } from "./countries";
import { getSupabaseClient } from "./supabaseClient";

vi.mock("./supabaseClient", () => ({
    getSupabaseClient: vi.fn(),
}));

const MOCK_PROFILE_ID = "user-123";
const MOCK_ERROR_MESSAGE = "Database error fetching countries";

const MOCK_COUNTRY_DE = { id: 1, name: "Germany", code: "DE" };
const MOCK_COUNTRY_FR = { id: 2, name: "France", code: "FR" };
const MOCK_COUNTRY_ES = { id: 3, name: "Spain", code: "ES" };

const MOCK_FLAT_COUNTRIES = [MOCK_COUNTRY_DE, MOCK_COUNTRY_FR];

const MOCK_NESTED_POST_DATA = [
    {
        post_country_relation: [
            { countries: MOCK_COUNTRY_DE },
            { countries: MOCK_COUNTRY_FR },
        ],
    },
    {
        post_country_relation: [
            { countries: MOCK_COUNTRY_ES },
        ],
    },
];

const EXPECTED_FLATTENED_COUNTRIES = [MOCK_COUNTRY_DE, MOCK_COUNTRY_FR, MOCK_COUNTRY_ES];

describe("Countries API Module", () => {
    let mockOrder: ReturnType<typeof vi.fn>;
    let mockEq: ReturnType<typeof vi.fn>;
    let mockSelect: ReturnType<typeof vi.fn>;
    let mockFrom: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        vi.clearAllMocks();

        mockOrder = vi.fn().mockResolvedValue({ data: null, error: null });
        mockEq = vi.fn().mockResolvedValue({ data: null, error: null });

        mockSelect = vi.fn().mockReturnValue({
            order: mockOrder,
            eq: mockEq,
        });

        mockFrom = vi.fn().mockReturnValue({
            select: mockSelect,
        });

        (getSupabaseClient as any).mockReturnValue({ from: mockFrom });
    });

    describe("fetchCountries()", () => {
        it("fetches and returns a flat list of all countries", async () => {
            mockOrder.mockResolvedValueOnce({ data: MOCK_FLAT_COUNTRIES, error: null });

            const result = await fetchCountries();

            expect(mockFrom).toHaveBeenCalledWith("countries");
            expect(mockSelect).toHaveBeenCalledWith("id, name, code");
            expect(mockOrder).toHaveBeenCalledWith("id", { ascending: true });
            expect(result).toEqual(MOCK_FLAT_COUNTRIES);
        });

        it("returns an empty array if data is null", async () => {
            mockOrder.mockResolvedValueOnce({ data: null, error: null });

            const result = await fetchCountries();

            expect(result).toEqual([]);
        });

        it("throws an error if the database query fails", async () => {
            mockOrder.mockResolvedValueOnce({ data: null, error: { message: MOCK_ERROR_MESSAGE } });

            await expect(fetchCountries()).rejects.toThrow(MOCK_ERROR_MESSAGE);
        });
    });

    describe("fetchCountriesForProfile()", () => {
        it("fetches, extracts, and flattens countries for a specific profile", async () => {
            mockEq.mockResolvedValueOnce({ data: MOCK_NESTED_POST_DATA, error: null });

            const result = await fetchCountriesForProfile(MOCK_PROFILE_ID);

            expect(mockFrom).toHaveBeenCalledWith("posts");
            expect(mockSelect).toHaveBeenCalledWith("post_country_relation(countries(id, name, code))");
            expect(mockEq).toHaveBeenCalledWith("user_id", MOCK_PROFILE_ID);
            expect(result).toEqual(EXPECTED_FLATTENED_COUNTRIES);
        });

        it("returns an empty array if no posts or countries are found", async () => {
            mockEq.mockResolvedValueOnce({ data: [], error: null });

            const result = await fetchCountriesForProfile(MOCK_PROFILE_ID);

            expect(result).toEqual([]);
        });

        it("throws an error if the nested database query fails", async () => {
            mockEq.mockResolvedValueOnce({ data: null, error: { message: MOCK_ERROR_MESSAGE } });

            await expect(fetchCountriesForProfile(MOCK_PROFILE_ID)).rejects.toThrow(MOCK_ERROR_MESSAGE);
        });
    });
});