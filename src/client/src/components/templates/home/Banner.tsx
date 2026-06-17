import { useBannerStore } from "@/store/bannerStore";
import React, { useEffect } from "react";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const Banner: React.FC = () => {
  const { banners, getAllBanners } = useBannerStore();

  useEffect(() => {
    getAllBanners();
  }, [getAllBanners]);

  if (banners.length === 0) return null;

  return (
    <section>
      <div className="relative w-full max-w-480 mx-auto overflow-hidden banner-swiper-wrapper">
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop={banners.length > 1}
          speed={600}
          pagination={banners.length > 1 ? { clickable: true } : false}
          className="w-full"
        >
          {banners.map((slide, i) => (
            <SwiperSlide key={i}>
              <div className="relative min-h-150 md:min-h-144 flex items-center overflow-hidden">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/40 to-transparent" />

                <div className="relative z-10 w-full max-w-6xl mx-auto px-4 py-10">
                  <div className="max-w-xl">
                    <p className="text-white/75 text-base md:text-lg font-semibold mb-2">
                      {slide.description}
                    </p>
                    <h1 className="text-3xl md:text-5xl font-black text-white uppercase leading-tight tracking-tight mb-6">
                      {slide.title}
                    </h1>
                    <a
                      href={slide.link}
                      className="inline-flex items-center gap-2 bg-white text-[#0c59b6] font-bold text-sm px-6 py-2.5 rounded-full shadow hover:shadow-md hover:bg-gray-50 transition-all"
                    >
                      Shop Now
                      <span className="text-base leading-none">→</span>
                    </a>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <style>{`
        .banner-swiper-wrapper .swiper-pagination {
          bottom: 16px;
        }
        .banner-swiper-wrapper .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          background: rgba(255,255,255,0.4);
          opacity: 1;
          border-radius: 9999px;
          transition: all 0.3s;
          margin: 0 4px !important;
        }
        .banner-swiper-wrapper .swiper-pagination-bullet-active {
          width: 24px;
          background: #fff;
          border-radius: 9999px;
        }
      `}</style>
    </section>
  );
};

export default Banner;
