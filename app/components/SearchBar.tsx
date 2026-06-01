import React, { useState } from 'react';

interface SearchBarProps {
    placeholder?: string;
}

export default function SearchBar({ placeholder = "Suchen..." }: SearchBarProps) {
    const [searchTerm, setSearchTerm] = useState("");

    return (
        <div className="w-full">
            <label className="input w-full">
                <input
                    type="text"
                    name="searchQuery"
                    className="grow"
                    placeholder={placeholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-5 h-5 opacity-70">
                    <path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" />
                </svg>
            </label>
        </div>
    );
}