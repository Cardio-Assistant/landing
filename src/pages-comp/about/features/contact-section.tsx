import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { PiMailbox, PiPhone } from 'react-icons/pi';

import FeedbackForm from './form';

import type { RefObject } from 'react';

export function ContactSection({ targetRef6, isInView6 }:{targetRef6: RefObject<HTMLDivElement>, isInView6: boolean}) {
  const numLights = 64;
  const lights = useMemo(() => {
    return Array.from({ length: numLights }).map(() => ({
      top     : Math.random() * 100, // случайная позиция сверху в процентах
      left    : Math.random() * 100, // случайная позиция слева в процентах
      duration: Math.random() * 5 + 10, // длительность анимации от 5 до 15 секунд
      // массивы случайных значений для осей X и Y (5 ключевых точек)
      x       : Array.from({ length: 5 }, () => Math.floor(Math.random() * 400) - 50),
      y       : Array.from({ length: 5 }, () => Math.floor(Math.random() * 200) - 50),
    }));
  }, []);

  return (
    <div
      ref={ targetRef6 }
      className='relative bg-white overflow-hidden flex items-center justify-center pt-8'
    >


      {/* Маленькие плавающие огоньки с эффектом размытия */}
      {lights.map((light, index) => (
        <motion.div
          key={ index }
          initial={ { x: 0, y: 0 } }
          animate={ {  x: light.x, y: light.y } }
          transition={ {
            duration  : light.duration,
            ease      : 'easeInOut',
            repeat    : Infinity,
            repeatType: 'mirror',
          } }
          className='absolute  w-20 h-20 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-50 transform-gpu'
          style={ { top: `${light.top}%`, left: `${light.left}%` } }
        />
      ))}

      {/* Контент */}
      <div className='w-full relative z-10'>
        <motion.h2
          initial={ { opacity: 0 } }
          animate={ isInView6 ? { opacity: 1 } : {} }
          transition={ { duration: 0.8, delay: 0.2 } }
          className='flex w-full justify-center text-3xl text-neutral'
        >
          Свяжитесь с нами
        </motion.h2>

        <div className='w-12/12 md:w-10/12 px-6 mx-auto my-0 md:my-32 lg:my-20 flex flex-col flex-wrap gap-2 justify-center'>
          <div className='flex flex-col lg:flex-row justify-center items-center gap-20 flex-wrap'>
            <div className='flex flex-col text-center lg:text-left'>
              <p className='text-4xl text-blue-500 font-bold'>Спасём миллионы</p>
              <p className='text-4xl text-blue-500 font-bold'>сердец вместе</p>

              <div className='flex flex-col items-center lg:items-start mx-auto rounded-lg mt-8 font-semibold'>
                <span className='text-2xl text-neutral'>Наши контакты:</span>
                <span className='flex flex-row items-center'>
                  <PiPhone className='text-neutral' size={ 32 } />
                  <span className='ml-2 text-2xl text-neutral'>+7(982)451-66-89</span>
                </span>
                <span className='flex flex-row items-center'>
                  <PiMailbox className='text-neutral' size={ 32 } />
                  <span className='ml-2 text-xl md:text-2xl text-neutral whitespace-normal'>
                    alexosipov03@yandex.com
                  </span>
                </span>
              </div>
            </div>

            <FeedbackForm />
          </div>
        </div>
      </div>
    </div>
  );
}
