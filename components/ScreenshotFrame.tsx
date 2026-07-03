import Image from "next/image";

export function ScreenshotFrame({
  src,
  alt,
  priority = false,
}: {
  src: string;
  alt: string;
  priority?: boolean;
}) {
  return (
    <figure className="screenshot-frame">
      <div className="screenshot-frame-chrome" aria-hidden>
        <span className="screenshot-frame-dot" />
        <span className="screenshot-frame-dot" />
        <span className="screenshot-frame-dot" />
      </div>
      <div className="screenshot-frame-body">
        <Image
          src={src}
          alt={alt}
          width={1200}
          height={750}
          className="screenshot-frame-image"
          priority={priority}
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
    </figure>
  );
}
