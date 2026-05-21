import { motion } from 'framer-motion';
import Link from 'next/link';

import { prefex } from '../page';

import Constellation from './bg-anim/constellation';

import type { RefObject } from 'react';

export function BlockOne({ targetRef }:{ targetRef: RefObject<HTMLDivElement> }) {

  const handleClick = () => {
    if (targetRef.current) {
      targetRef.current.scrollIntoView({
        behavior: 'smooth',
        block   : 'start'
      });
    }
  };

  return (
    <div className='relative h-screen md:h-[70vh]'>
      {/* Фон */}
      <div className='absolute inset-0 z-0'>
        <Constellation
          starColor='rgba(255, 255, 255, 0.9)'
          lineColor='rgba(173, 216, 230, 0.4)'
          backgroundColor='bg-gradient-to-br from-blue-900 via-blue-500 to-cyan-400'
          interactionLineColor='rgba(173, 216, 230, 0.8)'
          totalStars={ 200 }
          height='h-screen'
          className='opacity-55'
        />
      </div>

      {/* Контент */}
      <div className='scale-90 relative z-10 flex flex-col md:flex-row items-center justify-center h-full px-4 md:px-16'>
        {/* Текстовый блок */}
        <div className='w-full md:w-1/2 text-center md:text-left mt-16 md:mt-0 mb-8 md:mb-0'>
          <h1 className='text-2xl md:text-4xl font-bold text-white'>
            Искусственный интеллект<br /> для кардиохирургии
          </h1>
          <p className='mt-4 text-sm md:text-2xl text-blue-200 font-light'>
            Помощник, создающий 3D модели сосудов сердца<br /> и прогнозирующий риски операций
          </p>

          <div className='flex md:flex-col md:w-fit gap-4 md:gap-0 justify-center '>
            <button
              onClick={ handleClick }
              className='px-4 md:px-8 py-2 md:py-3 mt-6 text-base md:text-lg font-semibold bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg text-white shadow-lg shadow-blue-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-400/40 hover:-translate-y-1 active:scale-95 active:shadow-none'
            >
            Связаться с нами
            </button>
            <Link
              href={ '/web/auth' }
              className='px-4 md:px-8 py-2 md:py-3 mt-6 text-base md:text-lg font-semibold bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-lg text-white shadow-lg shadow-blue-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-400/40 hover:-translate-y-1 active:scale-95 active:shadow-none'
            >
              Перейти к демоверсии
            </Link>
          </div>

        </div>

        {/* Блок с изображением */}
        <div className='w-full md:w-1/2 flex justify-center'>
          <motion.div
            initial={ { opacity: 0, x: 100 } }
            animate={ { opacity: 1, x: 0 } }
            transition={ { duration: 0.8 } }
            className='relative group'
          >
            <div className='mockup-phone rounded-xl border-blue-600/30 md:mt-12'>
              <div className='relative'>
                <motion.img
                  src={ prefex + '/logo/3d.png' }
                  alt='3D модель сердца'
                  className='object-cover w-full h-full rounded-xl shadow-inner transition-transform duration-300 lg:w-[80dvh]'
                  
                /> 
                <div className='absolute inset-0 rounded-[50px] mix-blend-overlay bg-gradient-to-br from-transparent via-blue-400/10 to-cyan-300/10' />
              </div>
            </div>
            {/* Эффект свечения */}
            <div className='absolute inset-0 -z-10 bg-blue-500/20 blur-2xl rounded-[60px] scale-95' />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
