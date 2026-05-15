import type { Route } from "./+types/post";
import { fetchPost } from "../../api/posts";
import { ReactCountryFlag } from "react-country-flag";
import { Link } from "react-router";

export async function clientLoader({
  params,
}: Route.ClientLoaderArgs) {
  return await fetchPost(params.id);
}

export default function CountriesPage({
  loaderData: post,
}: Route.ComponentProps) {

  return (
    <main className="p-6 grid grid-cols-4 gap-6 grid-rows-3 [grid-template-areas:'image_title_title_flags''description_description_description_description''content_content_content_content'] lg:[grid-template-areas:'title_flags_flags_image''description_description_description_image''content_content_content_image']">
      <img className="[grid-area:image]" src={post.title_image_url} alt={post.title} />
      <div className="[grid-area:title]">
        <h1 className="mb-1 text-2xl font-semibold ">{post.title}</h1>
        <Link to={`/user/${post.profiles.id}`} className="text-sm text-gray-600">@{post.profiles.display_name}</Link>
      </div>
      <div className="mr-3 [grid-area:flags] justify-self-end">
        {post.countries.map((country) => (
          <ReactCountryFlag countryCode={country.code} svg />
        ))}
      </div>
      <p className="[grid-area:description]">{post.description}</p>
      <div className="[grid-area:content]">
        Hier könnte weiterer Inhalt wie Kommentare, Reisetipps, etc. folgen
      </div>
    </main>
  );
}
