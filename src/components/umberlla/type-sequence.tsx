"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import * as React from "react";

export function TypeSequence({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });

  const container = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
      },
    },
  };

  const child = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.01 } },
  };

  return (
    <motion.span
      ref={ref}
      className={className}
      variants={container}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      style={{ display: "inline-block", whiteSpace: "pre-wrap" }}
      aria-label={text}
    >
      <span aria-hidden="true">
        {text.split("").map((char, index) => {
          if (char === " ") {
            return " ";
          }
          if (char === "\n") {
            return <br key={index} />;
          }
          return (
            <motion.span key={index} variants={child} style={{ display: "inline-block" }}>
              {char}
            </motion.span>
          );
        })}
      </span>
    </motion.span>
  );
}
