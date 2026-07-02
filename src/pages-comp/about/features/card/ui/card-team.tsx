import Image from 'next/image';

import { prefex } from '@/pages-comp/about/page';

export function CardTeam({
  name,
  role,
  img,
  department,
}: {
  name: string;
  role: string;
  img: string;
  department?: string;
}) {
  return (
    <div className='group flex flex-col items-center text-center'>
      <div className='relative overflow-hidden rounded-2xl ring-1 ring-slate-200 dark:ring-slate-700 transition-all group-hover:ring-blue-300'>
        <Image
          src={ prefex + '/' + img }
          alt={ name }
          width={ 144 }
          height={ 144 }
          className='h-32 w-32 object-cover transition-transform duration-500 group-hover:scale-105 sm:h-36 sm:w-36'
        />
      </div>
      {department && (
        <div className='mt-3 inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-500/15 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-blue-700 dark:text-blue-300 ring-1 ring-blue-100 dark:ring-blue-500/30'>
          {department}
        </div>
      )}
      <div className='mt-2 text-sm font-medium text-slate-900 dark:text-white'>{name}</div>
      {role && <div className='mt-0.5 text-xs text-slate-500 dark:text-slate-400'>{role}</div>}
    </div>
  );
}
