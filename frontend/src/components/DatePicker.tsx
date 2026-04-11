import { useState, useMemo } from 'react';

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
}

const MONTHS = [
  { value: '0', label: 'January' },
  { value: '1', label: 'February' },
  { value: '2', label: 'March' },
  { value: '3', label: 'April' },
  { value: '4', label: 'May' },
  { value: '5', label: 'June' },
  { value: '6', label: 'July' },
  { value: '7', label: 'August' },
  { value: '8', label: 'September' },
  { value: '9', label: 'October' },
  { value: '10', label: 'November' },
  { value: '11', label: 'December' },
];

export default function DatePicker({ value, onChange }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const currentDate = useMemo(() => {
    if (!value) {
      const now = new Date();
      now.setDate(now.getDate() + 1);
      return now;
    }
    return new Date(value);
  }, []);

  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedDay, setSelectedDay] = useState(currentDate.getDate());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 10 }, (_, i) => currentYear + i);
  }, []);

  const daysInMonth = useMemo(() => {
    return new Date(selectedYear, selectedMonth + 1, 0).getDate();
  }, [selectedYear, selectedMonth]);

  const updateDate = (month: number, day: number, year: number) => {
    const date = new Date(year, month, day, 12, 0, 0, 0);
    onChange(date.toISOString().slice(0, 16));
  };

  const handleMonthChange = (month: number) => {
    setSelectedMonth(month);
    const maxDay = new Date(selectedYear, month + 1, 0).getDate();
    const newDay = Math.min(selectedDay, maxDay);
    setSelectedDay(newDay);
    updateDate(month, newDay, selectedYear);
  };

  const handleDayChange = (day: number) => {
    setSelectedDay(day);
    updateDate(selectedMonth, day, selectedYear);
  };

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    const maxDay = new Date(year, selectedMonth + 1, 0).getDate();
    const newDay = Math.min(selectedDay, maxDay);
    setSelectedDay(newDay);
    updateDate(selectedMonth, newDay, year);
  };

  const formatDisplayDate = () => {
    if (!value) return 'Select date';
    const date = new Date(value);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-left hover:border-purple-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all flex items-center justify-between"
      >
        <span className={value ? 'text-gray-900' : 'text-gray-400'}>
          {formatDisplayDate()}
        </span>
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-200 p-4 z-20">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-2">Month</label>
                <div className="grid grid-cols-3 gap-1">
                  {MONTHS.slice(0, 6).map((month) => (
                    <button
                      key={month.value}
                      type="button"
                      onClick={() => handleMonthChange(parseInt(month.value))}
                      className={`py-2 px-1 text-xs rounded-lg transition ${
                        selectedMonth === parseInt(month.value)
                          ? 'bg-purple-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-purple-100'
                      }`}
                    >
                      {month.label.slice(0, 3)}
                    </button>
                  ))}
                  {MONTHS.slice(6, 12).map((month) => (
                    <button
                      key={month.value}
                      type="button"
                      onClick={() => handleMonthChange(parseInt(month.value))}
                      className={`py-2 px-1 text-xs rounded-lg transition ${
                        selectedMonth === parseInt(month.value)
                          ? 'bg-purple-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-purple-100'
                      }`}
                    >
                      {month.label.slice(0, 3)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-2">Year</label>
                <div className="grid grid-cols-2 gap-1 max-h-32 overflow-y-auto">
                  {years.map((year) => (
                    <button
                      key={year}
                      type="button"
                      onClick={() => handleYearChange(year)}
                      className={`py-2 text-xs rounded-lg transition ${
                        selectedYear === year
                          ? 'bg-purple-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-purple-100'
                      }`}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-500 mb-2">Day</label>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleDayChange(day)}
                    className={`aspect-square flex items-center justify-center text-sm rounded-lg transition ${
                      selectedDay === day
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-purple-100'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-full mt-2 py-2 bg-purple-500 text-white rounded-xl font-medium hover:bg-purple-600 transition"
            >
              Done
            </button>
          </div>
        </>
      )}
    </div>
  );
}
