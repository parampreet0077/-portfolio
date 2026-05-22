import { motion } from "framer-motion";

export default function Loader() {
  return (
    <motion.div
      className="fixed inset-0 z-[10000] grid place-items-center bg-[#0a0a0f]"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45 }}
    >
      <div className="text-center">
        <svg width="132" height="78" viewBox="0 0 132 78" className="mx-auto">
          <motion.text
            x="50%"
            y="56"
            textAnchor="middle"
            fontSize="56"
            fontWeight="800"
            fill="transparent"
            stroke="#06b6d4"
            strokeWidth="1.7"
            strokeDasharray="260"
            initial={{ strokeDashoffset: 260 }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 1.25, ease: "easeInOut" }}
          >
            PS
          </motion.text>
        </svg>
        <div className="relative mx-auto mt-5 h-1 w-44 overflow-hidden rounded-full bg-white/10">
          <div className="absolute inset-y-0 w-24 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500" style={{ animation: "shimmer 1.1s infinite" }} />
        </div>
      </div>
    </motion.div>
  );
}
