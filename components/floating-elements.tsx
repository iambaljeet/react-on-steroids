"use client";

import { motion } from "framer-motion";
import { Code, Rocket, Smartphone, Zap } from "lucide-react";

export function FloatingElements() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute top-20 left-10 text-primary/20"
        animate={{
          y: [0, -20, 0],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Code className="w-16 h-16" />
      </motion.div>

      <motion.div
        className="absolute top-40 right-20 text-primary/20"
        animate={{
          y: [0, 20, 0],
          rotate: [0, -5, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      >
        <Rocket className="w-20 h-20" />
      </motion.div>

      <motion.div
        className="absolute bottom-40 left-1/4 text-primary/20"
        animate={{
          y: [0, -15, 0],
          x: [0, 10, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      >
        <Smartphone className="w-12 h-12" />
      </motion.div>

      <motion.div
        className="absolute bottom-20 right-1/3 text-primary/20"
        animate={{
          y: [0, 15, 0],
          rotate: [0, 10, 0],
        }}
        transition={{
          duration: 4.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5,
        }}
      >
        <Zap className="w-14 h-14" />
      </motion.div>

      {/* Gradient orbs */}
      <motion.div
        className="absolute top-1/4 -right-20 w-96 h-96 bg-gradient-to-br from-indigo-500/30 to-pink-500/30 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute bottom-1/4 -left-20 w-96 h-96 bg-gradient-to-br from-purple-500/30 to-blue-500/30 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />
    </div>
  );
}
