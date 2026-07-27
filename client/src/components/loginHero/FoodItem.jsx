import { motion } from 'framer-motion';
import { easeLux } from './animations';

/**
 * A floating food item.
 * - Outer motion.div: one-shot entrance (fade + scale in).
 * - Inner motion.div: the continuous luxury float loop from `animation`.
 * Keeping entrance and loop on separate layers means the loop never restarts
 * when the entrance finishes, and the loop's own delay staggers the items.
 */
export default function FoodItem({ animation, className = '', children }) {
  const delay = animation?.transition?.delay ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.82 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.9, ease: easeLux, delay }}
      className={`absolute ${className}`}
    >
      <motion.div
        animate={animation}
        style={{ willChange: 'transform' }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
