// this component is a text field with a edit button. if the button is cliecked, the text field becomes editable. if the button is clicked again, the text field becomes read only again and the onChange function is called with the new value.

import { useState } from "react";
import { MdEdit, MdCheck } from "react-icons/md";

export default function EditField({
  value,
  onChange,
  className,
}: {
  value: string;
  onChange: (newValue: string) => void;
  className?: string;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  const handleEditClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event?.preventDefault();
    if (isEditing) {
      onChange(inputValue);
    }
    setIsEditing(!isEditing);
  };

  return (
    <div className={`flex items-center gap-2 ${className || ""}`}>
      {!isEditing && (
        inputValue
      )}
      {isEditing && (
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          readOnly={!isEditing}
          className="input"
      />)}
      <button
        type="button"
        onClick={handleEditClick}
        className="btn btn-square btn-ghost btn-sm"
        title={isEditing ? "Änderungen speichern" : "Bearbeiten"}
      >
        {isEditing ? <MdCheck size={16} /> : <MdEdit size={16} />}
      </button>
    </div>
  );
}
