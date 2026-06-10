// this component is a text field with a edit button. 
// if the button is cliecked, the text field becomes editable. 
// if the button is clicked again, the text field becomes read only again and the onChange function is called with the new value.

import { useState } from "react";
import { MdEdit, MdCheck } from "react-icons/md";

export default function EditField({
                                    value,
                                    placeholderValue,
                                    onChange,
                                    className,
}: {
  value: string;
  placeholderValue: string;
  onChange: (newValue: string) => void;
  className?: string;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [error, setError] = useState<string | null>(null);

  const handleEditClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event?.preventDefault();
    if (isEditing) {
      if (inputValue.trim() === "") {
        setError("Feld darf nicht leer sein!");
        return;
      }
      setError(null);
      onChange(inputValue);
    }
    setIsEditing(!isEditing);
  };

  return (
    <div className={`flex items-center gap-2 ${className || ""}`}>
      {!isEditing && (
          inputValue || <span className="text-gray-400 italic text-sm font-normal">{placeholderValue}</span>
      )}
      {isEditing && (
        <input
          type="text"
          placeholder={placeholderValue}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            if (error) setError(null);
          }}
          readOnly={!isEditing}
          className={`input input-bordered ${error ? "input-error" : ""}`}
      />)}
      <button
        type="button"
        onClick={handleEditClick}
        className="btn btn-square btn-ghost btn-sm"
        title={isEditing ? "Änderungen speichern" : "Bearbeiten"}
      >
        {isEditing ? <MdCheck size={16} /> : <MdEdit size={16} />}
      </button>
      {error && (
          <span className="text-error text-sm ml-2">
          {error}
        </span>
      )}
    </div>
  );
}
