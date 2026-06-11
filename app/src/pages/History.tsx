import { useHistory } from '../hooks/useHistory';
import HealthCharts from '../components/HealthCharts';
import { Calendar, ChevronRight, Droplets, Dumbbell, Scale, Sparkles, Moon } from 'lucide-react';

const History = () => {
  const { history, loading } = useHistory();

  if (loading) {
    return <div className="flex items-center justify-center h-[60vh]">기록 불러오는 중...</div>;
  }

  return (
    <div className="pb-24 pt-4">
      <header className="py-6 px-2">
        <h1 className="text-3xl font-black text-gray-900 leading-tight">
          나의 <span className="text-primary-500">기록들</span>
        </h1>
        <p className="text-gray-500 mt-2 font-medium">지금까지의 변화를 확인해보세요.</p>
      </header>

      {/* Charts Section */}
      {history.length > 0 && <HealthCharts data={history} />}

      <h2 className="text-lg font-bold text-gray-800 mb-4 px-2">상세 기록 리스트</h2>
      <div className="space-y-4 px-1">
        {history.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center text-gray-400 border border-dashed border-gray-200">
            아직 기록이 없습니다.<br/>오늘의 나를 먼저 챙겨보세요!
          </div>
        ) : (
          history.map((item) => (
            <div key={item.date} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-50">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center font-bold text-gray-800">
                  <Calendar size={18} className="text-primary-400 mr-2" />
                  {new Date(item.date).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' })}
                </div>
                <div className="flex items-center">
                   {item.health?.period && <span className="mr-2 text-xs">🩸</span>}
                   <ChevronRight size={18} className="text-gray-300" />
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {item.health && (
                  <>
                    {item.health.weight && (
                      <div className="flex items-center bg-pink-50 text-pink-700 px-3 py-1 rounded-full text-xs font-semibold">
                        <Scale size={12} className="mr-1" /> {item.health.weight}kg
                      </div>
                    )}
                    {item.health.water_intake > 0 && (
                      <div className="flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                        <Droplets size={12} className="mr-1" /> {item.health.water_intake}ml
                      </div>
                    )}
                    {item.health.sleep_hours && (
                      <div className="flex items-center bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-semibold">
                        <Moon size={12} className="mr-1" /> {item.health.sleep_hours}h
                      </div>
                    )}
                    {item.health.exercise_done && (
                      <div className="flex items-center bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                        <Dumbbell size={12} className="mr-1" /> 운동
                      </div>
                    )}
                  </>
                )}
                {item.skin && (
                  <>
                    {(item.skin.gua_sha || item.skin.face_yoga || item.skin.scalp || item.skin.ems) && (
                      <div className="flex items-center bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold">
                        <Sparkles size={12} className="mr-1" /> 스킨케어
                      </div>
                    )}
                  </>
                )}
                {item.health?.condition && (
                  <div className="text-lg ml-auto">
                    {item.health.condition === 1 ? '😫' : item.health.condition === 2 ? '😕' : item.health.condition === 3 ? '😐' : item.health.condition === 4 ? '😊' : '🤩'}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default History;
