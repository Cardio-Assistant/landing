import Image from 'next/image';

import iconAi from '@/../public/iconAiNoTitile.svg';

export function IconAiCardio() {
  return (
    <Image
      src={ iconAi }
      width={ 40 }
      alt=''
    />
  );
}