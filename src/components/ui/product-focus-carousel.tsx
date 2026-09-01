"use client";

import { useState, useEffect, useCallback, useRef, startTransition } from "react";
import { motion } from "framer-motion";
import { SiteLink } from "@/components/umberlla/site-link";

/** Keeps the hover/tap animation while routing in-app links through the
 *  router — product.link points at our own /products/<handle>. */
const MotionSiteLink = motion.create(SiteLink);

export function ProductFocusCarousel({
  products = [],
  cardRadius = 24,
  gap = 40,
  activeScale = 1,
  inactiveScale = 0.75,
  overlayOpacity = 0.6,
  showButton = true,
  showArrows = true,
  autoplay = false,
  autoplaySpeed = 4000,
  backgroundColor = "transparent",
  buttonColor = "#f2c230",
  buttonTextColor = "#101b33",
  textColor = "#FFFFFF",
  subtitleColor = "rgba(255, 255, 255, 0.8)",
  overlayColor = "#000000",
  arrowColor = "#101b33",
  arrowBackgroundColor = "#FFFFFF",
}: any) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef(null);
  const isStatic = false;

  useEffect(() => {
    if (!autoplay || isStatic || isHovered || products.length === 0) return;
    const interval = setInterval(() => {
      startTransition(() => {
        setActiveIndex((prev: number) => (prev + 1) % products.length);
      });
    }, autoplaySpeed);
    return () => clearInterval(interval);
  }, [autoplay, autoplaySpeed, isHovered, products.length, isStatic]);

  const navigateTo = useCallback((index: number) => {
    startTransition(() => {
      setActiveIndex(index);
    });
  }, []);

  const navigateNext = useCallback(() => {
    if (products.length === 0) return;
    startTransition(() => {
      setActiveIndex((prev: number) => (prev + 1) % products.length);
    });
  }, [products.length]);

  const navigatePrev = useCallback(() => {
    if (products.length === 0) return;
    startTransition(() => {
      setActiveIndex((prev: number) => (prev - 1 + products.length) % products.length);
    });
  }, [products.length]);

  const handleDragEnd = useCallback(
    (event: any, info: any) => {
      const threshold = 50;
      if (info.offset.x > threshold) {
        navigatePrev();
      } else if (info.offset.x < -threshold) {
        navigateNext();
      }
    },
    [navigateNext, navigatePrev]
  );

  const getCardPosition = (index: number) => {
    const diff = index - activeIndex;
    const normalizedDiff =
      diff > products.length / 2
        ? diff - products.length
        : diff < -products.length / 2
        ? diff + products.length
        : diff;
    return normalizedDiff;
  };

  const getCardStyle = (position: number, isMobile: boolean) => {
    const baseWidth = isMobile ? 280 : 380;
    const baseHeight = isMobile ? 380 : 520;
    if (position === 0) {
      return {
        x: 0,
        scale: activeScale,
        zIndex: 10,
        opacity: 1,
        width: baseWidth,
        height: baseHeight,
      };
    }
    const absPosition = Math.abs(position);
    const cardDirection = position > 0 ? 1 : -1;
    const translateX = cardDirection * (baseWidth * 0.85 + gap * (1 - absPosition * 0.2));
    const scale = inactiveScale * (1 - absPosition * 0.15);
    const blur = absPosition > 1 ? 2 : 0;
    return {
      x: translateX,
      scale,
      zIndex: 10 - absPosition,
      opacity: 1,
      width: baseWidth,
      height: baseHeight,
      filter: blur > 0 ? `blur(${blur}px)` : "none",
    };
  };

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "520px",
        backgroundColor,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <motion.div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            width: "100%",
            height: "100%",
          }}
          drag={!isStatic ? "x" : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={!isStatic ? handleDragEnd : undefined}
        >
          {products.map((product: any, index: number) => {
            const position = getCardPosition(index);
            const isVisible = Math.abs(position) <= 2;
            if (!isVisible) return null;
            return (
              <ProductCard
                key={product.id || index}
                product={product}
                position={position}
                isActive={position === 0}
                cardRadius={cardRadius}
                showButton={showButton}
                overlayOpacity={overlayOpacity}
                textColor={textColor}
                subtitleColor={subtitleColor}
                overlayColor={overlayColor}
                buttonColor={buttonColor}
                buttonTextColor={buttonTextColor}
                onClick={() => navigateTo(index)}
                getCardStyle={getCardStyle}
              />
            );
          })}
        </motion.div>
      </div>
      {showArrows && (
        <>
          <ArrowButton
            direction="left"
            onClick={navigatePrev}
            arrowColor={arrowColor}
            arrowBackgroundColor={arrowBackgroundColor}
            disabled={isStatic}
          />
          <ArrowButton
            direction="right"
            onClick={navigateNext}
            arrowColor={arrowColor}
            arrowBackgroundColor={arrowBackgroundColor}
            disabled={isStatic}
          />
        </>
      )}
    </div>
  );
}

function ProductCard({
  product,
  position,
  isActive,
  cardRadius,
  showButton,
  overlayOpacity,
  textColor,
  subtitleColor,
  overlayColor,
  buttonColor,
  buttonTextColor,
  onClick,
  getCardStyle,
}: any) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  const style = getCardStyle(position, isMobile);
  const imageSrc = product.image?.src;
  const imageAlt = product.image?.alt || product.title || "Product image";
  return (
    <motion.div
      style={{
        position: "absolute",
        width: style.width,
        height: style.height,
        borderRadius: cardRadius,
        overflow: "hidden",
        cursor: isActive ? "default" : "pointer",
        boxShadow: isActive
          ? "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
          : "0 10px 30px -10px rgba(0, 0, 0, 0.15)",
        zIndex: style.zIndex,
        filter: style.filter,
      }}
      initial={false}
      animate={{ x: style.x, scale: style.scale, opacity: style.opacity }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      onClick={onClick}
    >
      <div style={{ width: "100%", height: "100%", position: "relative" }}>
        <img
          src={imageSrc}
          alt={imageAlt}
          draggable="false"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "60%",
            background: `linear-gradient(to top, ${overlayColor}${Math.round(
              overlayOpacity * 255
            ).toString(16).padStart(2, '0')}, transparent)`,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: isMobile ? "20px" : "28px",
            display: "flex",
            flexDirection: "column",
            gap: isMobile ? "8px" : "12px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <span
              style={{
                fontSize: isMobile ? "11px" : "12px",
                fontWeight: 500,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: subtitleColor,
                fontFamily: "var(--u-mono)",
              }}
            >
              {product.subtitle}
            </span>
            <span
              style={{
                fontSize: isMobile ? "20px" : "24px",
                fontWeight: 600,
                color: textColor,
                fontFamily: "var(--u-display)",
                letterSpacing: "-0.02em",
                lineHeight: 1.2,
              }}
            >
              {product.title}
            </span>
          </div>
          {showButton && isActive && product.link && (
            /* Was a <button> firing window.open at an external product URL:
               no middle-click, no copy-link, invisible to crawlers, and
               announced as "button" rather than "link". */
            <MotionSiteLink
              href={product.link}
              onClick={(event) => event.stopPropagation()}
              style={{
                display: "inline-block",
                textDecoration: "none",
                backgroundColor: buttonColor,
                color: buttonTextColor,
                border: "none",
                borderRadius: 100,
                padding: isMobile ? "12px 20px" : "14px 24px",
                fontSize: isMobile ? "13px" : "14px",
                fontWeight: 600,
                cursor: "pointer",
                marginTop: isMobile ? "8px" : "16px",
                fontFamily: "var(--u-display)",
                letterSpacing: "-0.01em",
                width: "fit-content",
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {product.buttonLabel}
            </MotionSiteLink>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function ArrowButton({
  direction,
  onClick,
  arrowColor,
  arrowBackgroundColor,
  disabled,
}: any) {
  return (
    <button
      style={{
        position: "absolute",
        [direction]: "24px",
        top: "50%",
        transform: "translateY(-50%)",
        width: 48,
        height: 48,
        borderRadius: "50%",
        backgroundColor: arrowBackgroundColor,
        border: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: disabled ? "default" : "pointer",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        zIndex: 20,
        opacity: disabled ? 0.5 : 1,
      }}
      onClick={disabled ? undefined : onClick}
      aria-label={
        direction === "left" ? "Previous carousel item" : "Next carousel item"
      }
      type="button"
    >
      <svg
        width={20}
        height={20}
        viewBox="0 0 24 24"
        fill="none"
        stroke={arrowColor}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          transform: direction === "left" ? "rotate(0deg)" : "rotate(180deg)",
        }}
      >
        <polyline points="15 18 9 12 15 6" />
      </svg>
    </button>
  );
}
