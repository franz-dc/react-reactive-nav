import React, {
  FC,
  ReactNode,
  HTMLAttributes,
  useState,
  useEffect,
} from 'react';
import useWindowScrollPosition from '@rehooks/window-scroll-position';

export interface ReactiveNavProps extends HTMLAttributes<HTMLDivElement> {
  // Explicitly type children instead of FC<PropsWithChildren<Props>>
  // to support React ^16.8.0 || ^17.0.0.
  children?: ReactNode;
  /**
   * Height of the navbar.
   */
  height: number;
  /**
   * Snap to the closest state of the navbar based on the scroll amount.
   */
  snap?: boolean;
  /**
   * Set the delay of snap checking after scrolling (in ms).
   * Only applies if `snap` is set to `true`.
   */
  snapDelay?: number;
  /**
   * Specify how long the snap animation should run (in ms).
   * Only applies if `snap` is set to `true`.
   */
  snapDuration?: number;
  /**
   * Props passed to the padding element (blank div with a set height).
   */
  paddingElementProps?: HTMLAttributes<HTMLDivElement>;
}

export const ReactiveNav: FC<ReactiveNavProps> = ({
  children,
  height,
  snap,
  snapDelay = 200,
  snapDuration = 200,
  style,
  paddingElementProps,
  ...rest
}) => {
  const { y } = useWindowScrollPosition({ throttle: 0 });

  const [lastYPos, setLastYPos] = useState(y);
  const [yScrollAmount, setYScrollAmount] = useState(0);
  const [isSnapping, setIsSnapping] = useState(false);
  const [isTouching, setIsTouching] = useState(false);

  useEffect(() => {
    // check touch state to prevent snap when scrolling
    const handleTouchStart = () => setIsTouching(true);
    const handleTouchEnd = () => setIsTouching(false);

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('mousedown', handleTouchStart);
    window.addEventListener('mouseup', handleTouchEnd);

    // change navbar position based on scroll amount
    const updateScrollPos = () => {
      const yPosDiff = y - lastYPos;

      if (yPosDiff === 0) return;

      setIsSnapping(false);

      setYScrollAmount((sa) => {
        const newYScrollAmount = sa + yPosDiff;
        if (newYScrollAmount <= 0) return 0;
        if (newYScrollAmount >= height) return height;
        return newYScrollAmount;
      });

      setLastYPos(y);

      setTimeout(() => {
        setIsSnapping(true);
      }, snapDelay);
    };

    window.addEventListener('scroll', updateScrollPos);

    updateScrollPos();

    return () => {
      window.removeEventListener('scroll', updateScrollPos);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('mousedown', handleTouchStart);
      window.removeEventListener('mouseup', handleTouchEnd);
    };
  }, [
    // states
    y,
    yScrollAmount,
    lastYPos,
    isSnapping,
    isTouching,
    // props
    height,
    snap,
    snapDelay,
    snapDuration,
  ]);

  useEffect(() => {
    if (
      snap &&
      !isTouching &&
      isSnapping &&
      y >= height &&
      yScrollAmount !== 0 &&
      yScrollAmount !== height
    ) {
      const halfHeight = height / 2;
      setYScrollAmount((sa) => (sa < halfHeight ? 0 : height));
    }
  }, [y, yScrollAmount, height, snap, isSnapping, isTouching]);

  return (
    <>
      <div
        {...rest}
        style={{
          transition: isSnapping ? `transform ${snapDuration}ms` : '',
          position: 'fixed',
          width: '100%',
          height,
          transform: `translateY(${-yScrollAmount}px)`,
          ...style,
        }}
      >
        {children}
      </div>
      <div
        {...paddingElementProps}
        style={{
          height,
          ...paddingElementProps?.style,
        }}
      />
    </>
  );
};
