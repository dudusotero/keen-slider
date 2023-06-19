"use client";

import {
  useKeenSlider,
  type KeenSliderInstance,
  type KeenSliderPlugin,
} from "keen-slider/react";
import { useState, type MutableRefObject } from "react";

import "keen-slider/keen-slider.min.css";
import { cn } from "@/lib/utils";

function ThumbnailPlugin(
  mainRef: MutableRefObject<KeenSliderInstance | null>
): KeenSliderPlugin {
  return (slider) => {
    function removeActive() {
      slider.slides.forEach((slide) => {
        slide.classList.remove("border-dashed");
      });
    }
    function addActive(idx: number) {
      slider.slides[idx].classList.add("border-dashed");
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

export default function SmartSwiper() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    initial: 0,
    slides: {
      perView: 1,
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
        perView: 4,
        spacing: 16,
      },
    },
    [ThumbnailPlugin(instanceRef)]
  );

  return (
    <div className={cn("w-full invisible", loaded && "visible")}>
      <div ref={sliderRef} className="keen-slider relative rounded h-[400px]">
        <div className="keen-slider__slide bg-red-400 p-4 grid place-items-center">
          1
        </div>
        <div className="keen-slider__slide bg-green-400 p-4 grid place-items-center">
          2
        </div>
        <div className="keen-slider__slide bg-blue-400 p-4 grid place-items-center">
          3
        </div>
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
                  currentSlide === idx && "border-red-400"
                )}
              ></button>
            );
          })}
        </div>
      )}
      <div ref={thumbnailRef} className="keen-slider">
        <button className="keen-slider__slide appearance-none bg-red-400 p-4 rounded cursor-pointer border-2">
          1
        </button>
        <button className="keen-slider__slide appearance-none bg-green-400 p-4 rounded cursor-pointer border-2">
          2
        </button>
        <button className="keen-slider__slide appearance-none bg-blue-400 p-4 rounded cursor-pointer border-2">
          3
        </button>
      </div>
    </div>
  );
}
