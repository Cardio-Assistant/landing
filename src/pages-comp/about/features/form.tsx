import Link from 'next/link';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

import { LEGAL_DOCS, legalPath } from '@/legal/documents';

import { useI18n } from './i18n/context';

interface FeedbackFormInputs {
  name: string;
  email: string;
  message: string;
  website: string;
  consent: boolean;
}

const FeedbackForm: React.FC = () => {
  const { t } = useI18n();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FeedbackFormInputs>({ defaultValues: { consent: false } });
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // The consent is its own document and its own checkbox (art. 9 of Federal Law 152-FZ):
  // unchecked by default, and nothing is sent until the person ticks it.
  const consent = watch('consent');

  const onSubmit = async (data: FeedbackFormInputs) => {
    if (!data.consent) return;
    setErr(null);
    try {
      const res = await fetch('/api/contact', {
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify({
          name          : data.name,
          email         : data.email,
          message       : data.message,
          website       : data.website,
          consent       : true,
          consentVersion: LEGAL_DOCS.consentContacts.version,
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setErr(j.error || 'Failed to send');
        return;
      }
      reset();
      setSent(true);
      setTimeout(() => setSent(false), 5000);
    } catch (e) {
      console.error(e);
      setErr('Network error');
    }
  };

  const inputBase =
    'mt-1.5 block w-full rounded-xl border bg-white dark:bg-slate-900 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder:text-slate-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20';

  return (
    <div className='rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8'>
      <h3 className='text-lg font-semibold text-slate-900 dark:text-white'>{t.contact.formH}</h3>
      <p className='mt-2 text-sm text-slate-600 dark:text-slate-400'>{t.contact.formS}</p>

      <form onSubmit={ handleSubmit(onSubmit) } className='mt-6 flex flex-col gap-4'>
        {/* honeypot – невидим для людей, заполняется ботами */}
        <input
          type='text'
          tabIndex={ -1 }
          autoComplete='off'
          { ...register('website') }
          className='absolute left-[-9999px] h-0 w-0 opacity-0'
          aria-hidden='true'
        />
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          <div>
            <label className='text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400' htmlFor='name'>
              {t.contact.name}
            </label>
            <input
              id='name'
              type='text'
              placeholder={ t.contact.namePh }
              { ...register('name', { required: t.contact.errName }) }
              className={ `${inputBase} ${errors.name ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 dark:border-slate-700 focus:border-blue-500'}` }
            />
            {errors.name && <p className='mt-1 text-xs text-rose-600'>{errors.name.message}</p>}
          </div>

          <div>
            <label className='text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400' htmlFor='email'>
              {t.contact.contact}
            </label>
            <input
              id='email'
              type='text'
              placeholder={ t.contact.contactPh }
              { ...register('email', { required: t.contact.errCont }) }
              className={ `${inputBase} ${errors.email ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 dark:border-slate-700 focus:border-blue-500'}` }
            />
            {errors.email && <p className='mt-1 text-xs text-rose-600'>{errors.email.message}</p>}
          </div>
        </div>

        <div>
          <label className='text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400' htmlFor='message'>
            {t.contact.message}
          </label>
          <textarea
            id='message'
            rows={ 5 }
            placeholder={ t.contact.messagePh }
            { ...register('message') }
            className={ `${inputBase} resize-none ${errors.message ? 'border-rose-400' : 'border-slate-200 dark:border-slate-700 focus:border-blue-500'}` }
          />
        </div>

        {err && (
          <div className='rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm text-rose-700'>
            {err}
          </div>
        )}

        <div className='pt-2'>
          <div className='flex items-start gap-3'>
            <input
              id='consent'
              type='checkbox'
              className='mt-0.5 h-4 w-4 flex-shrink-0 cursor-pointer rounded border-slate-300 accent-blue-600 dark:border-slate-600'
              aria-invalid={ errors.consent ? 'true' : 'false' }
              { ...register('consent', { required: t.contact.consent.error }) }
            />
            <label htmlFor='consent' className='cursor-pointer text-sm leading-snug text-slate-700 dark:text-slate-300'>
              {t.contact.consent.pre}{' '}
              <Link
                href={ legalPath('consentContacts') }
                target='_blank'
                rel='noopener noreferrer'
                className='font-medium text-blue-700 underline underline-offset-2 hover:text-blue-900 dark:text-blue-300 dark:hover:text-blue-200'
              >
                {t.contact.consent.link}
              </Link>
            </label>
          </div>
          {errors.consent && <p className='mt-1 text-xs text-rose-600'>{errors.consent.message}</p>}
          <p className='mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400'>
            {t.contact.consent.policyPre}{' '}
            <Link
              href={ legalPath('privacy') }
              target='_blank'
              rel='noopener noreferrer'
              className='underline underline-offset-2 hover:text-slate-900 dark:hover:text-white'
            >
              {t.contact.consent.policyLink}
            </Link>.
          </p>
        </div>

        <div className='flex justify-end'>
          <button
            type='submit'
            disabled={ isSubmitting || !consent }
            className='inline-flex flex-shrink-0 items-center justify-center gap-2 rounded-full bg-slate-900 dark:bg-slate-100 px-5 py-2.5 text-sm font-medium text-white dark:text-slate-900 transition-all hover:bg-slate-700 dark:hover:bg-white disabled:cursor-not-allowed disabled:opacity-60'
          >
            { sent
              ? t.contact.sent
              : isSubmitting
                ? t.contact.sending
                : t.contact.submit }
          </button>
        </div>
      </form>
    </div>
  );
};

export default FeedbackForm;
