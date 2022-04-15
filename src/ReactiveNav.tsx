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
   * Props passed to the padding element (blank div with a set height).
   */
  paddingElementProps?: HTMLAttributes<HTMLDivElement>;
}

export const ReactiveNav: FC<ReactiveNavProps> = ({
  children,
  height,
  style,
  paddingElementProps,
  ...rest
}) => {
  const [yScrollAmount, setYScrollAmount] = useState(0);

  const { y } = useWindowScrollPosition({ throttle: 0 });

  const [lastYPos, setLastYPos] = useState(y);

  useEffect(() => {
    const updateScrollPos = () => {
      const yPosDiff = y - lastYPos;

      if (yPosDiff === 0) return;

      setYScrollAmount((sa) => {
        const newYScrollAmount = sa + yPosDiff;
        if (newYScrollAmount <= 0) return 0;
        if (newYScrollAmount >= height) return height;
        return newYScrollAmount;
      });

      setLastYPos(y);
    };

    window.addEventListener('scroll', updateScrollPos);
    updateScrollPos();
    return () => window.removeEventListener('scroll', updateScrollPos);
  }, [y, yScrollAmount, lastYPos, height]);

  return (
    <>
      <div
        {...rest}
        style={{
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
