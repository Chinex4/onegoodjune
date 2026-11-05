import Image from "next/image";
import { imageSize, imageUrl } from "@/sanity/images";
import type { Event } from "@/sanity/types";
import { eventDates, eventTime } from "@/lib/event-format";
import { cn } from "@/lib/utils";
// Flyers carry their own text, so they keep their shape instead of being cropped
// to a frame. A branded stand-in shows until one is uploaded.
export function EventFlyer({
  event,
  sizes,
  className = "",
  priority = false,
}: {
  event: Event;
  sizes: string;
  className?: string;
  priority?: boolean;
}) {
  const src = imageUrl(event.flyer, 2400, 95);
  const size = imageSize(event.flyer);
  if (src && size)
    return (
      <Image
        src={src}
        alt={event.flyer?.alt || event.title}
        {...size}
        quality={95}
        priority={priority}
        sizes={sizes}
        className={cn("h-auto w-full", className)}
      />
    );
  return (
    <div
      className={cn(
        "@container relative aspect-[16/9] overflow-hidden bg-forest",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 flex flex-col justify-between p-[6%] text-white"
      >
        <span className="font-sans text-[clamp(0.625rem,2.2cqw,0.875rem)] font-semibold uppercase tracking-[0.16em] text-white font-stretch-expanded">
          ONEGOODJUNE Events
        </span>
        <span className="line-clamp-3 max-w-[85%] font-heading text-[clamp(1.125rem,5.5cqw,2.75rem)] leading-[1.05] tracking-[-0.02em]">
          {event.title}
        </span>
        <span className="font-sans text-[clamp(0.6875rem,2.4cqw,1rem)] font-medium text-straw">
          {eventDates(event)} · {eventTime(event.startsAt)} · {event.location}
        </span>
      </div>
    </div>
  );
}
