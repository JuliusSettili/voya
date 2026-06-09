import { useFetcher } from "react-router";
import { useState } from "react";

export default function BlockPostModal({ postId }: { postId: number }) {
    const fetcher = useFetcher();
    const [errorMsg, setErrorMsg] = useState("");

    const closeModal = () => {
        const modal = document.getElementById(`block-modal-${postId}`) as HTMLDialogElement;
        if (modal) {
            modal.close();
            setErrorMsg(""); // Fehler beim Schließen zurücksetzen
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        const formData = new FormData(e.currentTarget);
        const reason = String(formData.get("reason") ?? "");

        if (reason.trim().length === 0) {
            e.preventDefault();
            setErrorMsg("Bitte gib eine gültige Begründung ein (nicht nur Leerzeichen).");
        } else {
            setErrorMsg("");
            closeModal();
        }
    };

    return (
        <dialog id={`block-modal-${postId}`} className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-box text-left">
                <h3 className="font-bold text-lg mb-4">Beitrag sperren</h3>

                <fetcher.Form method="post" action="." onSubmit={handleSubmit}>
                    <input type="hidden" name="intent" value="block-post" />
                    <input type="hidden" name="postId" value={String(postId)} />

                    <textarea
                        name="reason"
                        className={`textarea textarea-bordered w-full ${errorMsg ? 'textarea-error' : ''}`}
                        placeholder="Begründung eingeben..."
                        required
                    />

                    {errorMsg && (
                        <p className="text-red-500 text-sm mt-2">{errorMsg}</p>
                    )}

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