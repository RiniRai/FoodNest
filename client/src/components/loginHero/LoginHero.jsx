import { motion } from "framer-motion";
import Phone from "./Phone";
import FloatingFood from "./FloatingFood";
import Sparkles from "./Sparkles";

import burger from "../../assets/login/burger.png";
import pizza from "../../assets/login/pizza.png";
import fries from "../../assets/login/fries.png";
import coffee from "../../assets/login/coffee.png";
import donut from "../../assets/login/donut.png";

import {
  fadeUp,
  staggerContainer,
  foodFloat,
} from "./animations";

export default function LoginHero() {
  return (
    <section className="relative flex min-h-screen w-full overflow-hidden pb-10 bg-gradient-to-br from-orange-500 via-orange-400 to-orange-600">

      {/* Background Glow */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at center, rgba(255,255,255,.18), transparent 65%)",
        }}
      />

      <Sparkles />

     <div className="relative z-20 flex w-full items-center justify-between px-14">

        {/* LEFT */}
        <div className="w-[42%] pb-12">

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .7 }}
            className="flex items-center gap-4 mt-2"
          >
            <div className="flex h-14 w-1 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md">
              🍔
            </div>

            <h1 className="text-4xl font-black text-white">
              FoodNest
            </h1>
          </motion.div>

          {/* Heading */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="mt-14"
          >
            <motion.h2
              variants={fadeUp}
              className="text-5xl xl:text-6xl  font-black leading-[1.08] text-white"
            >
              Delicious Food
              <br />
              Delivered Fast
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="mt-8 max-w-md text-lg leading-8 text-orange-100"
            >
              Discover amazing restaurants,
              order delicious meals,
              and enjoy lightning-fast delivery
              at your doorstep.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mt-10 flex gap-16"
            >
              <div>
                <h3 className="text-4xl font-black text-white">
                  ⭐ 4.9
                </h3>

                <p className="text-orange-100">
                  Customer Rating
                </p>
              </div>

              <div>
                <h3 className="text-4xl font-black text-white">
                  1000+
                </h3>

                <p className="text-orange-100">
                  Happy Customers
                </p>
              </div>

            </motion.div>

          </motion.div>

        </div>

        {/* RIGHT */}
        <div className="relative flex w-[55%] items-start justify-center -translate-y-8">

          <div className="relative z-20 -translate-y-4">
            <Phone />
          </div>

                    {/* Floating Burger */}
          <FloatingFood
            src={burger}
            alt="Burger"
            style={{
              top: "8%",
              right: "6%",
            }}
            size={72}
            {...foodFloat({
              distance: 14,
              rotate: 6,
              duration: 5,
            })}
          />

          {/* Pizza */}
          <FloatingFood
            src={pizza}
            alt="Pizza"
            style={{
              top: "12%",
              left: "8%",
            }}
            size={75}
            {...foodFloat({
              distance: 12,
              rotate: 5,
              duration: 6,
              delay: 0.5,
            })}
          />

          {/* Fries */}
          <FloatingFood
            src={fries}
            alt="Fries"
            style={{
              left: "4%",
              bottom: "18%",
            }}
            size={68}
            {...foodFloat({
              distance: 10,
              rotate: 5,
              duration: 5.5,
              delay: 1,
            })}
          />

          {/* Coffee */}
          <FloatingFood
            src={coffee}
            alt="Coffee"
            style={{
              right: "10%",
              bottom: "22%",
            }}
            size={68}
            {...foodFloat({
              distance: 12,
              rotate: 6,
              duration: 6,
              delay: 0.8,
            })}
          />

          {/* Donut */}
          <FloatingFood
            src={donut}
            alt="Donut"
            style={{
              bottom: "6%",
              left: "42%",
            }}
            size={65}
            {...foodFloat({
              distance: 10,
              rotate: 7,
              duration: 5.5,
              delay: 0.3,
            })}
          />

        </div>

      </div>

    </section>
  );
}