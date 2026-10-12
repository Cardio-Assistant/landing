import { ConsentContactsContent } from '@/legal/content/consent-contacts';
import { legalMetadata } from '@/legal/metadata';

export const metadata = legalMetadata(
  'consentContacts',
  'Отдельное согласие на обработку персональных данных при отправке формы обратной связи на сайте ai-cardio.ru: оператор, цель, данные, действия, срок и порядок отзыва.',
);

export default function ConsentContactsPage() {
  return <ConsentContactsContent />;
}
