import { useFetcher } from "react-router";

export default function UnblockPostModal({ postId }: { postId: number }) {
    const fetcher = useFetcher();

    const closeUnblockModal = () => {
        const modal = document.getElementById(`unblock-modal-${postId}`) as HTMLDialogElement;
        if (modal) modal.close();
    };

    return (
        <dialog id={`unblock-modal-${postId}`} className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-box text-left">
                <h3 className="font-bold text-lg mb-4">Beitrag freigeben</h3>
                <p className="py-2">Möchtest du diesen Beitrag wirklich wieder freigeben?</p>

                <fetcher.Form method="post" action="." onSubmit={closeUnblockModal}>
                    <input type="hidden" name="intent" value="unblock-post" />
                    <input type="hidden" name="postId" value={String(postId)} />

                    <div className="modal-action">
                        <button type="button" className="btn" onClick={closeUnblockModal}>
                            Abbrechen
                        </button>
                        <button
                            type="submit"
                            className="btn btn-success"
                            disabled={fetcher.state !== "idle"}
                        >
                            Ja, freigeben
                        </button>
                    </div>
                </fetcher.Form>
            </div>
        </dialog>
    );
}