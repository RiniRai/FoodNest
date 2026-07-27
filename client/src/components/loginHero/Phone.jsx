import { motion } from "framer-motion";
import { phoneFloat, glowPulse } from "./animations";

export default function Phone() {
  return (
    <div className="relative flex items-center justify-center">
      {/* Glow */}
      <motion.div
       className="absolute h-[420px] w-[420px] rounded-full bg-orange-200/40 blur-[110px]"
      />

      {/* Phone */}
      <motion.div
        {...phoneFloat}
        className="relative z-10 h-[590px] w-[295px] rounded-[3rem] border-[5px] border-neutral-900 bg-neutral-900 overflow-hidden shadow-[0_70px_120px_rgba(0,0,0,.55)]"
      >
        {/* Dynamic Island */}
        <div className="absolute left-1/2 top-4 z-20 h-7 w-28 -translate-x-1/2 rounded-full bg-black" />

        {/* Screen */}
        <div className="absolute inset-[5px] overflow-hidden rounded-[2.55rem] bg-gradient-to-b from-orange-50 to-white">
          {/* Status */}
          <div className="flex items-center justify-between px-8 pt-4 text-xs font-semibold text-neutral-800">
            <span>9:41</span>

            <div className="flex gap-1">
              <div className="h-2 w-2 rounded-sm bg-neutral-800"></div>
              <div className="h-2 w-4 rounded-sm bg-neutral-800"></div>
              <div className="h-2 w-5 rounded-sm bg-neutral-800"></div>
            </div>
          </div>

          {/* Header */}
         <div className="px-6 pt-10">
            <p className="text-xs font-semibold uppercase tracking-wider text-orange-500">
              Deliver To
            </p>

            <h2 className="mt-1 text-lg font-bold text-neutral-900">
              Home · New Delhi
            </h2>

            {/* Search */}
           <div className="flex items-center gap-2 text-neutral-400">
    <span>🔍</span>
    <span>Search restaurants...</span>
</div>
          </div>

          {/* Categories */}
          <div className="mt-5 flex justify-around px-5">
            {["🍔", "🍕", "🍟", "☕"].map((emoji) => (
              <div
                key={emoji}
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-2xl shadow"
              >
                {emoji}
              </div>
            ))}
          </div>

          {/* Featured Card */}
          <div className="mx-5 mt-5 rounded-[30px] bg-gradient-to-r from-orange-500 to-red-500 p-5 text-white shadow-xl">
            <p className="text-xs font-semibold uppercase">
              Special Offer
            </p>

            <h3 className="mt-2 text-xl font-black">
              50% OFF
            </h3>

            <p className="text-sm opacity-90">
              On your first order
            </p>
          </div>

          {/* Restaurant Cards */}
          <div className="mt-5 space-y-4 px-6">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="flex items-center gap-4 rounded-2xl bg-white p-3 shadow"
              >
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br
from-orange-100
to-orange-300"></div>

                <div className="flex-1">
                  <div className="h-3 w-24 rounded-full bg-neutral-300"></div>

                  <div className="mt-2 h-2 w-16 rounded-full bg-neutral-200"></div>
                </div>

                <span className="text-xs font-bold text-orange-500">
                  20 min
                </span>
              </div>
            ))}
          </div>

          {/* Bottom Navigation */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-around border-t bg-white py-3">
            <span>🏠</span>
            <span>🔍</span>
            <span>❤️</span>
            <span>👤</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}