export default function DeleteSubpostModal({
                                               subPostId,
                                               onConfirm
                                           }: {
    subPostId: number;
    onConfirm: () => void;
}) {
    const closeModal = () => {
        const modal = document.getElementById(`delete-subpost-modal-${subPostId}`) as HTMLDialogElement;
        if (modal) modal.close();
    };

    return (
        <dialog id={`delete-subpost-modal-${subPostId}`} className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-box text-left">
                <h3 className="font-bold text-lg mb-4 text-error">Subpost löschen</h3>

                <p className="mb-6">
                    Bist du sicher, dass du diesen Subpost inklusive aller Bilder <strong>unwiderruflich löschen</strong> möchtest?
                </p>

                <div className="modal-action">
                    <button type="button" className="btn" onClick={closeModal}>
                        Abbrechen
                    </button>
                    <button
                        type="button"
                        className="btn btn-error"
                        onClick={() => {
                            onConfirm();
                            closeModal();
                        }}
                    >
                        Löschen
                    </button>
                </div>
            </div>
        </dialog>
    );
}