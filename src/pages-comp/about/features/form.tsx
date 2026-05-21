import React from 'react';
import { useForm } from 'react-hook-form';

interface FeedbackFormInputs {
  name: string;
  email: string;
  message: string;
}

const FeedbackForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FeedbackFormInputs>();

  const onSubmit = async (data: FeedbackFormInputs) => {
    //console.log(data);

    const name = data.name;
    const email = data.email;
    const text = data.message;

    const response = await fetch('https://cardioai.ru/api/landing/add', {
      method : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify({
        name,
        text,
        email
      })
    });
    
    reset();

    console.log(response.ok);
  };

  return (
    <div className='md:w-[600px] p-8  rounded-2xl'>
      <form onSubmit={ handleSubmit(onSubmit) }>

        <div className='flex flex-row gap-4 mb-4 flex-wrap'>
          <div className='w-full'>
            <label className='block text-gray-700' htmlFor='name'>Ваше имя</label>
            <input
              id='name'
              type='text'
              { ...register('name', { required: ' Заполните имя' }) }
              className={ `text-neutral focus:text-neutral bg-white focus:bg-white mt-1 block w-full border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md p-2` }
            />
            {errors.name && <p className='text-red-500 text-sm'>{errors.name.message}</p>}
          </div>

          <div className='w-full'>
            <label className='block text-gray-700' htmlFor='email'>Email или/и телефон</label>
            <input
              id='email'
              type='text'
              { ...register('email', { required: ' Напишите почту или телефон' }) }
              className={ `text-neutral focus:text-neutral bg-white focus:bg-white mt-1 block w-full border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md p-2` }
            />
            {errors.email && <p className='text-red-500 text-sm'>{errors.email.message}</p>}
          </div>
        </div>

        <div className='mb-4'>
          <label className='block text-gray-700' htmlFor='message'>Сообщение</label>
          <textarea
            id='message'
            { ...register('message') }
            rows={ 4 }
            className={ `focus:border-neutral focus:outline-none textarea textarea-ghost text-neutral focus:text-neutral bg-white focus:bg-white mt-1 block w-full border ${errors.message ? 'border-red-500' : 'border-gray-300'} rounded-md p-2` }
          />
          {errors.message && <p className='text-red-500 text-sm'>{errors.message.message}</p>}
        </div>

        <button type='submit' className='btn rounded-2xl text-lg btn-outline bg-success text-white'>
          Отправить
        </button>
      </form>
    </div>
  );
};

export default FeedbackForm;
