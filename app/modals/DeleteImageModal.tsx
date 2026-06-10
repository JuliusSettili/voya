export default function DeleteImageModal({
                                             imageId,
                                             onConfirm
                                         }: {
    imageId: number;
    onConfirm: () => void;
}) {
    const closeModal = () => {
        const modal = document.getElementById(`delete-image-modal-${imageId}`) as HTMLDialogElement;
        if (modal) modal.close();
    };

    return (
        <dialog id={`delete-image-modal-${imageId}`} className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-box text-left">
                <h3 className="font-bold text-lg mb-4 text-error">Bild löschen</h3>

                <p className="mb-6">
                    Bist du sicher, dass du dieses Bild <b>unwiderruflich aus dem Beitrag löschen</b> möchtest?
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