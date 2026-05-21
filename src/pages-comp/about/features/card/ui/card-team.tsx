import { prefex } from '@/pages-comp/about/page';

import TiltedCard from '../../tiltedCard';






export function CardTeam({ name, role, img }:{name:string, role:string, img:string}) {
  return (
    <TiltedCard
      imageSrc={ prefex + '/' + img }
      altText=''
      captionText=''
      containerHeight='200px'
      containerWidth='200px'
      imageHeight='200px'
      imageWidth='200px'
      rotateAmplitude={ 0 }
      scaleOnHover={ 1 }
      showMobileWarning={ false }
      showTooltip={ false }
      displayOverlayContent={ true }
      overlayContent={
        <p className='p-2 text-gray-100'>
          <span className='bg-neutral-800/80 p-2 px-4 rounded-2xl flex flex-col w-full'>
            <span>
              {name}
            </span>
            <span className='text-sm text-cyan-100'>
              {role}
            </span>
          </span>
        </p>
      }
    />
  );
}