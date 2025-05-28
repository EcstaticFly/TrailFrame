"use client";

import { useEffect, useRef } from "react";

interface MousePosition {
  x: number;
  y: number;
}

interface TrailImage {
  element: HTMLDivElement;
  maskLayers: HTMLDivElement[];
  imgLayers: HTMLDivElement[];
  removeTime: number;
}

interface Config {
  imageLifespan: number;
  mouseThreshold: number;
  inDuration: number;
  outDuration: number;
  staggerIn: number;
  staggerOut: number;
  slideDuration: number;
  slideEasing: string;
  easing: string;
}

const TrailContainer: React.FC = () => {
  const trailContainerRef = useRef<HTMLDivElement>(null);
  const animationStateRef = useRef<number | null>(null);
  const trailRef = useRef<TrailImage[]>([]);
  const currentImageIndexRef = useRef<number>(0);
  const mousePosRef = useRef<MousePosition>({ x: 0, y: 0 });
  const lastMousePosRef = useRef<MousePosition>({ x: 0, y: 0 });
  const interpolatedMousePosRef = useRef<MousePosition>({ x: 0, y: 0 });
  const isDesktopRef = useRef<boolean>(false);
  const cleanupMouseListenerRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const config: Config = {
      imageLifespan: 1000,
      mouseThreshold: 150,
      inDuration: 750,
      outDuration: 1000,
      staggerIn: 100,
      staggerOut: 25,
      slideDuration: 1000,
      slideEasing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      easing: "cubic-bezier(0.87, 0, 0.13, 1)",
    };

    const trailImageCount = 20;
    const images: string[] = Array.from(
      { length: trailImageCount },
      (_, i) => `/trail-images/img${i + 1}.jpeg`
    );

    const trailContainer = trailContainerRef.current;
    if (!trailContainer) return;
    const checkIsDesktop = () => window.innerWidth > 1000;
    isDesktopRef.current = checkIsDesktop();

    const MathUtils = {
      lerp: (a: number, b: number, n: number): number => (1 - n) * a + n * b,
      distance: (x1: number, y1: number, x2: number, y2: number): number =>
        Math.hypot(x2 - x1, y2 - y1),
    };

    const getMouseDistance = (): number =>
      MathUtils.distance(
        mousePosRef.current.x,
        mousePosRef.current.y,
        lastMousePosRef.current.x,
        lastMousePosRef.current.y
      );

    const isInTrailContainer = (x: number, y: number): boolean => {
      if (!trailContainer) return false;
      const rect = trailContainer.getBoundingClientRect();
      return (
        x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom
      );
    };

    const createTrailImage = (): void => {
      if (!trailContainer) return;

      const imgContainer = document.createElement("div");
      imgContainer.classList.add("trail-img");

      const imgSrc = images[currentImageIndexRef.current];
      currentImageIndexRef.current =
        (currentImageIndexRef.current + 1) % trailImageCount;

      const rect = trailContainer.getBoundingClientRect();
      const startX = interpolatedMousePosRef.current.x - rect.left - 87.5;
      const startY = interpolatedMousePosRef.current.y - rect.top - 87.5;
      const targetX = mousePosRef.current.x - rect.left - 87.5;
      const targetY = mousePosRef.current.y - rect.top - 87.5;

      imgContainer.style.cssText = `
        position: absolute;
        left: ${startX}px;
        top: ${startY}px;
        width: 175px;
        height: 175px;
        pointer-events: none;
        transition: left ${config.slideDuration}ms ${config.slideEasing}, top ${config.slideDuration}ms ${config.slideEasing};
      `;

      const maskLayers: HTMLDivElement[] = [];
      const imgLayers: HTMLDivElement[] = [];

      for (let i = 0; i < 10; i++) {
        const layer = document.createElement("div");
        layer.classList.add("mask-layer");

        const imageLayer = document.createElement("div");
        imageLayer.classList.add("image-layer");

        const startYPercent = i * 10;
        const endYPercent = (i + 1) * 10;

        layer.style.cssText = `
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          clip-path: polygon(50% ${startYPercent}%, 50% ${startYPercent}%, 50% ${endYPercent}%, 50% ${endYPercent}%);
          transition: clip-path ${config.inDuration}ms ${config.easing};
          transform: translateZ(0);
          backface-visibility: hidden;
        `;

        imageLayer.style.cssText = `
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: url(${imgSrc});
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
        `;

        layer.appendChild(imageLayer);
        imgContainer.appendChild(layer);
        maskLayers.push(layer);
        imgLayers.push(imageLayer);
      }

      trailContainer.appendChild(imgContainer);

      requestAnimationFrame(() => {
        imgContainer.style.left = `${targetX}px`;
        imgContainer.style.top = `${targetY}px`;

        maskLayers.forEach((layer, i) => {
          const startYPercent = i * 10;
          const endYPercent = (i + 1) * 10;
          const distanceFromMiddle = Math.abs(i - 4.5);
          const delay = distanceFromMiddle * config.staggerIn;

          setTimeout(() => {
            layer.style.clipPath = `polygon(0% ${startYPercent}%, 100% ${startYPercent}%, 100% ${endYPercent}%, 0% ${endYPercent}%)`;
          }, delay);
        });
      });

      trailRef.current.push({
        element: imgContainer,
        maskLayers: maskLayers,
        imgLayers: imgLayers,
        removeTime: Date.now() + config.imageLifespan,
      });
    };

    const removeOldImages = (): void => {
      const now = Date.now();
      while (
        trailRef.current.length > 0 &&
        now >= trailRef.current[0].removeTime
      ) {
        const imgToRemove = trailRef.current.shift();
        if (!imgToRemove) continue;

        imgToRemove.maskLayers.forEach((layer, i) => {
          const startYPercent = i * 10;
          const endYPercent = (i + 1) * 10;
          const distanceFromEdge = 4.5 - Math.abs(i - 4.5);
          const delay = distanceFromEdge * config.staggerOut;

          layer.style.transition = `clip-path ${config.outDuration}ms ${config.easing}`;

          setTimeout(() => {
            layer.style.clipPath = `polygon(50% ${startYPercent}%, 50% ${startYPercent}%, 50% ${endYPercent}%, 50% ${endYPercent}%)`;
          }, delay);
        });

        imgToRemove.imgLayers.forEach((imgLayer) => {
          imgLayer.style.transition = `opacity ${config.outDuration}ms ${config.easing}`;
          imgLayer.style.opacity = "0.25";
        });

        setTimeout(() => {
          if (imgToRemove.element && imgToRemove.element.parentNode) {
            imgToRemove.element.parentNode.removeChild(imgToRemove.element);
          }
        }, config.outDuration + 100);
      }
    };

    const render = (): void => {
      if (!isDesktopRef.current) return;

      const distance = getMouseDistance();

      interpolatedMousePosRef.current.x = MathUtils.lerp(
        interpolatedMousePosRef.current.x,
        mousePosRef.current.x,
        0.1
      );
      interpolatedMousePosRef.current.y = MathUtils.lerp(
        interpolatedMousePosRef.current.y,
        mousePosRef.current.y,
        0.1
      );

      if (
        distance > config.mouseThreshold &&
        isInTrailContainer(mousePosRef.current.x, mousePosRef.current.y)
      ) {
        createTrailImage();
        lastMousePosRef.current = { ...mousePosRef.current };
      }

      removeOldImages();
      animationStateRef.current = requestAnimationFrame(render);
    };

    const handleMouseMove = (e: MouseEvent): void => {
      mousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    const startAnimation = (): (() => void) => {
      if (!isDesktopRef.current) return () => {};

      document.addEventListener("mousemove", handleMouseMove);

      interpolatedMousePosRef.current = { ...mousePosRef.current };

      animationStateRef.current = requestAnimationFrame(render);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
      };
    };

    const stopAnimation = (): void => {
      if (animationStateRef.current) {
        cancelAnimationFrame(animationStateRef.current);
        animationStateRef.current = null;
      }

      trailRef.current.forEach((item) => {
        if (item.element && item.element.parentNode) {
          item.element.parentNode.removeChild(item.element);
        }
      });

      trailRef.current = [];
    };

    const handleResize = (): void => {
      const wasDesktop = isDesktopRef.current;
      isDesktopRef.current = checkIsDesktop();

      if (isDesktopRef.current && !wasDesktop) {
        cleanupMouseListenerRef.current = startAnimation();
      } else if (!isDesktopRef.current && wasDesktop) {
        stopAnimation();
        if (cleanupMouseListenerRef.current) {
          cleanupMouseListenerRef.current();
          cleanupMouseListenerRef.current = null;
        }
      }
    };

    window.addEventListener("resize", handleResize);

    if (isDesktopRef.current) {
      cleanupMouseListenerRef.current = startAnimation();
    }

    return () => {
      stopAnimation();
      if (cleanupMouseListenerRef.current) {
        cleanupMouseListenerRef.current();
      }
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      className="trail-container"
      ref={trailContainerRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 1,
      }}
    />
  );
};

export default TrailContainer;
