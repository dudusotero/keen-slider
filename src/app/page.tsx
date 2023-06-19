import SmartSwiper, { Slide } from "@/components/SmartSwiper";
import Image from "next/image";

const slides: {
  id: number;
  type: "image" | "video";
  src: string;
  thumbnail: string;
}[] = [
  {
    id: 1,
    type: "image",
    src: "https://images.unsplash.com/photo-1590004953392-5aba2e72269a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&h=500&w=800&q=80",
    thumbnail:
      "https://images.unsplash.com/photo-1590004953392-5aba2e72269a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&h=500&w=800&q=80",
  },
  {
    id: 2,
    type: "image",
    src: "https://images.unsplash.com/photo-1590004845575-cc18b13d1d0a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&h=500&w=800&q=80",
    thumbnail:
      "https://images.unsplash.com/photo-1590004845575-cc18b13d1d0a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&h=500&w=800&q=80",
  },
  {
    id: 3,
    type: "video",
    src: "https://www.youtube.com/embed/ZWijx_AgPiA?autoplay=1",
    thumbnail:
      "https://images.unsplash.com/photo-1590004987778-bece5c9adab6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&h=500&w=800&q=80",
  },
  {
    id: 4,
    type: "image",
    src: "https://images.unsplash.com/photo-1590005176489-db2e714711fc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&h=500&w=800&q=80",
    thumbnail:
      "https://images.unsplash.com/photo-1590005176489-db2e714711fc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&h=500&w=800&q=80",
  },
];

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <SmartSwiper thumbnails={slides}>
        {slides.map(({ id, src, type }) => (
          <Slide key={id}>
            {type === "image" && (
              <Image
                className="w-full h-full object-cover"
                src={src}
                width={800}
                height={500}
                alt=""
                priority
              />
            )}
            {type === "video" && (
              <iframe
                src={src}
                title="Creedence Clearwater Revival - Fortunate Son (Official Music Video)"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
          </Slide>
        ))}
      </SmartSwiper>
    </main>
  );
}
