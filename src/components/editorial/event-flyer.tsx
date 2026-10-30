import Image from "next/image";
import { imageUrl } from "@/sanity/images";
import type { Event } from "@/sanity/types";
import { eventDate, eventTime } from "@/lib/event-format";
import { cn } from "@/lib/utils";
// Landscape flyer, or a branded stand-in until the flyer is uploaded.
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
  const src = imageUrl(event.flyer, 1600);
  return (
    <div
      className={cn(
        "@container relative aspect-[16/9] overflow-hidden bg-forest",
        className,
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={event.flyer?.alt || event.title}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover"
        />
      ) : (
        <div
          aria-hidden="true"
          className="absolute inset-0 flex flex-col justify-between p-[6%] text-white"
        >
          <span className="font-sans text-[clamp(0.625rem,2.2cqw,0.875rem)] font-semibold uppercase tracking-[0.16em] text-white font-stretch-expanded">
            OneGoodJune Events
          </span>
          <span className="line-clamp-3 max-w-[85%] font-heading text-[clamp(1.125rem,5.5cqw,2.75rem)] leading-[1.05] tracking-[-0.02em]">
            {event.title}
          </span>
          <span className="font-sans text-[clamp(0.6875rem,2.4cqw,1rem)] font-medium text-straw">
            {eventDate(event.startsAt)} · {eventTime(event.startsAt)} ·{" "}
            {event.location}
          </span>
        </div>
      )}
    </div>
  );
}
