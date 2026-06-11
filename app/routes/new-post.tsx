import { redirect, useFetcher } from "react-router";
import { MdFileUpload } from "react-icons/md";
import { useState } from "react";
import { createPost, uploadPostImage } from "../../api/posts";
import CountriesInput from "~/components/CountriesInput";
import type { Route } from "./+types/new-post";

type NewPostActionData = {
  errors?: {
    title?: string;
    description?: string;
    image?: string;
  };
};

export async function clientAction({
  request,
}: Route.ClientActionArgs) {
  const formData = await request.formData();
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const isPrivate = String(formData.get("is_private") ?? "true") === "true";
  const countryIds = formData
    .getAll("countryIds")
    .map((countryId: any) => Number(countryId))
    .filter((countryId: any) => Number.isFinite(countryId));

  if (!title) {
    return { errors: { title: "Bitte einen Titel eingeben." } };
  }

  if (!description) {
    return { errors: { description: "Bitte eine Beschreibung eingeben." } };
  }

  if (!String(formData.get("titleImageUrl") ?? "").trim()) {
    return { errors: { image: "Bitte ein Bild hochladen." } };
  }

  const createdPost = await createPost({
    title,
    description,
    titleImageUrl: String(formData.get("titleImageUrl") ?? "").trim(),
    countryIds,
    isPrivate,
  });

  return redirect(`/post/${createdPost.id}`);
}

export default function NewPost() {
  const [selectedCountryIds, setSelectedCountryIds] = useState<number[]>([]);
  const [titleImageUrl, setTitleImageUrl] = useState("");
  const [uploadedImageName, setUploadedImageName] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fetcher = useFetcher<typeof clientAction>();
  const actionData = fetcher.data as NewPostActionData | undefined;
  const errors = actionData?.errors;
  const isSubmitting = fetcher.state !== "idle";

  const handleTitleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setIsUploadingImage(true);
    setUploadError(null);

    try {
      const uploadedImageUrl = await uploadPostImage(file);
      setTitleImageUrl(uploadedImageUrl);
      setUploadedImageName(file.name);
    } catch (error) {
      setTitleImageUrl("");
      setUploadedImageName("");
      setUploadError(error instanceof Error ? error.message : "Bild konnte nicht hochgeladen werden.");
    } finally {
      setIsUploadingImage(false);
    }
  };

  return (
    <main className="mx-8 lg:mx-20 my-8">
      <fetcher.Form method="post" className="grid grid-cols-4 grid-rows-auto gap-6 [grid-template-areas:'image_image_image_image''details_details_details_details''countries_countries_countries_countries''description_description_description_description''actions_actions_actions_actions'] md:[grid-template-areas:'image_details_details_countries''description_description_description_description''actions_actions_actions_actions']">
        <div className="[grid-area:image]">
          <label
            htmlFor="title-image-upload"
            className="flex items-center justify-center h-48 border-2 border-dashed border-gray-300 rounded-md cursor-pointer"
          >
            <MdFileUpload className="h-12 w-12 text-gray-400" />
            Bild hochladen
          </label>
          <input
            type="file"
            className="hidden"
            id="title-image-upload"
            accept="image/*"
            onChange={handleTitleImageChange}
          />
          <input type="hidden" name="titleImageUrl" value={titleImageUrl} />
          {titleImageUrl ? <p className="mt-2 text-sm text-success">Bild hochgeladen: {uploadedImageName}</p> : null}
          {uploadError ? <p className="mt-2 text-sm text-error">{uploadError}</p> : null}
        </div>
        <div className="[grid-area:details]">
          <div className="mb-4">
            <input
              type="text"
              name="title"
              className="input w-full"
              placeholder="Gib deinem Beitrag einen Titel"
            />
          </div>
        </div>
        <div className="[grid-area:countries]">
          <CountriesInput value={selectedCountryIds} onChange={setSelectedCountryIds} />
          {selectedCountryIds.map((countryId) => (
            <input key={countryId} type="hidden" name="countryIds" value={String(countryId)} />
          ))}
        </div>
        <div className="[grid-area:description]">
          <textarea
            name="description"
            className="textarea w-full"
            placeholder="Beschreibe dein Reiseziel und deine Erfahrungen"
            rows={5}
          />
        </div>
        <div className="[grid-area:actions] flex justify-between">
          {errors ? (
            <p role="alert" className="text-sm text-error">
              {errors.title ?? errors.description ?? errors.image}
            </p>
          ) : null}
          <div className="flex">
            <div>
              <input type="radio" name="is_private" value="false" className="radio" />
              <label className="ml-2">Öffentlich</label>
            </div>
            <div className="ml-4">
              <input type="radio" name="is_private" value="true" className="radio" defaultChecked />
              <label className="ml-2">Privat</label>
            </div>
          </div>
          <button className="btn btn-primary" type="submit" disabled={isSubmitting || isUploadingImage || !titleImageUrl}>
            {isUploadingImage ? "Bild wird hochgeladen..." : "Beitrag erstellen"}
          </button>
        </div>
      </fetcher.Form>

    </main>
  );
}
