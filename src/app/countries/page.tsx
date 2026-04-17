"use client";

import { useEffect, useState } from "react";
import { fetchCountries } from "../../../lib/countries";
import { Country } from "../../../lib/supabaseClient";

export default function CountriesPage() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadCountries = async () => {
      try {
        const data = await fetchCountries();
        if (isMounted) {
          setCountries(data);
        }
      } catch (err) {
        if (isMounted) {
          const message =
            err instanceof Error ? err.message : "Failed to fetch countries.";
          setError(message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadCountries();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return <main className="p-6">Loading countries...</main>;
  }

  if (error) {
    return <main className="p-6 text-red-600">Error: {error}</main>;
  }

  return (
    <main className="p-6">
      <h1 className="mb-4 text-2xl font-semibold">Countries</h1>
      {countries.length === 0 ? (
        <p>No countries found.</p>
      ) : (
        <ul className="list-disc pl-5">
          {countries.map((country) => (
            <li key={country.id}>{country.name}</li>
          ))}
        </ul>
      )}
    </main>
  );
}
