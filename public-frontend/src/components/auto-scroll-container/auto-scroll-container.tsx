import type React from 'react';
import { useEffect, useRef, useState } from 'react';

interface AutoScrollContainerProps {
  children: React.ReactNode;
  scrollSpeed: number;
  bottomPauseTime: number;
  topPauseTime: number;
}

export const AutoScrollContainer = ({
  children,
  scrollSpeed,
  bottomPauseTime,
  topPauseTime,
}: AutoScrollContainerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollState, setScrollState] = useState<
    'initializing' | 'topDelay' | 'scrolling' | 'bottomDelay'
  >('initializing');

  // Initialize scrolling with a slight delay to ensure component is fully mounted
  useEffect(() => {
    const timer = setTimeout(() => {
      setScrollState('topDelay');

      // Start the top delay
      setTimeout(() => {
        setScrollState('scrolling');
      }, topPauseTime);
    }, 500);

    return () => clearTimeout(timer);
  }, [topPauseTime]);

  useEffect(() => {
    if (scrollState === 'initializing') return;

    const container = containerRef.current;
    if (!container) return;

    let lastTimestamp: number | null = null;
    let animationFrameId: number;

    const scroll = (timestamp: number) => {
      // Only scroll during "scrolling" state
      if (scrollState !== 'scrolling') {
        lastTimestamp = null;
        animationFrameId = requestAnimationFrame(scroll);
        return;
      }

      if (lastTimestamp === null) {
        lastTimestamp = timestamp;
        animationFrameId = requestAnimationFrame(scroll);
        return;
      }

      // Calculate time elapsed since last frame
      const elapsed = timestamp - lastTimestamp;

      // Calculate how many pixels to scroll based on time elapsed and scroll speed
      const pixelsToScroll = (scrollSpeed * elapsed) / 1000;

      // Scroll down
      container.scrollTop += pixelsToScroll;

      // Check if we've reached the bottom
      const bottomReached =
        container.scrollTop + container.clientHeight >=
        container.scrollHeight - 20;

      if (bottomReached) {
        // Change to bottom delay state
        setScrollState('bottomDelay');

        // After bottom pause time, reset to top and start top delay
        setTimeout(() => {
          if (container) {
            container.scrollTop = 0;
            setScrollState('topDelay');

            // After top pause time, start scrolling again
            setTimeout(() => {
              setScrollState('scrolling');
            }, topPauseTime);
          }
        }, bottomPauseTime);
      }

      lastTimestamp = timestamp;
      animationFrameId = requestAnimationFrame(scroll);
    };

    // Start the animation
    animationFrameId = requestAnimationFrame(scroll);

    // Cleanup function
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [scrollSpeed, bottomPauseTime, topPauseTime, scrollState]);

  return (
    <div
      ref={containerRef}
      className="h-[calc(100vh-8rem)] overflow-y-auto scrollbar-hide relative pt-8 pb-8"
      style={{ scrollbarWidth: 'none' }}
      data-testid="auto-scroll-container"
    >
      {children}
    </div>
  );
};
