import { motion } from 'framer-motion';


type CardProps = {
    isInView: boolean;
    title?: string;
    text?: string
}



export function AnimCard({
  isInView,
  title,
  text
}: CardProps) {
  return (
    <div className='relative w-[450px] h-32'>
      <motion.div
        initial={ { opacity: 0, x: 20 } }
        animate={ isInView ? { opacity: 1, x: 0 } : {} }
        transition={ { duration: 0.8, delay: 0.2 } }
        className='z-20 absolute card glass w-full h-full shadow-lg'
      >
        <div className='card-body'>
          <h2 className='card-title text-blue-500'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-8 w-8 text-cyan-400'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={ 2 }
                d='M13 10V3L4 14h7v7l9-11h-7z'
              />
            </svg>
            {title}</h2>
          <p className='text-black'>{text}</p>
        </div>
      </motion.div>
      <motion.span
        initial={ { opacity: 0, x: 0 } }
        animate={ isInView ? { opacity: 1, x: 5 } : {} }
        transition={ { duration: 0.8, delay: 1 } }            
        className='absolute left-2 top-2 rounded-full bg-gradient-to-l from-cyan-400 to-blue-500 w-16 h-16'/>
      <motion.span
        initial={ { opacity: 0, x: 0 } }
        animate={ isInView ? { opacity: 1, x: -10 } : {} }
        transition={ { duration: 0.8, delay: 1 } }  
        className='absolute right-2 bottom-2 rounded-full bg-gradient-to-l from-cyan-400 to-blue-500 w-16 h-16'/>
    </div>
  );
}