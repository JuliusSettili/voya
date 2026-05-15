import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

export function SubPost({ subPost, containerClass }: { subPost: any; containerClass: string }) {
  return (
    <details className={`collapse collapse-arrow bg-base-100 border border-base-300 ${containerClass}`} name="my-accordion-det-1">
      <summary className="collapse-title font-semibold">{subPost.title}</summary>
      <div className="collapse-content text-sm">
        <div className="mb-5">{subPost.content}</div>
        {subPost.sub_post_images.length == 1 ? (
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
            {subPost.sub_post_images.map((image: any) => (
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
