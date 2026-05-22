import ReactCountryFlag from "react-country-flag";
import { Link, useFetcher } from "react-router";
import type { Country, Profile } from "../../api/supabaseClient";
import { MdDeleteOutline } from "react-icons/md";

export default function PostCard(props: {
    title: string;
    description: string;
    imageUrl: string;
    countries: Country[];
    link: string;
    profile: Profile;
    postId: number;
}) {

    // props for titel and description and image url and tags
    const { title, description, imageUrl, countries, link, profile, postId } = props;
    const fetcher = useFetcher();

    return (
        <div className="card lg:card-side card-sm bg-base-100 shadow-sm">
            <figure className="block w-full h-full">
                <img
                    src={imageUrl}
                    alt={title} />
            </figure>
            <div className="card-body">
                <div className="flex justify-between mb-2">
                    <Link to={link} className="card-title hover:underline">
                        {title}
                    </Link>
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
                <p>{description}</p>
                <div className="card-actions justify-between items-center">
                    <p>@{profile.display_name}</p>
                    {countries.map((country) => (
                        <ReactCountryFlag key={country.code} countryCode={country.code} svg />
                    ))}
                </div>
            </div>
        </div>
    )
}
