import { Layers2 } from "lucide-react";

export function Logo() {
  return (
    <div className="flex flex-row gap-[0.5em] items-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1.5em"
        height="1.5em"
        viewBox="0 0 24 24"
        fill="none"
        stroke="url(#gradient)"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        className="lucide lucide-layers2-icon lucide-layers-2"
      >
        <defs>
          <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(70.7% 0.165 254.624)" />
            <stop offset="35%" stopColor="oklch(79.2% 0.209 151.711)" />
            <stop offset="60%" stopColor="oklch(85.2% 0.199 91.936)" />
            <stop offset="90%" stopColor="oklch(70.4% 0.191 22.216)" />
          </linearGradient>
        </defs>
        <path d="M13 13.74a2 2 0 0 1-2 0L2.5 8.87a1 1 0 0 1 0-1.74L11 2.26a2 2 0 0 1 2 0l8.5 4.87a1 1 0 0 1 0 1.74z" />
        <path d="m20 14.285 1.5.845a1 1 0 0 1 0 1.74L13 21.74a2 2 0 0 1-2 0l-8.5-4.87a1 1 0 0 1 0-1.74l1.5-.845" />
      </svg>
      <span className="text-[1.1em] leading-none font-medium tracking-[0.075em]">
        Damareen
      </span>
    </div>
  );
}
