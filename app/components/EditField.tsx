/* 
Diese Componente ist ein Textfeld mit einem Editbutton. 
Wenn der Button geclickt wird, wird das Textfeld editierbar. 
Wenn der Button wieder geclickt wird, wird das Textfeld wieder read-only und die onChange Function wird mit dem neuen Wert gecalled. 
*/
import { useState } from "react";
import { MdEdit, MdCheck } from "react-icons/md";

export default function EditField({
  value,
  placeholderValue,
  isTextarea = false,
  onChange,
  className,
  onEditStateChange,
}: {
  value: string;
  placeholderValue: string;
  isTextarea?: boolean;
  onChange: (newValue: string) => void;
  className?: string;
  onEditStateChange?: (isEditing: boolean) => void;
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
      onEditStateChange?.(false);
    } else {
        onEditStateChange?.(true);
    }
    setIsEditing(!isEditing);
  };

  return (
    <div className={`flex items-center gap-2 ${className || ""}`}>
      {!isEditing && (
          inputValue || <span className="text-gray-400 italic text-sm font-normal">{placeholderValue}</span>
      )}
      {isEditing && (
        isTextarea ? (
          <textarea
            placeholder={placeholderValue}
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
            }}
            className={`w-full textarea textarea-bordered ${error ? "textarea-error" : ""}`}
          />
        ) : (
          <input
            type="text"
            placeholder={placeholderValue}
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
            if (error) setError(null);
          }}
          readOnly={!isEditing}
          className={`w-full input input-bordered ${error ? "input-error" : ""}`}
      />))}
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
