import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { MdDeleteOutline, MdAdd } from "react-icons/md";
import { useState, type MouseEvent } from "react";
import type { SubPost as SubPostType, SubPostImage } from "../../api/supabaseClient";
import EditField from "./EditField";
import { addSubPostImage, getSubPostById, updateSubPost } from "../../api/subposts";
import { uploadPostImage } from "../../api/posts";

export function SubPost({
  subPost,
  containerClass,
  onDelete,
  postBelongsToCurrentUser,
}: {
  subPost: SubPostType;
  containerClass: string;
  onDelete?: (id: number) => void;
  postBelongsToCurrentUser: boolean;
}) {
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
    const [subPostState, setSubPostState] = useState(subPost);

  const handleDelete = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete?.(subPost.id);
  };

  const handleEditTitle = (newTitle: string) => {
    updateSubPost(subPost.id, { title: newTitle });
  };

  const handleEditContent = (newContent: string) => {
    updateSubPost(subPost.id, { content: newContent });
  }

  const handleEditImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    setUploadError(null);

    try {
      const uploadedImageUrl = await uploadPostImage(file);
      await addSubPostImage(subPost.id, uploadedImageUrl);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Bild konnte nicht hochgeladen werden.");
    } finally {
      setIsUploadingImage(false);
      const updatedSubPost = await getSubPostById(subPost.id);
      setSubPostState(updatedSubPost);
    }
  };
  return (
    <details className={`collapse collapse-arrow bg-base-100 border border-base-300 ${containerClass}`} name="my-accordion-det-1">
      <summary className="collapse-title flex items-center justify-between gap-2 font-semibold">
        <div className="min-w-0 flex-1 truncate">
          {postBelongsToCurrentUser && (
            <EditField
              value={subPostState.title}
              onChange={handleEditTitle}
            />
          )}
          {!postBelongsToCurrentUser && (
            <span className="min-w-0 flex-1 truncate" title={subPostState.title}>
              {subPostState.title}
            </span>
          )}
        </div>
        {onDelete ? (
          <button
            type="button"
            onClick={handleDelete}
            aria-label="Löschen"
            className="btn btn-square btn-error btn-sm ml-2"
            title="Löschen"
          >
            <MdDeleteOutline size={16} />
          </button>
        ) : null}
      </summary>
      <div className="collapse-content text-sm">
        {postBelongsToCurrentUser && (
          <EditField
            value={subPostState.content}
            onChange={handleEditContent}
            className="mb-4"
          />
        )}
        {!postBelongsToCurrentUser && (
          <p className="mb-4">{subPostState.content}</p>
        )}
        {subPost.sub_post_images.length === 1 ? (
          <div className="flex gap-4">
            <div className="flex-1/2"><img src={subPostState.sub_post_images[0].image_url} alt={`Sub post image ${subPostState.sub_post_images[0].id}`} /></div>
            {postBelongsToCurrentUser && (
              <div className="flex-1/2 flex justify-center items-center">
                <label
                  htmlFor="title-image-upload"
                  className="btn btn-outline btn-secondary btn-sm"
                >
                  isUploadingImage ? (
                    <span className="loading loading-spinner"></span>
                  ) : (
                    <MdAdd size={16} />
                  )
                </label>
                <input
                  type="file"
                  className="hidden"
                  id="title-image-upload"
                  accept="image/*"
                  onChange={handleEditImage}
                />
              </div>)}
          </div>
        ) : (
          <Swiper
            spaceBetween={10}
            slidesPerView={1}
            navigation={true}
            modules={[Navigation]}
            breakpoints={{
              640: {
                slidesPerView: 2,
              },
              768: {
                slidesPerView: 3,
              },
            }}
          >
            {subPostState.sub_post_images.map((image: SubPostImage) => (
              <SwiperSlide key={image.id}>
                <img className="h-50" src={image.image_url} alt={`Sub post image ${image.id}`} />
              </SwiperSlide>
            ))}
            {postBelongsToCurrentUser && (
              <SwiperSlide>
                <div className="flex h-50 w-full items-center justify-center">
                  <label
                    htmlFor={`subpost-${subPostState.id}-image-upload`}
                    className="btn btn-outline btn-secondary btn-sm"
                  >
                    {isUploadingImage ? (
                      <span className="loading loading-spinner"></span>
                    ) : (
                      <MdAdd size={16} />
                    )}
                  </label>
                  <input
                    type="file"
                    className="hidden"
                    id={`subpost-${subPostState.id}-image-upload`}
                    accept="image/*"
                    onChange={handleEditImage}
                  />
                </div>
              </SwiperSlide>
            )}
          </Swiper>
        )}
      </div>
    </details>
  );
}
