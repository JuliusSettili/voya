import { useEffect, useMemo, useState } from "react";
import ReactCountryFlag from "react-country-flag";
import { fetchCountries } from "../../api/countries";
import type { Country } from "../../api/supabaseClient";

type CountriesInputProps = {
  value: number[];
  onChange: (countryIds: number[]) => void;
};

export default function CountriesInput({ value, onChange }: CountriesInputProps) {
  const [countries, setCountries] = useState<Country[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadCountries = async () => {
      const data = await fetchCountries();
      if (isMounted) {
        setCountries(data);
      }
    };

    loadCountries();

    return () => {
      isMounted = false;
    };
  }, []);

  const toggleCountry = (countryId: number) => {
    onChange(
      value.includes(countryId)
        ? value.filter((id) => id !== countryId)
        : [...value, countryId],
    );
  };

  const selectedCountries = countries.filter((country) => value.includes(country.id));

  const filteredCountries = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (query.length < 3) {
      return [];
    }

    if (!query) {
      return countries;
    }

    return countries.filter((country) => country.name.toLowerCase().includes(query));
  }, [countries, search]);

  return (
    <div className="space-y-3">
      {selectedCountries.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {selectedCountries.map((country) => (
            <button
              key={country.id}
              type="button"
              onClick={() => toggleCountry(country.id)}
              className="badge badge-primary badge-lg flex items-center gap-2"
              aria-pressed="true"
            >
              <ReactCountryFlag countryCode={country.code} svg />
              <span>{country.name}</span>
            </button>
          ))}
        </div>
      ) : null}

      <input
        type="text"
        className="input input-bordered w-full"
        placeholder="Länder suchen..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      <div className="flex flex-wrap gap-2">
        {search.trim().length < 3 ? (
          <p className="text-sm text-base-content/60">Bitte mindestens 3 Zeichen eingeben.</p>
        ) : filteredCountries.length === 0 ? (
          <p className="text-sm text-base-content/60">Keine Länder gefunden.</p>
        ) : (
          filteredCountries.map((country) => {
        const selected = value.includes(country.id);

        return (
          <button
            key={country.id}
            type="button"
            onClick={() => toggleCountry(country.id)}
            className={`badge badge-lg flex items-center gap-2 ${selected ? "badge-primary" : "badge-outline"}`}
            aria-pressed={selected}
          >
            <ReactCountryFlag countryCode={country.code} svg />
            <span>{country.name}</span>
          </button>
        );
          })
        )}
      </div>
    </div>
  );
}
