/* 
Diese Komponente nutzt die CountriesInput und stellt die ausgewählten Länder als Parameter zur Verfügung.
*/

import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import CountriesInput from "~/components/CountriesInput";

export default function FilterComponent() {
    const [searchParams] = useSearchParams();

    const urlCountryIds = searchParams.getAll("countryIds");

    const [selectedCountryIds, setSelectedCountryIds] = useState<number[]>(() =>
        urlCountryIds.map(id => Number(id))
    );

    useEffect(() => {
        setSelectedCountryIds(urlCountryIds.map(id => Number(id)));
    }, [searchParams]);

    return (
        <div className="w-full">
            <CountriesInput value={selectedCountryIds} onChange={setSelectedCountryIds} />

            {selectedCountryIds.map((countryId) => (
                <input
                    key={countryId}
                    type="hidden"
                    name="countryIds"
                    value={String(countryId)}
                />
            ))}
        </div>
    );
}