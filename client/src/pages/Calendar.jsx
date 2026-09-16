import { ChevronLeft, ChevronRight } from 'lucide-react';

const Calendar = () => {
  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const dates = Array.from({ length: 35 }, (_, i) => i + 1); // Mock calendar grid

  return (
    <div className="text-gray-300">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Content Calendar</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 flex items-center justify-center rounded bg-[#1a1a24] hover:bg-[#252536] transition-colors"><ChevronLeft size={16} /></button>
            <span className="text-lg font-bold text-white w-40 text-center">September 2026</span>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-[#1a1a24] hover:bg-[#252536] transition-colors"><ChevronRight size={16} /></button>
          </div>
          <div className="flex bg-[#111116] p-1 rounded-lg border border-[#1f1f2e]">
            <button className="px-4 py-1.5 text-sm font-medium rounded-md bg-[#2d2d3f] text-white">Month</button>
            <button className="px-4 py-1.5 text-sm font-medium rounded-md text-gray-400 hover:text-white transition-colors">Week</button>
            <button className="px-4 py-1.5 text-sm font-medium rounded-md text-gray-400 hover:text-white transition-colors">Day</button>
          </div>
        </div>
      </div>

      <div className="bg-[#111116] border border-[#1f1f2e] rounded-xl overflow-hidden flex flex-col">
        <div className="grid grid-cols-7 border-b border-[#1f1f2e]">
          {days.map((day) => (
            <div key={day} className="py-4 text-center text-xs font-semibold text-gray-500 tracking-widest">{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 grid-rows-5 flex-1 min-h-[600px]">
          {dates.map((date) => (
            <div key={date} className="border-b border-r border-[#1f1f2e] p-2 hover:bg-[#1a1a24]/50 transition-colors cursor-pointer">
              <span className={`text-sm ${date === 15 ? 'bg-indigo-500 text-white w-6 h-6 rounded-full flex items-center justify-center' : 'text-gray-500 ml-1 mt-1 block'}`}>
                {date > 30 ? date - 30 : date}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
