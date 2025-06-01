import React from 'react';
import Header from './TaskHeader';
import { useAlarm, Notification } from "../hooks/useAlarm";

interface RenderedNotification {
  project: string;
  task: string;
  date: string;
  message: string;
  category: string;
}

const Alarm: React.FC = () => {
  const { data: alarms = [], isLoading } = useAlarm(true);

  if (isLoading) return <div className="p-4">불러오는 중...</div>;

  const grouped = alarms.reduce<Record<string, RenderedNotification[]>>((acc, cur) => {
    const createdDate = new Date(cur.createdAt);
    const today = new Date();
    const daysDiff = Math.floor((+today - +createdDate) / (1000 * 60 * 60 * 24));

    let category = "오늘";
    if (daysDiff === 1) category = "어제";
    else if (daysDiff === 2) category = "2일 전";
    else if (daysDiff >= 3) category = `${daysDiff}일 전`;

    const transformed: RenderedNotification  = {
      project: cur.projectTitle,
      task: cur.taskTitle ?? "업무 없음",
      date: cur.createdAt.slice(0, 10),
      message: cur.message,
      category,
    };

    if (!acc[category]) acc[category] = [];
    acc[category].push(transformed);
    return acc;
  }, {});

  return (
    <div className="flex h-full bg-white pl-2 pt-[3rem]">
      <div
        className="w-full h-full relative bg-[#F8F9FC] rounded-tl-lg overflow-auto shadow-[inset_0px_0px_8px_rgba(26,26,35,0.12)]">
        <Header title="업무 생성" />

        <div className="p-[48px]">
          {Object.entries(grouped).map(([category, items], i) => (
            <div key={category} className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[#4F5462] font-semibold text-base">{category}</h3>
                {i === 0 && (
                  <button className="text-sm text-[#949BAD] hover:underline">전체 읽음</button>
                )}
              </div>
              <div className="flex flex-col gap-3">
                {items.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-xl px-6 py-4 shadow-sm border border-[#E5EAF2] text-sm"
                  >
                    <div className="flex justify-between mb-1">
                      <div className="text-[#FF432B] font-semibold">
                        {item.project} &nbsp;&gt;&nbsp;
                        <span className="text-[#4F5462] font-medium">{item.task}</span>
                      </div>
                      <div className="text-[#949BAD]">{item.date}</div>
                    </div>
                    <div className="text-[#4F5462]">{item.message}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Alarm;