'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { PiGraphLight, PiHeadCircuitBold, PiLightbulb, PiMagnifyingGlass, PiPerson } from 'react-icons/pi';
import { BiHeart, BiPulse } from 'react-icons/bi';
import { LuHandHeart } from 'react-icons/lu';

import SpotlightCard from '@/components/jsrepo/Components/SpotlightCard/SpotlightCard';


import { BlockOne } from './features/block1';
import TiltedCardCustom from './features/card/ui/card-mag';
import ServicesSlider from './features/servicesSlider';
import { CardTeam } from './features/card/ui/card-team';
import Squares from './features/bg-anim/Squares';
import { NavBar } from './features/navbar';
import { ContactSection } from './features/contact-section';
import { ProblemBlock } from './features/problem-section';


export const prefex = 'lending';
// export const prefex = '';

export function PageAbout() {


  // const targetRef1 = useRef<HTMLDivElement>(null);
  const targetRef2 = useRef<HTMLDivElement>(null);
  const targetRef3 = useRef<HTMLDivElement>(null);
  const targetRef31 = useRef<HTMLDivElement>(null);
  const targetRef4 = useRef<HTMLDivElement>(null);
  const targetRef5 = useRef<HTMLDivElement>(null);
  const targetRef6 = useRef<HTMLDivElement>(null);

  // const isInView2 = useInView(targetRef2, { once: true, margin: '-20%' });
  const isInView31 = useInView(targetRef31, { once: true, margin: '-20%' });
  const isInView3 = useInView(targetRef3, { once: true, margin: '-20%' });
  const isInView4 = useInView(targetRef4, { once: true, margin: '-20%' });
  const isInView5 = useInView(targetRef5, { once: true, margin: '-20%' });
  const isInView6 = useInView(targetRef6, { once: true, margin: '-20%' });

  
  return (
    <main className=''>

      <NavBar
        targetRefAbout={ targetRef3 }
        targetRefContact={ targetRef6 }
        targetRefInvestors={ targetRef2 }
      />

      <BlockOne targetRef={ targetRef6 } />

      <div
        ref={ targetRef5 } 
        className='relative bg-gray-100 flex items-center justify-center pt-8'
      >
        <div className='container'>
          
          <motion.h2
            initial={ { opacity: 0 } }
            animate={ isInView5 ?  { opacity: 1 } : {} }
            transition={ { duration: 0.8, delay: 0.2 } }
            className='flex w-full justify-center text-3xl text-neutral font-semibold'>
          Партнеры
          </motion.h2>

          <div className='w-12/12 md:w-10/12 max-w-[1600px] px-6 mx-auto flex flex-col gap-12'>

            <div className='flex flex-row gap-8 flex-wrap justify-center'>
              <div className='justify-center flex flex-col items-center w-96'>
                <figure className='px-10 pt-10'>
                  <motion.img
                    src={ prefex + '/logo/cardio.png' }
                    alt='ФЦССХ'
                    className='rounded-xl'
                    style={ {
                      width : 100,
                      height: 120,
                    } }
                  />
                </figure>
                <div className='card-body items-center text-center'>
                  <h2 className='text-lg text-neutral-900'>Федеральный центр сердечно-сосудистой хирургии имени С.Г. Суханова</h2>
                </div>
              </div>

              <div className='justify-center flex flex-col items-center w-96'>
                <figure className='px-10 pt-10'>
                  <motion.img
                    src={ prefex + '/logo/fmi.png' }
                    alt='ФЦССХ'
                    className='rounded-full'
                    style={ {
                      width : 130,
                      height: 130,
                    } }
                  />
                </figure>
                <div className='card-body items-center text-center'>
                  <h2 className='text-lg text-neutral-900'>Физико-математический
                  институт ПГНИУ</h2>
                </div>
              </div>

              <div className='justify-center flex flex-col items-center w-96'>
                <figure className='px-10 pt-10'>
                  <motion.img
                    src={ prefex + '/logo/incub.jpg' }
                    alt='ФЦССХ'
                    className='rounded-full'
                    style={ {
                      width : 130,
                      height: 130,
                    } }
                  />
                </figure>
                <div className='card-body items-center text-center'>
                  <h2 className='text-lg text-neutral-900'>МКУ «Пермский бизнес-инкубатор»</h2>
                </div>
              </div>
        
            </div>
        
          </div>

        </div>
      </div>

      <ProblemBlock targetRef={ targetRef31 } isInView={ isInView31 } />

      {/* block 2 */}
      <div
        ref={ targetRef3 }
        className='relative bg-neutral-950 overflow-hidden flex flex-col items-center justify-center py-24 pb-96 md:pb-24'
      >
        <div className='absolute h-full w-full bg-neutral-900 z-10'>
          <Squares
            speed={ 0.1 } 
            squareSize={ 40 }
            direction='down' // up, down, left, right, diagonal
            borderColor='#a3a3a3'
            hoverFillColor='#666'
          />
        </div>
        <div className='container flex flex-row justify-center z-20 rounded-2xl w-fit' >
          <motion.div
            initial={ { clipPath: 'inset(0 0 0 100%)' } }
            animate={ isInView3 ? { clipPath: 'inset(0 0 0 0)' } : {} }
            transition={ { duration: 0.8, delay: 0.2 } }
          >
            <svg width='300' height='40' viewBox='0 0 289 3' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <rect width='289' height='3' fill='url(#gradient1)' />
              <defs>
                <linearGradient id='gradient1' x1='289' y1='0' x2='0' y2='0' gradientUnits='userSpaceOnUse'>
                  <stop stopColor='#D9D9D9'></stop>
                  <stop offset='1' stopColor='#D9D9D9' stopOpacity='0'></stop>
                </linearGradient>
              </defs>
            </svg>
          </motion.div>

          <motion.h2
            initial={ { opacity: 0 } }
            animate={ isInView3 ?  { opacity: 1 } : {} }
            transition={ { duration: 0.8, delay: 0.2 } }
            className='px-4 text-3xl text-gray-200 text-nowrap font-semibold'>
          Наше решение
          </motion.h2>

          <motion.div
            initial={ { clipPath: 'inset(0 100% 0 0)' } }
            animate={ isInView3 ? { clipPath: 'inset(0 0 0 0)' } : {} }
            transition={ { duration: 0.8, delay: 0.2 } }
          >
            <svg width='300' height='40' viewBox='0 0 289 3' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <rect x='289' y='3' width='289' height='3' transform='rotate(180 289 3)' fill='url(#gradient2)' />
              <defs>
                <linearGradient id='gradient2' x1='578' y1='3' x2='289' y2='3' gradientUnits='userSpaceOnUse'>
                  <stop stopColor='#D9D9D9'></stop>
                  <stop offset='1' stopColor='#D9D9D9' stopOpacity='0'></stop>
                </linearGradient>
              </defs>
            </svg>
          </motion.div>
        </div>

        <div className='my-24 flex flex-row md:gap-24 lg:gap-y-24 xl:gap-6 flex-wrap justify-center z-20'>

          <motion.div
            initial={ { opacity: 0, y: 30 } }
            animate={ isInView3 ? { opacity: 1, y: 0 } : {} }
            transition={ { duration: 0.8, delay: 0.2 } }>
            <TiltedCardCustom
              containerHeight='256px'
              containerWidth='400px'
              rotateAmplitude={ 1 }
            >
              <SpotlightCard className='mt-32 w-96 h-fit md:mt-0 md:w-[400px] md:h-80 shadow-xl' spotlightColor='rgba(0, 229, 255, 0.2)'>
                <div className='card-body'>
                  <h2 className='card-title text-gray-300'>Технологии будущего уже здесь</h2>
                  <ul className='flex flex-col gap-2'>
                    <li className='flex flex-row items-center'>
                      <PiHeadCircuitBold size={ 32 } color='#2adfd3' className='flex-shrink-0' />
                      <span className='text-gray-300 ml-2 text-base'>Обработка снимков сосудов алгоритмами глубокого обучения</span>
                    </li>
                    <li className='flex flex-row items-center'>
                      <BiHeart size={ 32 } color='#2adfd3' />
                      <span className='text-gray-300 ml-2 text-base'>3D-моделирование сердца</span>
                    </li>
                    <li className='flex flex-row items-center'>
                      <PiGraphLight size={ 32 } color='#2adfd3' className='flex-shrink-0' />
                      <span className='text-gray-300 ml-2 text-base'>Прогнозирование результатов хирургических вмешательств до их проведения</span>
                    </li>
                  </ul>
                </div>
              </SpotlightCard>
            </TiltedCardCustom>
          </motion.div>

          <motion.div
            initial={ { opacity: 0, y: 30 } }
            animate={ isInView3 ? { opacity: 1, y: 0 } : {} }
            transition={ { duration: 0.8, delay: 0.6 } }>
            <TiltedCardCustom
              containerHeight='256px'
              containerWidth='400px'
              rotateAmplitude={ 1 }
            >
              <SpotlightCard className='mt-[420px] w-96 h-fit md:mt-0 md:w-[400px] md:h-80 shadow-xl' spotlightColor='rgba(0, 229, 255, 0.2)'>
                <div className='card-body'>
                  <h2 className='card-title text-gray-300'>Персонализированная медицина</h2>
                  <ul className='flex flex-col gap-2'>
                    <li className='flex flex-row items-center'>
                      <PiPerson size={ 32 } color='#2adfd3' className='flex-shrink-0' />
                      <span className='text-gray-300 ml-2 text-base'>Учет анатомических особенностей и сопутствующих патологий</span>
                    </li>
                    <li className='flex flex-row items-center'>
                      <BiPulse size={ 32 } color='#2adfd3' className='flex-shrink-0' />
                      <span className='text-gray-300 ml-2 text-base'>Прогноз рисков</span>
                    </li>
                    <li className='flex flex-row items-center'>
                      <PiMagnifyingGlass size={ 32 } color='#2adfd3' className='flex-shrink-0' />
                      <span className='text-gray-300 ml-2 text-base'>Подбор стентов, шунтов и методов вмешательства под конкретного пациента</span>
                    </li>
                  </ul>
                </div>
              </SpotlightCard>
            </TiltedCardCustom>
          </motion.div>

          <motion.div
            initial={ { opacity: 0, y: 30 } }
            animate={ isInView3 ? { opacity: 1, y: 0 } : {} }
            transition={ { duration: 0.8, delay: 1 } }>
            <TiltedCardCustom
              containerHeight='256px'
              containerWidth='400px'
              rotateAmplitude={ 1 }
            >
              <SpotlightCard className='mt-[620px] w-96 h-fit md:mt-0 md:w-[400px] md:h-80 shadow-xl' spotlightColor='rgba(0, 229, 255, 0.2)'>
                <div className='card-body'>
                  <h2 className='card-title text-gray-300'>Удобный инструмент для врачей</h2>
                  <ul className='flex flex-col gap-2'>
                    <li className='flex flex-row items-center'>
                      <PiLightbulb size={ 32 } color='#2adfd3' className='flex-shrink-0' />
                      <span className='text-gray-300 ml-2 text-base'>Подсказки по критичным зонам сосудов во время операции</span>
                    </li>
                    <li className='flex flex-row items-center'>
                      <LuHandHeart size={ 32 } color='#2adfd3' className='flex-shrink-0' />
                      <span className='text-gray-300 ml-2 text-base'>Практика для студентов на реальных клинических случаях</span>
                    </li>
                  </ul>
                </div>
              </SpotlightCard>
            </TiltedCardCustom>
          </motion.div>



        </div>
      </div>

      <div
        ref={ targetRef2 } 
        className='relative bg-gray-100 flex items-center justify-center'
      >
        <div className='container'>

          <ServicesSlider />

        </div>
      </div>


      <div
        ref={ targetRef4 }
        className='relative bg-zinc-800 flex items-center justify-center py-8'
      >
        <div className='container'>

          <motion.h2
            initial={ { opacity: 0 } }
            animate={ isInView4 ?  { opacity: 1 } : {} }
            transition={ { duration: 0.8, delay: 0.2 } }
            className='flex w-full justify-center text-3xl text-gray-100 font-semibold'>
          Команда
          </motion.h2>

          <div className='w-12/12 md:w-10/12 max-w-[1600px] px-6 mx-auto my-8 flex flex-col gap-8'>

            <div className='bg-gray-100 px-4 py-8 rounded-2xl flex flex-row relative flex-wrap'>
              <div className='absolute rounded-2xl h-14 w-3 bg-blue-500' />
              <div className='absolute rounded-2xl h-14 w-3 left-10 bg-blue-500/40' />
              <div className='absolute rounded-2xl h-14 w-3 left-16 bg-blue-500/20' />
              <div className='absolute rounded-2xl h-14 w-3 left-[5.5rem] bg-blue-500/10' />

              <p className='text-neutral sm:text-4xl text-3xl font-bold lg:ml-20 xl:ml-0 lg:mt-auto mb-4 mt-20'>
                Наставники
              </p>
              <div className='flex flex-row flex-wrap gap-12 ml-auto'>
                <CardTeam name='Барулина Марина' role='' img='team/ma.png'/>
                <CardTeam name='Породиков Артем' role='' img='team/artem.png'/>
              </div>
            </div>

            <div className='bg-gray-100 px-4 py-8 rounded-2xl flex flex-row relative flex-wrap'>
              <div className='absolute rounded-2xl h-14 w-3 bg-blue-500/80' />
              <div className='absolute rounded-2xl h-14 w-3 left-10 bg-blue-500' />
              <div className='absolute rounded-2xl h-14 w-3 left-16 bg-blue-500/40' />
              <div className='absolute rounded-2xl h-14 w-3 left-[5.5rem] bg-blue-500/20' />
              <p className='text-neutral sm:text-4xl text-3xl font-bold w-full sm:w-fit lg:ml-20 xl:ml-0 lg:mt-auto mb-4 mt-20'>
              Руководитель
              </p>
              <div className='flex flex-row flex-wrap gap-12 sm:ml-auto'>
                <CardTeam name='Осипов Александр' role='' img='team/alex-o.png'/>
              </div>
            </div>

            <div className='bg-gray-100 px-4 py-8 rounded-2xl flex flex-row relative flex-wrap'>
              <div className='absolute rounded-2xl h-14 w-3 bg-blue-500/40' />
              <div className='absolute rounded-2xl h-14 w-3 left-10 bg-blue-500/60' />
              <div className='absolute rounded-2xl h-14 w-3 left-16 bg-blue-500' />
              <div className='absolute rounded-2xl h-14 w-3 left-[5.5rem] bg-blue-500/80' />


              <p className='text-neutral sm:text-4xl text-3xl font-bold lg:ml-20 xl:ml-0 lg:mt-auto mb-4 mt-20'>
                Разработка
              </p>
              <div className='flex flex-row flex-wrap gap-12 ml-auto'>
                <CardTeam name='Шаров Роман' role='' img='team/roma.png'/>
                <CardTeam name='Аухадиев Михаил' role='' img='team/misha.png'/>
              </div>
            </div>

            <div className='bg-gray-100 px-4 py-8 rounded-2xl flex flex-row relative flex-wrap'>
              <div className='absolute rounded-2xl h-14 w-3 bg-blue-500/40' />
              <div className='absolute rounded-2xl h-14 w-3 left-10 bg-blue-500/60' />
              <div className='absolute rounded-2xl h-14 w-3 left-16 bg-blue-500/80' />
              <div className='absolute rounded-2xl h-14 w-3 left-[5.5rem] bg-blue-500' />

              <p className='text-neutral sm:text-4xl text-3xl font-bold lg:ml-20 xl:ml-0 lg:mt-auto mb-4 mt-20'>
                Искусственный интеллект
              </p>
              <div className='flex flex-row flex-wrap gap-12 ml-auto'>
                <CardTeam name='Бочкарев Владислав' role='' img='team/vlad.png'/>
                <CardTeam name='Усынин Александр' role='' img='team/alex-y.png'/>
              </div>
            </div>
            
            <div className='bg-gray-100 px-4 py-8 rounded-2xl flex flex-row relative flex-wrap'>
              <div className='absolute rounded-2xl h-14 w-3 bg-blue-500/40' />
              <div className='absolute rounded-2xl h-14 w-3 left-10 bg-blue-500/60' />
              <div className='absolute rounded-2xl h-14 w-3 left-16 bg-blue-500/80' />
              <div className='absolute rounded-2xl h-14 w-3 left-[5.5rem] bg-blue-500' />

              <p className='text-neutral sm:text-4xl text-3xl font-bold lg:ml-20 xl:ml-0 lg:mt-auto mb-4 mt-20'>
                Экономика
              </p>
              <div className='flex flex-row flex-wrap gap-12 ml-auto'>
                <CardTeam name='Стрелков Юрий' role='' img='team/yra.jpg'/>
              </div>
            </div>

          </div>

        </div>
      </div>

      <ContactSection isInView6={ isInView6 } targetRef6={ targetRef6 } />

    </main>
  );
}
