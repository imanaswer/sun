"use client";

import * as React from "react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type SplitBy = "characters" | "words";
type ScrollPosition = "top top" | "top center" | "top bottom" | "center top" | "center center" | "center bottom" | "bottom top" | "bottom center" | "bottom bottom";

export type ScrollHighlightProps = {
    text: string;
    dimColor?: string;
    highlightColor?: string;
    splitBy?: SplitBy;
    scrollStart?: ScrollPosition;
    scrollEnd?: ScrollPosition;
    scrub?: boolean;
    className?: string;
};

const CHAR_STAGGER = 0.03;
const WORD_STAGGER = 0.1;

export default function ScrollHighlight({
    text,
    dimColor = "rgba(255, 255, 255, 0.15)",
    highlightColor = "#FFFFFF",
    splitBy = "words",
    scrollStart = "top center",
    scrollEnd = "bottom center",
    scrub = true,
    className = "",
}: ScrollHighlightProps) {
    const containerRef = useRef<HTMLParagraphElement>(null);
    const words = text.trim().split(/\s+/).filter(Boolean);
    const chars = Array.from(text);
    const stagger = splitBy === "characters" ? CHAR_STAGGER : WORD_STAGGER;

    useEffect(() => {
        const paragraph = containerRef.current;
        if (!paragraph) return;

        const targets = paragraph.querySelectorAll(
            splitBy === "characters" ? ".char" : ".word"
        );

        const ctx = gsap.context(() => {
            gsap.set(targets, {
                color: dimColor,
            });

            gsap.to(targets, {
                color: highlightColor,
                stagger,
                scrollTrigger: {
                    trigger: paragraph,
                    start: scrollStart,
                    end: scrollEnd,
                    scrub,
                },
            });
        }, paragraph);

        return () => ctx.revert();
    }, [
        text,
        dimColor,
        highlightColor,
        splitBy,
        stagger,
        scrollStart,
        scrollEnd,
        scrub,
    ]);

    return (
        <p
            ref={containerRef}
            className={className}
            style={{
                display: "inline-block",
                whiteSpace: "pre-wrap",
                color: dimColor,
            }}
        >
            {splitBy === "characters"
                ? chars.map((char, index) => (
                      <span
                          key={`${char}-${index}`}
                          className="char"
                          style={{
                              display: "inline-block",
                              color: dimColor,
                          }}
                      >
                          {char === " " ? "\u00A0" : char}
                      </span>
                  ))
                : words.map((word, index) => (
                      <React.Fragment key={`${word}-${index}`}>
                          <span
                              className="word"
                              style={{
                                  display: "inline-block",
                                  color: dimColor,
                              }}
                          >
                              {word}
                          </span>
                          {index < words.length - 1 ? " " : null}
                      </React.Fragment>
                  ))}
        </p>
    );
}
