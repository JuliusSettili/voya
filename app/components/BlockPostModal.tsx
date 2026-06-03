import { useFetcher } from "react-router";

export default function BlockPostModal({ postId }: { postId: number }) {
    const fetcher = useFetcher();

    const closeModal = () => {
        const modal = document.getElementById(`block-modal-${postId}`) as HTMLDialogElement;
        if (modal) modal.close();
    };

    return (
        <dialog id={`block-modal-${postId}`} className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-box text-left">
                <h3 className="font-bold text-lg mb-4">Beitrag sperren</h3>

                <fetcher.Form method="post" action="." onSubmit={closeModal}>
                    <input type="hidden" name="intent" value="block-post" />
                    <input type="hidden" name="postId" value={String(postId)} />

                    <textarea
                        name="reason"
                        className="textarea textarea-bordered w-full"
                        placeholder="Begründung eingeben..."
                        required
                    />

                    <div className="modal-action">
                        <button type="button" className="btn" onClick={closeModal}>
                            Abbrechen
                        </button>
                        <button
                            type="submit"
                            className="btn btn-warning"
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