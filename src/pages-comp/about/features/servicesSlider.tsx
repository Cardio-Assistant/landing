'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import type { ReactNode } from 'react';

interface Service {
  title: string;
  category: string;
  content: ReactNode;
}

const services: Service[] = [
  {
    title   : 'Растущий рынок цифровой медицины',
    category: 'Рынок роста',
    content : <div>
      <ul className='prose text-neutral-900'>
        <li>
          <span className='font-semibold'>Динамика роста:</span> Рынок ИИ в медицине растет на 20-30% ежегодно — к 2032 году планируется  увеличение в 9 раз.
        </li>
        <li>
          <span className='font-semibold'>Локальный и глобальный охват:</span> Фокус на России - Уже 100 клиник с потенциалом выручки 60 млн ₽/год только на подписках и перспектива выхода на международные рынки.
        </li>
        <li>
          <span className='font-semibold'>Нишевая специализация:</span> Уникальное решение для кардиохирургии, где спрос на предиктивную аналитику постепенно набирает обороты.
        </li>
      </ul>
    </div>
  },
  {
    title   : 'Будущие клиенты продукта',
    category: 'Клиенты',
    content : <div>
      <ul className='prose text-neutral-900'>
        <li>
          <span className='font-semibold'>Крупные кардиоцентры:</span> Клиники с высоким потоком сложных операций, где критична точность планирования.
        </li>
        <li>
          <span className='font-semibold'>Региональные больницы:</span> Учреждения, нуждающиеся в удаленной экспертной поддержке и снижении рисков.
        </li>
        <li>
          <span className='font-semibold'>Медицинские вузы:</span> Инструмент для обучения студентов через симуляцию реальных клинических случаев.
        </li>
        <li>
          <span className='font-semibold'>Производители оборудования:</span> Партнеры, заинтересованные в интеграции ИИ-решений в свои системы.
        </li>
      </ul>
    </div>
  },
  {
    title   : 'Возможности монетизация продукта',
    category: 'Монетизация продукта',
    content : <div>
      <ul className='prose text-neutral-900'>
        <li>
          <span className='font-semibold'>Подписка для клиник:</span> Доступ к платформе с регулярными обновлениями и поддержкой.
        </li>
        <li>
          <span className='font-semibold'>Лицензии:</span> Кастомизированные пакеты под задачи учреждений.
        </li>
        <li>
          <span className='font-semibold'>Образовательные программы:</span> Доступ к симуляторам для вузов и курсов повышения квалификации.
        </li>
        <li>
          <span className='font-semibold'>Технологические партнерства:</span> Совместные решения с производителями медоборудования.
        </li>
        <span className='font-semibold'>Устойчивая прибыль за счет диверсификации потоков.</span>
      </ul>
    </div>
  },
  {
    title   : 'Ищем инвестиции',
    category: 'Инвесторам',
    content : <div>
      <ul className='prose text-neutral-900'>
        <li>
          <span className='font-semibold'>Высокая рентабельность:</span> по прогнозам 111 млн ₽ к 2027 году с чистой прибылью 56 млн ₽.
        </li>
        <li>
          <span className='font-semibold'>Рентабельность:</span> IRR 921%, индекс прибыльности 3.49.
        </li>
        <li>
          <span className='font-semibold'>Социальная значимость:</span> Участие в снижении смертности от сердечно-сосудистых заболеваний — первой причины смертности в мире.
        </li>
        <li>
          <span className='font-semibold'>Стратегия выхода:</span> План выхода на IPO через 3-4 года с фокусом на глобальную экспансию.
        </li>
        <span className='font-semibold'>
          Инвестиции в технологию, которая спасает жизни и приносит доход.</span>
      </ul>
    </div>
  },
];

export default function ServicesSlider() {
  const [activeService, setActiveService] = useState<number>(0);

  const handleScroll = (direction: 'left' | 'right') => {
    setActiveService((prev) => {
      if (direction === 'left' && prev > 0) return prev - 1;
      if (direction === 'right' && prev < services.length - 1) return prev + 1;
      return prev;
    });
  };

  return (
    <div className='w-12/12 md:w-10/12 max-w-[1600px] px-6 mx-auto mt-8 '>
      {/* Navigation */}
      <div className='w-full flex items-center justify-between'>
        <button 
          onClick={ () => handleScroll('left') } 
          disabled={ activeService === 0 } 
          className={ `text-neutral-900 hover:scale-105 ${activeService === 0 ? 'opacity-50 cursor-not-allowed' : ''}` }
        >
          <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='size-8'>
            <path fillRule='evenodd' d='M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-4.28 9.22a.75.75 0 0 0 0 1.06l3 3a.75.75 0 1 0 1.06-1.06l-1.72-1.72h5.69a.75.75 0 0 0 0-1.5h-5.69l1.72-1.72a.75.75 0 0 0-1.06-1.06l-3 3Z' clipRule='evenodd' />
          </svg>
        </button>
        <ul className='flex items-center gap-8 px-2 overflow-auto'>
          {services.map((service, index) => (
            <li key={ service.category } className='relative pb-[6px]'>
              <button
                className={ `whitespace-nowrap hover:scale-105 ${activeService === index ? 'text-gray-900' : 'text-gray-400'}` }
                onClick={ () => setActiveService(index) }
              >
                {service.category}
              </button>
              {activeService === index && (
                <motion.span layoutId='underline' className='h-[3px] w-full absolute left-0 bottom-0 bg-gray-600' />
              )}
            </li>
          ))}
        </ul>
        <button 
          onClick={ () => handleScroll('right') } 
          disabled={ activeService === services.length - 1 } 
          className={ `text-neutral-900 hover:scale-105 ${activeService === services.length - 1 ? 'opacity-50 cursor-not-allowed' : ''}` }
        >
          <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='size-8'>
            <path fillRule='evenodd' d='M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm4.28 10.28a.75.75 0 0 0 0-1.06l-3-3a.75.75 0 1 0-1.06 1.06l1.72 1.72H8.25a.75.75 0 0 0 0 1.5h5.69l-1.72 1.72a.75.75 0 1 0 1.06 1.06l3-3Z' clipRule='evenodd' />
          </svg>
        </button>
      </div>

      {/* Slider */}
      <div className='relative h-[800px] md:h-[600px] lg:-mx-10 overflow-hidden'>
        <AnimatePresence initial={ false } custom={ activeService }>
          <motion.div
            key={ activeService }
            initial={ { opacity: 0, x: 100 } }
            animate={ { opacity: 1, x: 0 } }
            exit={ { opacity: 0, x: -100 } }
            transition={ { type: 'spring', stiffness: 300, damping: 30 } }
            drag='x'
            dragConstraints={ { left: 0, right: 0 } }
            onDragEnd={ (event, info) => {
              if (info.offset.x > 50) handleScroll('left');
              if (info.offset.x < -50) handleScroll('right');
            } }
            className='absolute w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing'
          >
            <div className='flex flex-col lg:flex-row overflow-hidden bg-white rounded-[28px] cursor-grab max-w-[85vw] md:max-w-[70vw] shadow-xl'>
              {/* Content */}
              <div className='flex-1 p-6 md:p-12 lg:p-16 min-h-[200px] md:min-h-[500px]'>
                <h2 className='text-2xl md:text-3xl lg:text-4xl text-gray-900'>
                  {services[activeService].title}
                </h2>
                <div className='mt-4 lg:mt-6 text-sm lg:text-base text-gray-900 prose'>
                  {services[activeService].content}
                </div>
              </div>
              
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
