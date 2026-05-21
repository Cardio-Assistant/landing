import Image from 'next/image';

import iconAi from '@/../public/iconAiNoTitile.svg';

export function Icon() {
  return (
    <Image
      src={ iconAi }
      width={ 200 }
      alt=''
    />
  );
}