import React from "react";
import { motion } from "framer-motion";

export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-20 px-6 text-center"
    >
      <div className="w-16 h-16 rounded-2xl bg-[#242424] border border-[#333] flex items-center justify-center mb-4">
        <Icon className="w-7 h-7 text-gray-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-300">{title}</h3>
      <p className="text-sm text-gray-500 mt-1 max-w-sm">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </motion.div>
  );
}