import ReactCountryFlag from "react-country-flag";
import { Link, useFetcher } from "react-router";
import type { Country, Profile } from "../../api/supabaseClient";
import {MdBlock, MdDeleteOutline, MdLockOpen} from "react-icons/md";
import BlockPostModal from "./BlockPostModal";
import UnblockPostModal from "./UnblockPostModal";

export default function PostCard(props: {
    title: string;
    description: string;
    imageUrl: string;
    countries: Country[];
    link: string;
    profile: Profile;
    postId: number;
    isAdmin?: boolean;
    isBlocked?: boolean;
}) {

    // props for titel and description and image url and tags
    const { title, description, imageUrl, countries, link, profile, postId, isAdmin, isBlocked } = props;
    const fetcher = useFetcher();

    const openBlockModal = () => {
        const modal = document.getElementById(`block-modal-${postId}`) as HTMLDialogElement;
        if (modal) modal.showModal();
    };

    const openUnblockModal = () => {
        const modal = document.getElementById(`unblock-modal-${postId}`) as HTMLDialogElement;
        if (modal) modal.showModal();
    };

    return (
        <div className={`card lg:card-side card-sm bg-base-100 shadow-sm ${isBlocked ? 'opacity-70 grayscale' : ''}`}>
            <figure className="block w-full h-full">
                <img
                    src={imageUrl}
                    alt={title} />
            </figure>
            <div className="card-body">
                <div className="flex justify-between mb-2">
                    <Link to={link} className="card-title hover:underline">
                        {title} {isBlocked && <span className="text-error text-sm font-normal">(Gesperrt)</span>}
                    </Link>
                    <div className="flex gap-2 ml-2">

                        {/* Sperren Button & Modal (nur für Admins sichtbar) */}
                        {isAdmin && (
                            isBlocked ? (
                                <>
                                    <button
                                        type="button"
                                        aria-label="Freigeben"
                                        className="btn btn-square btn-success btn-sm"
                                        title="Freigeben"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            openUnblockModal();
                                        }}
                                    >
                                        <MdLockOpen size={16} />
                                    </button>
                                    <UnblockPostModal postId={postId} />
                                </>
                            ) : (
                                <>
                                    <button
                                        type="button"
                                        aria-label="Sperren"
                                        className="btn btn-square btn-warning btn-sm"
                                        title="Sperren"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            openBlockModal();
                                        }}
                                    >
                                        <MdBlock size={16} />
                                    </button>
                                    <BlockPostModal postId={postId} />
                                </>
                            )
                        )}
                        {/* Löschen Button (eigentlich nur für Postersteller sichtbar) */}
                        <fetcher.Form method="post" className="ml-2">
                            <input type="hidden" name="intent" value="delete-post" />
                            <input type="hidden" name="postId" value={String(postId)} />
                            <button
                                type="submit"
                                aria-label="Löschen"
                                className="btn btn-square btn-error btn-sm"
                                title="Löschen"
                                disabled={fetcher.state !== "idle"}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <MdDeleteOutline size={16} />
                            </button>
                        </fetcher.Form>
                    </div>
                </div>
                <p>{description}</p>
                <div className="card-actions justify-between items-center">
                    <p>@{profile.display_name}</p>
                    {countries.map((country) => (
                        <ReactCountryFlag key={country.code} countryCode={country.code} svg />
                    ))}
                </div>
            </div>
        </div>
    );
}
