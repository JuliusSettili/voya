import type { index } from "@react-router/dev/routes";
import { fetchProfiles, assignRoleToProfile, blockProfile, unblockProfile } from "../../api/profiles";
import type { Route } from "./+types/nutzerverwaltung";
import { fetchRoles } from "../../api/roles";
import { useState } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Admin Dashboard" },
    { name: "description", content: "Admin dashboard" },
  ];
}

export async function clientLoader({}: Route.ClientLoaderArgs) {
  const [profiles, roles] = await Promise.all([fetchProfiles(), fetchRoles()]);
  return { profiles, roles };
}

export default function AdminPage({
  loaderData: { profiles: initialProfiles, roles },
}: Route.ComponentProps) {
  const [profiles, setProfiles] = useState(initialProfiles);

  const handleBlockToggle = async (profileId: string, shouldBlock: boolean, reason?: string) => {
    if (shouldBlock) {
      await blockProfile(profileId, reason || '');
    } else {
      await unblockProfile(profileId);
    }
    // Refetch profiles to update the table
    const updatedProfiles = await fetchProfiles();
    setProfiles(updatedProfiles);
  };

  const handleRoleChange = async (profileId: string, roleId: string) => {
    await assignRoleToProfile(profileId, roleId);
    // Refetch profiles to update the table
    const updatedProfiles = await fetchProfiles();
    setProfiles(updatedProfiles);
  };

  return (
    <main className="p-6">
      <h1 className="text-4xl font-bold mb-4">Admin Dashboard</h1>
      <div className="overflow-x-auto">
        <table className="table table-zebra">
            <thead>
            <tr>
                <th>#</th>
                <th>Username</th>
                <th>E-Mail</th>
                <th>Status</th>
                <th>Role</th>
            </tr>
            </thead>
            <tbody>
            {profiles.map((profile, index) => (
                <tr key={profile.id}>
                    <td>{index + 1}</td>
                    <td>{profile.display_name}</td>
                    <td>{profile.email}</td>
                    <td>
                      <button className={`btn ${profile.blocked ? "bg-red-600" : "bg-green-600"}`} onClick={()=>document.getElementById(`mask_for_blocking_${index}`)?.showModal()}>{profile.blocked ? "Blocked" : "Active" }</button>
                      <dialog id={`mask_for_blocking_${index}`} className="modal">
                        <div className="modal-box">
                          <h3 className="font-bold text-lg">{profile.blocked ? "Unblock User" : "Block User"} {profile.display_name}</h3>
                          <fieldset className="fieldset">
                            <legend className="fieldset-legend">Reason:</legend>
                            {profile.blocked ? (
                            <input
                              type="text"
                              placeholder={profile.blocked_users?.block_text || "No reason provided"}
                              className="input"
                              disabled
                            />) : (
                            <input
                              id={`block_reason_input_${index}`}
                              type="text"
                              placeholder="Enter block reason"
                              className="input-lg" 
                            />)}
                          </fieldset>
                          <div className="modal-action">
                            <form method="dialog">
                              <button type="button" className="btn bg-green-500" onClick={async () => {
                                const reason = (document.querySelector(`#block_reason_input_${index}`) as HTMLInputElement)?.value || '';
                                await handleBlockToggle(profile.id, !profile.blocked, reason);
                                document.getElementById(`mask_for_blocking_${index}`)?.close();
                              }}>Submit</button>
                              <button className="btn bg-red-500">Close</button>
                            </form>
                          </div>
                        </div>
                      </dialog>
                    </td>
                    <td>
                      <select defaultValue={profile.roles?.id} className="select" onChange={(e) => handleRoleChange(profile.id, e.target.value)}>
                        {roles.map((role) => (
                          <option key={role.id} value={role.id}>
                            {role.name}
                          </option>
                        ))}
                      </select>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
    </main>
  );
}