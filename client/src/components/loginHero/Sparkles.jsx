import { motion } from "framer-motion";
import { sparkleFloat } from "./animations";

const blobs = [
  {
    top: "10%",
    left: "8%",
    size: 180,
    opacity: 0.14,
    delay: 0,
    duration: 12,
  },
  {
    top: "20%",
    right: "6%",
    size: 150,
    opacity: 0.12,
    delay: 2,
    duration: 14,
  },
  {
    bottom: "8%",
    left: "35%",
    size: 220,
    opacity: 0.16,
    delay: 1,
    duration: 16,
  },
];

const dots = [
  { top: "10%", left: "30%", delay: 0 },
  { top: "18%", left: "72%", delay: 1 },
  { top: "30%", left: "15%", delay: 2 },
  { top: "45%", left: "82%", delay: 0.8 },
  { top: "58%", left: "8%", delay: 2.8 },
  { top: "70%", left: "55%", delay: 1.5 },
  { top: "82%", left: "22%", delay: 3 },
  { top: "88%", left: "78%", delay: 1.8 },
];

export default function Sparkles() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Large Center Glow */}

      <div
        className="
        absolute
        left-1/2
        top-1/2
        -translate-x-1/2
        -translate-y-1/2
        h-[620px]
        w-[620px]
        rounded-full
        opacity-25
        blur-[140px]
      "
        style={{
          background:
            "radial-gradient(circle,#FDBA74 0%,rgba(251,146,60,.45) 35%,transparent 75%)",
        }}
      />

      {/* Floating Orange Blobs */}

      {blobs.map((blob, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full"
          style={{
            ...blob,

            background:
              "radial-gradient(circle,#FDBA74 0%,#FB923C 45%,transparent 80%)",

            filter: "blur(70px)",
          }}
          {...sparkleFloat({
            duration: blob.duration,
            delay: blob.delay,
          })}
        />
      ))}

      {/* Tiny Sparkles */}

      {dots.map((dot, index) => (
        <motion.div
          key={index}
          className="
            absolute
            h-1
            w-1
            rounded-full
            bg-white
            shadow-[0_0_8px_rgba(255,255,255,.45)]
          "
          style={{
            top: dot.top,
            left: dot.left,
          }}
          {...sparkleFloat({
            duration: 4 + index * 0.3,
            delay: dot.delay,
          })}
        />
      ))}
    </div>
  );
}