import { motion, useAnimation } from 'framer-motion';
import { useEffect, useState } from 'react';

import { IconAiCardio } from './icon-ai';

import type { RefObject } from 'react';

export const AnimatedText = ({ children, className }: { 
  children: React.ReactNode;
  className?: string;
}) => {
  const underlineControls = useAnimation();
    
  return (
    <motion.span 
      className={ `relative inline-block ${className}` }
      onHoverStart={ () => underlineControls.start('hover') }
      onHoverEnd={ () => underlineControls.start('rest') }
    >
      {children}
      <motion.span
        className='absolute bottom-0 left-0 w-full h-[1px] bg-current'
        initial={ { scaleX: 0 } }
        animate={ underlineControls }
        variants={ {
          rest: { 
            scaleX    : 0,
            transition: { duration: 0.2 } 
          },
          hover: { 
            scaleX    : 1,
            transition: { duration: 0.3 }
          }
        } }
      />
    </motion.span>
  );
};

type NavBarProps = {
    targetRefAbout:RefObject<HTMLDivElement>,
    targetRefContact:RefObject<HTMLDivElement>,
    targetRefInvestors:RefObject<HTMLDivElement>,
}

export function NavBar({
  targetRefAbout,
  targetRefContact,
  targetRefInvestors,
}: NavBarProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClickAbout = () => {
    if (targetRefAbout.current) {
      targetRefAbout.current.scrollIntoView({
        behavior: 'smooth',
        block   : 'start'
      });
    }
  };

  const handleClickContact = () => {
    if (targetRefContact.current) {
      targetRefContact.current.scrollIntoView({
        behavior: 'smooth',
        block   : 'start'
      });
    }
  };

  const handleClickInvestors = () => {
    if (targetRefInvestors.current) {
      targetRefInvestors.current.scrollIntoView({
        behavior: 'smooth',
        block   : 'start'
      });
    }
  };

  return (
    <div className='fixed w-full z-50'>
      <div className={ `
      relative
        navbar 
        transition-all 
        duration-300 
        ${isScrolled 
      ? 'backdrop-blur-md bg-black/50 shadow-sm' 
      : 'bg-transparent'
    }
      ` }>
        <span className='md:ml-16'>
          <IconAiCardio />
          <span className='text-xl btn btn-ghost px-2 text-gray-100'>
            Cardio Assistant
          </span>
        </span>
        
        <div className='absolute hidden lg:flex w-full gap-8 justify-center'>
          <AnimatedText className='text-gray-100'>
            <button onClick={ handleClickAbout }>
            О нас
            </button>
          </AnimatedText>
          <AnimatedText className='text-gray-100'>
            <button onClick={ handleClickInvestors }>
            Для инвесторов
            </button>
          </AnimatedText>
          {/* <AnimatedText className='text-gray-100'>
            Для медицинских клиник
          </AnimatedText> */}
          <AnimatedText className='text-gray-100'>
            <button onClick={ handleClickContact }>
            Контакты
            </button>
          </AnimatedText>
        </div>

        <div className='dropdown dropdown-bottom lg:hidden flex ml-auto'>
          <div tabIndex={ 0 } role='button' className='btn btn-sm btn-ghost m-1 text-gray-100'>
            <svg
              className='w-6 h-6'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={ 2 }
                d='M4 6h16M4 12h16M4 18h16'
              />
            </svg>
          </div>
          <ul tabIndex={ 0 } className='dropdown-content -left-36 mt-4 menu bg-gray-100 text-neutral rounded-box z-1 w-52 p-2 shadow-sm'>
            <li>
              <button onClick={ handleClickAbout }>
            О нас
              </button>
            </li>
            <li>
              <button onClick={ handleClickInvestors }>
            Для инвесторов
              </button>
            </li>
            <li>
              <button onClick={ handleClickContact }>
            Контакты
              </button>
            </li>
          </ul>
        </div>
        
      </div>
    </div>
  );
}