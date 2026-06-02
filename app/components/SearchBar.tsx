import React, {type ComponentPropsWithoutRef} from 'react';

interface SearchBarProps extends ComponentPropsWithoutRef<"input">{
}

export default function SearchBar({ ...props }: SearchBarProps) {
    return (
        <input
            type="text"
            name="searchQuery"
            className="input input-bordered w-full"
            {...props}
        />
    );
}