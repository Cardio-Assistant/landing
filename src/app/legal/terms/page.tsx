import { TermsContent } from '@/legal/content/terms';
import { legalMetadata } from '@/legal/metadata';

export const metadata = legalMetadata(
  'terms',
  'Условия использования веб-приложения Cardio Assistant: статус рабочего прототипа, обязанности пользователя, права на сервис, ограничение ответственности.',
);

export default function TermsPage() {
  return <TermsContent />;
}
