import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { MdDeleteOutline } from "react-icons/md";
import type { MouseEvent } from "react";
import type { SubPost as SubPostType, SubPostImage } from "../../api/supabaseClient";
import EditField from "./EditField";
import { updateSubPost } from "../../api/subposts";

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

  return (
    <details className={`collapse collapse-arrow bg-base-100 border border-base-300 ${containerClass}`} name="my-accordion-det-1">
      <summary className="collapse-title flex items-center justify-between gap-2 font-semibold">
        <div className="min-w-0 flex-1 truncate">
        {postBelongsToCurrentUser && (
          <EditField
            value={subPost.title}
            onChange={handleEditTitle}
          />
        )}
        {!postBelongsToCurrentUser && (
          <span className="min-w-0 flex-1 truncate" title={subPost.title}>
            {subPost.title}
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
            value={subPost.content}
            onChange={handleEditContent}
            className="mb-4"
          />
        )}
        {!postBelongsToCurrentUser && (
          <p className="mb-4">{subPost.content}</p>
        )}
        {subPost.sub_post_images.length === 1 ? (
          <img src={subPost.sub_post_images[0].image_url} alt={`Sub post image ${subPost.sub_post_images[0].id}`} />
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
            {subPost.sub_post_images.map((image: SubPostImage) => (
              <SwiperSlide key={image.id}>
                <img src={image.image_url} alt={`Sub post image ${image.id}`} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
        </div>
    </details>
  );
}
