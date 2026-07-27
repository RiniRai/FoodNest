import { motion } from "framer-motion";
import { foodFloat } from "./animations";

export default function FloatingFood({
  src,
  alt = "",
  style = {},
  size = 70,
  distance = 12,
  rotate = 5,
  duration = 7,
  delay = 0,
}) {
  return (
    <motion.div
      className="absolute"
      style={style}
      {...foodFloat({
        distance,
        rotate,
        duration,
        delay,
      })}
      whileHover={{
        scale: 1.08,
        rotate: rotate + 4,
      }}
      transition={{
        duration: 0.25,
      }}
    >
     <div
  className="
    flex
    items-center
    justify-center
    rounded-full
    bg-white/25
    backdrop-blur-2xl
    ring-1
    ring-white/50
    shadow-[0_25px_50px_rgba(0,0,0,.22)]
  "

        style={{
          width: size,
          height: size,
        }}
      >
        <img
          src={src}
          alt={alt}
          className="w-[80%] h-[80%] object-contain select-none pointer-events-none"
          draggable={false}
        />
      </div>
    </motion.div>
  );
}