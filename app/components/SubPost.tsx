import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { MdDeleteOutline, MdAdd } from "react-icons/md";
import { useState, type MouseEvent } from "react";
import type { SubPost as SubPostType, SubPostImage } from "../../api/supabaseClient";
import EditField from "./EditField";
import { addSubPostImage, deleteSubPostImage, getSubPostById, updateSubPost } from "../../api/subposts";
import { uploadPostImage } from "../../api/posts";
import DeleteImageModal from "./DeleteImageModal";

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
  const [subPostState, setSubPostState] = useState(subPost);

  const handleDelete = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete?.(subPost.id);
  };

  const handleEditTitle = (newTitle: string) => {
    updateSubPost(subPost.id, { title: newTitle });
    setSubPostState(prev => ({ ...prev, title: newTitle }));
  };

  const handleEditContent = (newContent: string) => {
    updateSubPost(subPost.id, { content: newContent });
    setSubPostState(prev => ({ ...prev, content: newContent }));
  }

  const handleDeleteSubPostImage = async (imageId: number) => {
    try {
      await deleteSubPostImage(imageId);
    } catch (error) {
      console.error("Failed to delete sub post image", error);
    } finally {
      const updatedSubPost = await getSubPostById(subPost.id);
      setSubPostState(updatedSubPost);
    }
  };

  const openDeleteImageModal = (imageId: number) => {
    const modal = document.getElementById(`delete-image-modal-${imageId}`) as HTMLDialogElement;
    if (modal) modal.showModal();
  };

  const handleEditImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);

    try {
      const uploadedImageUrl = await uploadPostImage(file);
      await addSubPostImage(subPost.id, uploadedImageUrl);
    } catch (error) {
      console.error("Failed to upload sub post image", error);
    } finally {
      setIsUploadingImage(false);
      const updatedSubPost = await getSubPostById(subPost.id);
      setSubPostState(updatedSubPost);
    }
  };

  const isTitleEmpty = !subPostState.title || subPostState.title.trim() === "";
  const isContentEmpty = !subPostState.content || subPostState.content.trim() === "";
  const hasNoImages = !subPostState.sub_post_images || subPostState.sub_post_images.length === 0;

  const isEmpty = isTitleEmpty && isContentEmpty && hasNoImages;

  // Wenn der Subpost komplett leer ist UND der Nutzer nicht der Besitzer ist -> Nichts rendern!
  if (isEmpty && !postBelongsToCurrentUser) {
    return null;
  }

  return (
    <details className={`collapse collapse-arrow bg-base-100 border border-base-300 ${containerClass}`} name="my-accordion-det-1">
      <summary className="collapse-title flex items-center justify-between gap-2 font-semibold">
        <div className="min-w-0 flex-1 truncate">
          {postBelongsToCurrentUser && (
            <EditField
              placeholderValue="Titel Subpost"
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
            placeholderValue="Beschreibung Subpost"
            value={subPostState.content}
            onChange={handleEditContent}
            className="mb-4"
          />
        )}
        {!postBelongsToCurrentUser && (
          <p className="mb-4">{subPostState.content}</p>
        )}
        <Swiper
          spaceBetween={10}
          slidesPerView={"auto"}
          navigation={true}
          modules={[Navigation]}
        >
          {subPostState.sub_post_images.map((image: SubPostImage) => (
              <SwiperSlide key={image.id} style={{ width: "auto" }}>
                <img className="h-50 relative" src={image.image_url} alt={`Sub post image ${image.id}`} />
                {postBelongsToCurrentUser && (
                    <>
                      <button
                          className="btn btn-sm btn-error btn-square absolute top-2 right-2"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            openDeleteImageModal(image.id);
                          }}
                      >
                        <MdDeleteOutline size={16} />
                      </button>
                      <DeleteImageModal
                          imageId={image.id}
                          onConfirm={() => handleDeleteSubPostImage(image.id)}
                      />
                    </>
                )}
              </SwiperSlide>
          ))}
          {postBelongsToCurrentUser && (
            <SwiperSlide>
              <div className="flex h-50 w-50 items-center justify-center">
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
      </div>
    </details>
  );
}
