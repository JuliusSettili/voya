import { useFetcher } from "react-router";

export default function DeletePostModal({ postId }: { postId: number }) {
    const fetcher = useFetcher();

    const closeModal = () => {
        const modal = document.getElementById(`delete-modal-${postId}`) as HTMLDialogElement;
        if (modal) modal.close();
    };

    return (
        <dialog id={`delete-modal-${postId}`} className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-box text-left">
                <h3 className="font-bold text-lg mb-4 text-error">Beitrag löschen</h3>

                <p className="mb-4">
                    Bist du sicher, dass du diesen Beitrag <strong>unwiderruflich löschen</strong> möchtest?
                </p>

                <fetcher.Form method="post" action="." onSubmit={closeModal}>
                    <input type="hidden" name="intent" value="delete-post" />
                    <input type="hidden" name="postId" value={String(postId)} />

                    <div className="modal-action">
                        <button type="button" className="btn" onClick={closeModal}>
                            Abbrechen
                        </button>
                        <button
                            type="submit"
                            className="btn btn-error"
                            disabled={fetcher.state !== "idle"}
                        >
                            Löschen
                        </button>
                    </div>
                </fetcher.Form>
            </div>
        </dialog>
    );
}