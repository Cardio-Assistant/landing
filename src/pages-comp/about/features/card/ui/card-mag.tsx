import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

import type { ReactNode } from 'react';

interface TiltedCardCustomProps {
  children: ReactNode;
  containerHeight?: string;
  containerWidth?: string;
  scaleOnHover?: number;
  rotateAmplitude?: number;
}

const springValues = {
  damping  : 30,
  stiffness: 100,
  mass     : 2,
};

const TiltedCardCustom: React.FC<TiltedCardCustomProps> = ({
  children,
  containerHeight = '300px',
  containerWidth = '100%',
  scaleOnHover = 1.1,
  rotateAmplitude = 14,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(0, springValues);
  const rotateY = useSpring(0, springValues);
  const scale = useSpring(1, springValues);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;

    rotateX.set((offsetY / (rect.height / 2)) * -rotateAmplitude);
    rotateY.set((offsetX / (rect.width / 2)) * rotateAmplitude);

    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);
  };

  const handleMouseEnter = () => {
    scale.set(scaleOnHover);
  };

  const handleMouseLeave = () => {
    scale.set(1);
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <figure
      ref={ ref }
      className='relative w-full h-full [perspective:800px] flex items-center justify-center'
      style={ {
        height: containerHeight,
        width : containerWidth,
      } }
      onMouseMove={ handleMouseMove }
      onMouseEnter={ handleMouseEnter }
      onMouseLeave={ handleMouseLeave }
    >
      <motion.div
        className='relative [transform-style:preserve-3d]'
        style={ {
          scale,
          rotateX,
          rotateY,
        } }
      >
        {children}
      </motion.div>
    </figure>
  );
};

export default TiltedCardCustom;
