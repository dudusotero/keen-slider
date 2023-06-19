"use client";

import {
  useKeenSlider,
  type KeenSliderInstance,
  type KeenSliderPlugin,
} from "keen-slider/react";
import {
  useState,
  type MutableRefObject,
  forwardRef,
  type HTMLAttributes,
} from "react";
import Image from "next/image";

import "keen-slider/keen-slider.min.css";
import { cn } from "@/lib/utils";

function ThumbnailPlugin(
  mainRef: MutableRefObject<KeenSliderInstance | null>
): KeenSliderPlugin {
  return (slider) => {
    function removeActive() {
      slider.slides.forEach((slide) => {
        slide.classList.remove("border-red-400");
      });
    }
    function addActive(idx: number) {
      slider.slides[idx].classList.add("border-red-400");
    }

    function addClickEvents() {
      slider.slides.forEach((slide, idx) => {
        slide.addEventListener("click", () => {
          if (mainRef.current) mainRef.current.moveToIdx(idx);
        });
      });
    }

    slider.on("created", () => {
      if (!mainRef.current) return;
      addActive(slider.track.details.rel);
      addClickEvents();
      mainRef.current.on("animationStarted", (main) => {
        removeActive();
        const next = main.animator.targetIdx || 0;
        addActive(main.track.absToRel(next));
        slider.moveToIdx(Math.min(slider.track.details.maxIdx, next));
      });
    });
  };
}

type Props = {
  children: React.ReactNode;
  thumbnails: {
    id: number;
    type: "image" | "video";
    thumbnail: string;
  }[];
};

export default function SmartSwiper({ children, thumbnails }: Props) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    initial: 0,
    slides: {
      perView: 1,
      spacing: 16,
    },
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    created() {
      setLoaded(true);
    },
  });
  const [thumbnailRef] = useKeenSlider<HTMLDivElement>(
    {
      initial: 0,
      slides: {
        perView: 8,
        spacing: 16,
      },
    },
    [ThumbnailPlugin(instanceRef)]
  );

  return (
    <div className={cn("w-full invisible", loaded && "visible")}>
      <div ref={sliderRef} className="keen-slider relative rounded h-[500px]">
        {children}
        {loaded && instanceRef.current && (
          <>
            <button
              className="absolute top-1/2 left-4 transform -translate-y-1/2 disabled:opacity-50 border-2 border-gray-400 rounded px-2 py-1 bg-gray-200"
              onClick={(e) => instanceRef.current?.prev()}
              disabled={currentSlide === 0}
            >
              Prev
            </button>

            <button
              className="absolute top-1/2 right-4 transform -translate-y-1/2 disabled:opacity-50 border-2 border-gray-400 rounded px-2 py-1 bg-gray-200"
              onClick={(e) => instanceRef.current?.next()}
              disabled={
                currentSlide ===
                instanceRef.current.track.details.slides.length - 1
              }
            >
              Next
            </button>
          </>
        )}
      </div>
      {loaded && instanceRef.current && (
        <div className="flex gap-2 justify-center my-2">
          {[
            ...Array.from(
              Array(instanceRef.current.track.details.slides.length).keys()
            ),
          ].map((idx) => {
            return (
              <button
                key={idx}
                onClick={() => {
                  instanceRef.current?.moveToIdx(idx);
                }}
                className={cn(
                  "w-4 h-4 rounded-full bg-gray-400 border-2 border-gray-400",
                  currentSlide === idx && "bg-red-400 border-red-400"
                )}
              ></button>
            );
          })}
        </div>
      )}
      <div ref={thumbnailRef} className="keen-slider h-[100px]">
        {thumbnails.map(({ id, thumbnail, type }) => (
          <ThumbnailSlide key={id} className="relative">
            <Image
              className="w-full h-full object-cover"
              src={thumbnail}
              width={100}
              height={100}
              alt=""
            />
            {type === "video" && (
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
              </div>
            )}
          </ThumbnailSlide>
        ))}
      </div>
    </div>
  );
}

export const Slide = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ children, className }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("keen-slider__slide", "bg-red-400 rounded", className)}
      >
        {children}
      </div>
    );
  }
);
Slide.displayName = "Slide";

const ThumbnailSlide = forwardRef<
  HTMLButtonElement,
  HTMLAttributes<HTMLButtonElement>
>(({ children, className }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "keen-slider__slide",
        "bg-red-400 rounded cursor-pointer border-2 border-solid",
        className
      )}
    >
      {children}
    </button>
  );
});
ThumbnailSlide.displayName = "Thumbnail";
