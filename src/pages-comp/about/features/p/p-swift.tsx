import { motion } from 'framer-motion';

import type { RefObject } from 'react';







export function PSwift({ text, targetRef }:{text:string, targetRef:RefObject<HTMLDivElement>}) {

  const handleClick = () => {
    if (targetRef.current) {
      targetRef.current.scrollIntoView({
        behavior: 'smooth',
        block   : 'start'
      });
    }
  };

  return (
    <div className='border-b border-black my-20 mx-10'>
      <motion.button
        onClick={ handleClick }
        initial={ { x: 0 } } // Начальное положение
        whileHover={ { x: 20 } } // Положение при наведении
        transition={ { duration: 0.3 } } // Длительность анимации
        className='pb-11 text-left w-full'
      >
        <span className='w-full h-52 pl-1 text-6xl text-black font-semibold'>{text}</span>
      </motion.button>
    </div>
  );
}
