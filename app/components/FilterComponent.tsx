import { useState } from 'react';
import CountriesInput from "~/components/CountriesInput";

export default function FilterComponent() {
    const [selectedCountryIds, setSelectedCountryIds] = useState<number[]>([]);

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