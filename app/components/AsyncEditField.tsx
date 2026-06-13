/* 
Diese Komponente ist ein Textfeld mit einem Editbutton. 
Wenn der Button geclickt wird, wird das Textfeld editierbar. 
Wenn der Button wieder geclickt wird, wird die onChange Function gecalled mit dem neuen Wert. 
Im Fall, dass kein Error geworfen wird, wird das Textfeld wieder read-only.
*/

import { useState } from "react";
import { MdEdit, MdCheck } from "react-icons/md";

export default function AsyncEditField({
  value,
  onChange,
  className,
  onEditStateChange,
}: {
  value: string;
  onChange: (newValue: string) => Promise<void>;
  className?: string;
  onEditStateChange?: (isEditing: boolean) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleEditClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event?.preventDefault();
    if (!isEditing) {
      setError("");
      setIsEditing(true);
      onEditStateChange?.(true);
      return;
    }
    try {
      setIsSaving(true);
      setError("");
      await onChange(inputValue);
      setIsEditing(false);
      onEditStateChange?.(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Speichern der Änderungen ist fehlgeschlagen.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className || ""}`}>
      {!isEditing ? (
        <span>{inputValue}</span>
      ): (
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          readOnly={isSaving}
          className={`input ${error ? "input-error" : ""}`}
      />)}

      <button
        type="button"
        onClick={handleEditClick}
        className="btn btn-square btn-ghost btn-sm"
        title={isEditing ? "Änderungen speichern" : "Bearbeiten"}
        disabled={isSaving}
      >
        {isEditing ? <MdCheck size={16} /> : <MdEdit size={16} />}
      </button>

      {error && <div className="text-sm text-error">{error}</div>}
    </div>
  );
}
