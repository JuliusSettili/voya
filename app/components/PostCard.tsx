import ReactCountryFlag from "react-country-flag";
import { Link, useFetcher, useLocation } from "react-router";
import type { Country, Profile } from "../../api/supabaseClient";
import { MdBlock, MdDeleteOutline, MdLockOpen, MdLockOutline, MdPublic } from "react-icons/md";
import BlockPostModal from "./BlockPostModal";
import UnblockPostModal from "./UnblockPostModal";
import TogglePrivacyModal from "./TogglePrivacyModal";
import DeletePostModal from "~/components/DeletePostModal";

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
    isPrivate?: boolean;
}) {

    const { title, description, imageUrl, countries, link, profile, postId, isAdmin, isBlocked, isPrivate } = props;

    const location = useLocation();
    const isProfilePage = location.pathname.includes("/profile");

    const openBlockModal = () => {
        const modal = document.getElementById(`block-modal-${postId}`) as HTMLDialogElement;
        if (modal) modal.showModal();
    };

    const openUnblockModal = () => {
        const modal = document.getElementById(`unblock-modal-${postId}`) as HTMLDialogElement;
        if (modal) modal.showModal();
    };

    const openTogglePrivacyModal = () => {
        const modal = document.getElementById(`toggle-privacy-modal-${postId}`) as HTMLDialogElement;
        if (modal) modal.showModal();
    };

    const openDeleteModal = () => {
        const modal = document.getElementById(`delete-modal-${postId}`) as HTMLDialogElement;
        if (modal) modal.showModal();
    };

    return (
        <div className={`card lg:card-side card-sm bg-base-100 shadow-sm ${isBlocked ? 'opacity-70 grayscale' : ''}`}>
            <figure className="block lg:w-100 h-full">
                <img
                    src={imageUrl}
                    alt={title}
                    className="object-cover w-full h-80 lg:w-100"
                />
            </figure>
            <div className="card-body">
                <div className="flex justify-between mb-2">
                    <div className="flex items-center gap-2">
                        {/* Icon Logik: Nur auf Profilseite anzeigen */}
                        {isProfilePage && (
                            <>
                                <div
                                    className="tooltip tooltip-bottom flex items-center text-gray-500"
                                    data-tip={isPrivate ? "Ist privat (Klicken zum Ändern)" : "Ist öffentlich (Klicken zum Ändern)"}
                                >
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            openTogglePrivacyModal();
                                        }}
                                        className="hover:text-primary transition-colors cursor-pointer"
                                    >
                                        {isPrivate ? <MdLockOutline size={20} /> : <MdPublic size={20} />}
                                    </button>
                                </div>
                                <TogglePrivacyModal postId={postId} currentIsPrivate={!!isPrivate} />
                            </>
                        )}

                        <Link to={link} className="card-title hover:underline m-0">
                            {title} {isBlocked && <span className="text-error text-sm font-normal">(Gesperrt)</span>}
                        </Link>
                    </div>
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

                        {/* Löschen Button (nur bei Beiträgen auf eigener Profilseite sichtbar) */}
                        {isProfilePage && (
                            <div className="ml-2">
                                <button
                                    type="button"
                                    aria-label="Löschen"
                                    className="btn btn-square btn-error btn-sm"
                                    title="Löschen"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        openDeleteModal();
                                    }}
                                >
                                    <MdDeleteOutline size={16} />
                                </button>
                                <DeletePostModal postId={postId} />
                            </div>
                        )}
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
