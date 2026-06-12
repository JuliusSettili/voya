export default function BlockUserModal({
                                           profile,
                                           blockReason,
                                           onConfirm
                                       }: {
    profile: any;
    blockReason?: string;
    onConfirm: (profileId: string, shouldBlock: boolean, reason?: string) => Promise<void>;
}) {
    return (
        <dialog id={`modal_${profile.id}`} className="modal">
            <div className="modal-box">
                <h3 className="font-bold text-lg mb-4">{profile.blocked ? "Nutzer entsperren" : "Nutzer sperren"}</h3>
                <p className="mb-4 text-sm text-gray-500">Betrifft: {profile.display_name}</p>

                <fieldset className="fieldset mb-6">
                    <legend className="fieldset-legend">Begründung:</legend>
                    {profile.blocked ? (
                        <input
                            type="text"
                            className="input input-bordered w-full"
                            defaultValue={blockReason || "Keine Angabe"}
                            disabled
                        />
                    ) : (
                        <input id={`reason_${profile.id}`} type="text" placeholder="Grund für Sperrung..." className="input input-bordered w-full" />
                    )}
                </fieldset>

                <div className="modal-action">
                    <form method="dialog" className="flex gap-2">
                        <button className="btn btn-ghost">Abbrechen</button>
                        <button
                            className={`btn ${profile.blocked ? "btn-success" : "btn-error"}`}
                            onClick={async () => {
                                const reason = (document.getElementById(`reason_${profile.id}`) as HTMLInputElement)?.value || '';
                                await onConfirm(profile.id, !profile.blocked, reason);
                            }}
                        >
                            Bestätigen
                        </button>
                    </form>
                </div>
            </div>
        </dialog>
    );
}