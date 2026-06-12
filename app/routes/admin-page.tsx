import { useState } from "react";
import { fetchProfiles, updateProfileRole, blockProfile, unblockProfile } from "../../api/profile";
import { fetchRoles } from "../../api/roles";
import type { Route } from "./+types/admin-page";
import { getSupabaseClient } from "../../api/supabaseClient";
import BlockUserModal from "~/modals/BlockUserModal";

export function meta({}: Route.MetaArgs) {
    return [{ title: "Admin Dashboard" }];
}

export async function clientLoader({}: Route.ClientLoaderArgs) {
    const supabase = getSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    const [profiles, roles] = await Promise.all([fetchProfiles(), fetchRoles()]);

    return { profiles, roles, currentUserId: user?.id };
}

export default function AdminPage({ loaderData: { profiles: initialProfiles, roles, currentUserId } }: Route.ComponentProps) {
    const [profiles, setProfiles] = useState(initialProfiles);
    const [searchQuery, setSearchQuery] = useState("");

    const handleBlockToggle = async (profileId: string, shouldBlock: boolean, reason?: string) => {
        if (shouldBlock) {
            await blockProfile(profileId, reason || '');
        } else {
            await unblockProfile(profileId);
        }
        const updatedProfiles = await fetchProfiles();
        setProfiles(updatedProfiles);
    };

    const handleRoleChange = async (profileId: string, roleId: string) => {
        await updateProfileRole(profileId, Number(roleId));
        const updatedProfiles = await fetchProfiles();
        setProfiles(updatedProfiles);
    };

    const filteredProfiles = profiles.filter((profile) =>
        profile.display_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <main className="p-8">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
                <p className="text-gray-500">Verwalte hier deine Nutzerkonten, Rollen und Zugriffsberechtigungen.</p>
            </div>

            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Suche nach Namen..."
                    className="input input-bordered w-full max-w-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="bg-base-100 border border-base-300 rounded-box overflow-x-auto shadow-sm">
                <table className="table">
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Username</th>
                        <th>E-Mail</th>
                        <th>Status</th>
                        <th>Rolle</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredProfiles.map((profile, index) => {
                        const blockReason = Array.isArray(profile.blocked_users)
                            ? profile.blocked_users[0]?.block_text
                            : profile.blocked_users?.block_text;

                        return (
                            <tr key={profile.id} className="hover">
                                <td>{index + 1}</td>
                                <td className="font-medium">{profile.display_name}</td>
                                <td>{profile.email}</td>
                                <td>
                                    <button
                                        disabled={profile.id === currentUserId}
                                        className={`btn btn-sm ${profile.blocked ? "btn-error" : "btn-success"} ${
                                            profile.id === currentUserId ? "opacity-50 cursor-not-allowed" : ""
                                        }`}
                                        onClick={() => (document.getElementById(`modal_${profile.id}`) as HTMLDialogElement)?.showModal()}
                                    >
                                        {profile.blocked ? "Gesperrt" : "Aktiv"}
                                    </button>

                                    <BlockUserModal
                                        profile={profile}
                                        blockReason={blockReason}
                                        onConfirm={handleBlockToggle}
                                    />
                                </td>
                                <td>
                                    <select
                                        defaultValue={profile.roles?.id}
                                        disabled={profile.id === currentUserId}
                                        className={`select select-bordered select-sm w-full max-w-[150px] ${
                                            profile.id === currentUserId ? "opacity-50 cursor-not-allowed" : ""
                                        }`}
                                        onChange={(e) => handleRoleChange(profile.id, e.target.value)}
                                    >
                                        {roles.map((role) => (
                                            <option key={role.id} value={role.id}>{role.name}</option>
                                        ))}
                                    </select>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        </main>
    );
}