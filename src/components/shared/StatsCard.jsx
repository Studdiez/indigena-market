import React from "react";
import { motion } from "framer-motion";

export default function StatsCard({ title, value, subtitle, icon: Icon, color = "#B51D19", index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="rounded-2xl bg-[#242424] border border-[#333] p-5"
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: color + "20" }}
        >
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
      </div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-gray-500 mt-0.5">{title}</p>
      {subtitle && <p className="text-xs mt-2" style={{ color }}>{subtitle}</p>}
    </motion.div>
  );
}