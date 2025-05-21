import { motion } from "framer-motion";
import React from "react";

interface BlurTextProps {
  text: string;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  colorFrom?: string;
  colorTo?: string;
  delay?: number;
}

/**
 * Animated text with a blur-in effect and gradient color.
 * Usage: <BlurText text="San Pablo LMS" />
 */
export const BlurText: React.FC<BlurTextProps> = ({
  text,
  className = "",
  as = "span",
  colorFrom = "#3b82f6", // azul
  colorTo = "#06b6d4",   // celeste
  delay = 0,
}) => {
  const Tag = as;
  return (
    <motion.span
      initial={{ filter: "blur(16px)", opacity: 0 }}
      animate={{ filter: "blur(0px)", opacity: 1 }}
      transition={{ duration: 1.2, ease: "easeOut", delay }}
      className={
        `inline-block bg-gradient-to-r from-[${colorFrom}] to-[${colorTo}] bg-clip-text text-transparent font-extrabold tracking-tight ` +
        className
      }
    >
      <Tag>{text}</Tag>
    </motion.span>
  );
};

export default BlurText;
