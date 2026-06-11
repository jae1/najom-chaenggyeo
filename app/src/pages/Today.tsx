import React from 'react';
import DailyHealthForm from '../components/DailyHealthForm';
import SkinCareForm from '../components/SkinCareForm';
import PushNotificationPrompt from '../components/PushNotificationPrompt';

const Today: React.FC = () => {
  return (
    <div className="pb-24 pt-4">
      <header className="py-6 px-2">
        <h1 className="text-3xl font-black text-gray-900 leading-tight">
          오늘의 나,<br/>
          <span className="text-primary-500">잘 챙기고 있나요?</span>
        </h1>
        <p className="text-gray-500 mt-2 font-medium">
          {new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
        </p>
      </header>

      <PushNotificationPrompt />

      <section className="bg-white rounded-[2.5rem] p-8 shadow-sm mb-8 border border-pink-50">
        <h2 className="text-xl font-bold mb-6 flex items-center text-gray-800">
          <span className="w-2 h-7 bg-pink-400 rounded-full mr-3"></span>
          데일리 건강
        </h2>
        <DailyHealthForm />
      </section>

      <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-blue-50">
        <h2 className="text-xl font-bold mb-6 flex items-center text-gray-800">
          <span className="w-2 h-7 bg-blue-300 rounded-full mr-3"></span>
          스킨 케어
        </h2>
        <SkinCareForm />
      </section>
    </div>
  );
};

export default Today;
