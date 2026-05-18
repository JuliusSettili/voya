import ReactCountryFlag from "react-country-flag";
import { Link } from "react-router";
import type { Country, Profile } from "../../api/supabaseClient";

export default function PostCard(props: {
    title: string;
    description: string;
    imageUrl: string;
    countries: Country[];
    link: string;
    profile: Profile;
}) {

    // props for titel and description and image url and tags
    const { title, description, imageUrl, countries, link, profile } = props;

    return (
        <Link to={link} className="card lg:card-side card-sm bg-base-100 shadow-sm">
            <figure>
                <img
                    src={imageUrl}
                    alt={title} />
            </figure>
            <div className="card-body">
                <h2 className="card-title">
                    {title}
                </h2>
                <p>{description}</p>
                <div className="card-actions justify-between items-center">
                    <Link to={`/user/${profile.id}`}>@{profile.display_name}</Link>
                    {countries.map((country) => (
                        <ReactCountryFlag key={country.code} countryCode={country.code} svg />
                    ))}
                </div>
            </div>
        </Link>
    )
}
