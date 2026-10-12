import { PrivacyContent } from '@/legal/content/privacy';
import { legalMetadata } from '@/legal/metadata';

export const metadata = legalMetadata(
  'privacy',
  'Какие персональные данные обрабатывает ООО «Нексли» на сайте ai-cardio.ru и в веб-приложении Cardio Assistant, зачем, как долго и как их защищает; права субъектов; cookie.',
);

export default function PrivacyPage() {
  return <PrivacyContent />;
}
