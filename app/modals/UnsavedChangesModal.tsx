export default function UnsavedChangesModal({
                                                isOpen,
                                                onProceed,
                                                onCancel,
                                            }: {
    isOpen: boolean;
    onProceed: () => void;
    onCancel: () => void;
}) {
    return (
        <dialog className={`modal ${isOpen ? "modal-open" : ""}`}>
            <div className="modal-box text-left">
                <h3 className="font-bold text-lg mb-4 text-warning">
                    Achtung: Ungespeicherte Änderungen!
                </h3>
                <p className="mb-4">
                    Du bist gerade im Bearbeitungsmodus. Willst du die Seite wirklich verlassen?
                </p>
                <div className="modal-action">
                    <button type="button" className="btn" onClick={onCancel}>
                        Hier bleiben
                    </button>
                    <button type="button" className="btn btn-error" onClick={onProceed}>
                        Verlassen
                    </button>
                </div>
            </div>
        </dialog>
    );
}