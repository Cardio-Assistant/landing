import { motion } from 'framer-motion';
import React, { useMemo } from 'react';

import type { RefObject } from 'react';

/**
 * Компонент круговой диаграммы.
 * @param {number} percentage - Процент заливки (0-100).
 * @param {string} label - Основное значение (например, "20 млн").
 * @param {string} sublabel - Подпись или описание под диаграммой.
 */
function CircleChart({ percentage, label, sublabel }:{ percentage:number, label:string, sublabel:string }) {
  const radius = 48; // Радиус круга
  const circumference = 2 * Math.PI * radius; // Длина окружности
  const progress = useMemo(() => (percentage / 100) * circumference, [percentage, circumference]);
  const offset = useMemo(() => circumference - progress, [progress, circumference]);

  return (
    <div className='flex flex-col items-center justify-center gap-2'>
      {/* Обёртка для размещения диаграммы и текста в центре */}
      <div className='relative w-32 h-32'>
        <svg
          width={ 128 }
          height={ 128 }
          viewBox='0 0 128 128'
          className='transform -rotate-90'
        >
          {/* Задний серый круг (фон) */}
          <circle
            className='text-gray-300'
            strokeWidth='10'
            stroke='currentColor'
            fill='transparent'
            r={ radius }
            cx={ 64 }
            cy={ 64 }
          />
          {/* Цветной круг (прогресс) */}
          <circle
            className='text-blue-600 transition-all duration-300'
            strokeWidth='10'
            strokeLinecap='round'
            stroke='currentColor'
            fill='transparent'
            r={ radius }
            cx={ 64 }
            cy={ 64 }
            strokeDasharray={ circumference }
            strokeDashoffset={ offset }
          />
        </svg>
        {/* Текст в центре диаграммы */}
        <div className='absolute inset-0 flex flex-col items-center justify-center transform'>
          <span className='text-xl font-bold text-blue-600'>{label}</span>
        </div>
      </div>
      <p className='text-center text-gray-700 leading-snug'>{sublabel}</p>
    </div>
  );
}


export function ProblemBlock({ targetRef, isInView }: {targetRef: RefObject<HTMLDivElement>, isInView: boolean}) {
  return (
    <section ref={ targetRef } className='bg-white py-16 px-4 md:px-16'>
      <div className='max-w-6xl mx-auto'>
        {/* Заголовок */}
        <motion.h2
          initial={ { opacity: 0, y: 20 } }
          animate={ isInView ? { opacity: 1, y: 0 } : {} }
          transition={ { duration: 0.6 } }
          className='text-3xl font-semibold text-gray-900 text-center'
        >
              Сердечно-сосудистые заболевания — проблема
        </motion.h2>
    
        {/* Первая строка с тремя круговыми диаграммами */}
        <div className='mt-10 grid grid-cols-1 md:grid-cols-3 gap-8'>
          <motion.div
            initial={ { opacity: 0, y: 20 } }
            animate={ isInView ? { opacity: 1, y: 0 } : {} }
            transition={ { duration: 0.6, delay: 0.2 } }
          >
            <CircleChart
              percentage={ 30 }
              label='20 млн'
              sublabel='30% смертей в мире'
            />
          </motion.div>
    
          <motion.div
            initial={ { opacity: 0, y: 20 } }
            animate={ isInView ? { opacity: 1, y: 0 } : {} }
            transition={ { duration: 0.6, delay: 0.3 } }
          >
            <CircleChart
              percentage={ 50 }
              label='800 тыс'
              sublabel='50% смертей в России'
            />
          </motion.div>
    
          <motion.div
            initial={ { opacity: 0, y: 20 } }
            animate={ isInView ? { opacity: 1, y: 0 } : {} }
            transition={ { duration: 0.6, delay: 0.4 } }
          >
            <CircleChart
              percentage={ 0 }
              label='0'
              sublabel='Нет готовых решений для персонализированной медицины'
            />
          </motion.div>
        </div>
    
        {/* Дополнительные тезисы (как пример) */}
        <div className='mt-12 grid grid-cols-1 md:grid-cols-3 gap-8'>
          <motion.div
            initial={ { opacity: 0, y: 20 } }
            animate={ isInView ? { opacity: 1, y: 0 } : {} }
            transition={ { duration: 0.6, delay: 0.5 } }
            className='flex flex-col items-center md:items-start bg-gray-50 p-6 rounded-xl shadow-sm'
          >
            <h3 className='text-base font-semibold text-gray-800 mb-2'>
                  Зависимость от опыта врача
            </h3>
            <p className='text-gray-600 leading-relaxed'>
                  Качество диагностики и лечения напрямую зависит от квалификации и опыта специалиста.
            </p>
          </motion.div>
    
          <motion.div
            initial={ { opacity: 0, y: 20 } }
            animate={ isInView ? { opacity: 1, y: 0 } : {} }
            transition={ { duration: 0.6, delay: 0.6 } }
            className='flex flex-col items-center md:items-start bg-gray-50 p-6 rounded-xl shadow-sm'
          >
            <h3 className='text-base font-semibold text-gray-800 mb-2'>
                  Невозможность точного прогнозирования
            </h3>
            <p className='text-gray-600 leading-relaxed'>
                  Нет инструментов для моделирования кровотока и анализа рисков осложнений с учётом особенностей пациента.
            </p>
          </motion.div>
    
          <motion.div
            initial={ { opacity: 0, y: 20 } }
            animate={ isInView ? { opacity: 1, y: 0 } : {} }
            transition={ { duration: 0.6, delay: 0.7 } }
            className='flex flex-col items-center md:items-start bg-gray-50 p-6 rounded-xl shadow-sm'
          >
            <h3 className='text-base font-semibold text-gray-800 mb-2'>
                  Много времени на подготовку
            </h3>
            <p className='text-gray-600 leading-relaxed'>
                  Отсутствие интеллектуальных систем для кардиохирургов усложняет принятие решений и увеличивает время подготовки.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}