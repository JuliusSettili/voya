import { useFetcher } from "react-router";

export default function TogglePrivacyModal({ postId, currentIsPrivate }: { postId: number, currentIsPrivate: boolean }) {
    const fetcher = useFetcher();

    const newStatus = !currentIsPrivate;
    const actionText = newStatus ? "privat" : "öffentlich";

    const closeModal = () => {
        const modal = document.getElementById(`toggle-privacy-modal-${postId}`) as HTMLDialogElement;
        if (modal) modal.close();
    };

    return (
        <dialog id={`toggle-privacy-modal-${postId}`} className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-box text-left">
                <h3 className="font-bold text-lg mb-4">Sichtbarkeit ändern</h3>

                <p className="mb-4">
                    Bist du sicher, dass du diesen Beitrag <strong>{actionText}</strong> machen möchtest?
                </p>

                <fetcher.Form method="post" action="." onSubmit={closeModal}>
                    <input type="hidden" name="intent" value="toggle-privacy" />
                    <input type="hidden" name="postId" value={String(postId)} />
                    <input type="hidden" name="isPrivate" value={String(newStatus)} />

                    <div className="modal-action">
                        <button type="button" className="btn" onClick={closeModal}>
                            Abbrechen
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={fetcher.state !== "idle"}
                        >
                            Bestätigen
                        </button>
                    </div>
                </fetcher.Form>
            </div>
        </dialog>
    );
}