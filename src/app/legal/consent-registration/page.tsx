import { ConsentRegistrationContent } from '@/legal/content/consent-registration';
import { legalMetadata } from '@/legal/metadata';

export const metadata = legalMetadata(
  'consentRegistration',
  'Отдельное согласие на обработку персональных данных при регистрации в веб-приложении Cardio Assistant: оператор, цели, данные, действия, срок и порядок отзыва.',
);

export default function ConsentRegistrationPage() {
  return <ConsentRegistrationContent />;
}
