import React from 'react';
import Header from './TaskHeader';
import { useAlarm } from "../hooks/useAlarm";
import { markNotificationsAsRead } from "../api/alarmApi";
import { useQueryClient } from "@tanstack/react-query";

interface RenderedNotification {
  project: string;
  task?: string;
  date: string;
  message: string;
  category: string;
  isRead: boolean;
  noticeType: string;
}

const Alarm: React.FC = () => {
  const { data: alarms = [], setHasUnread, isLoading } = useAlarm(true);
  const queryClient = useQueryClient();

  const handleMarkAllAsRead = async () => {
    try {
      const unreadIds = alarms
        .filter((alarm) => !alarm.isRead)
        .map((alarm) => alarm.id);

      if (unreadIds.length === 0) return;
      console.log("보낼 id", unreadIds);

      await markNotificationsAsRead(unreadIds);
      queryClient.invalidateQueries(["alarms"]); // 새로고침
      setHasUnread(false);
    } catch (err) {
      console.error("읽음 처리 실패", err);
    }
  };


  if (isLoading) return <div className="p-4">불러오는 중...</div>;

  const grouped = alarms.reduce<Record<string, RenderedNotification[]>>((acc, cur) => {
    const todayDate = new Date().toISOString().slice(0, 10); // '2025-06-02'
    const createdDate = cur.createdAt.slice(0, 10); // 예: '2025-06-01'
    const dateA = new Date(todayDate);
    const dateB = new Date(createdDate);

    const daysDiff = Math.floor((+dateA - +dateB) / (1000 * 60 * 60 * 24));
    
    let category = "오늘";
    if (daysDiff === 1) category = "어제";
    else if (daysDiff === 2) category = "2일 전";
    else if (daysDiff >= 3) category = `${daysDiff}일 전`;

    const transformed: RenderedNotification  = {
      project: cur.projectTitle,
      task: cur.taskTitle,
      date: cur.createdAt.slice(0, 10),
      message: cur.message,
      category,
      isRead: cur.isRead,
      noticeType: cur.noticeType,
    };

    if (!acc[category]) acc[category] = [];
    acc[category].push(transformed);
    return acc;
  }, {});

  return (
    <div className="flex h-full bg-white pl-2 pt-[3rem]">
      <div
        className="w-full h-full relative bg-[#F8F9FC] rounded-tl-lg overflow-auto shadow-[inset_0px_0px_8px_rgba(26,26,35,0.12)]">
        <Header title="알림 센터" />

        <div className="p-[48px]">
          {Object.entries(grouped).map(([category, items], i) => (
            <div key={category} className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[#4F5462] font-semibold text-base">{category}</h3>
                {i === 0 && (
                  <button
                    onClick={handleMarkAllAsRead} 
                    className="text-sm text-[#949BAD] hover:underline"
                  >
                    전체 읽음
                  </button>
                )}
              </div>
              <div className="flex flex-col gap-3">
                {items.map((item, idx) => (
                  <div
                    key={idx}
                    className={`bg-white rounded-xl px-6 py-4 shadow-sm border border-[#E5EAF2] text-sm ${
                      item.isRead ? "opacity-60" : ""
                    }`}
                  >
                    <div className="flex justify-between mb-1">
                      <div className="text-[#FF432B] font-semibold">
                        {item.project}
                        {item.task && (
                          <>
                            &nbsp;&gt;&nbsp;
                            <span className="text-[#4F5462] font-medium">{item.task}</span>
                          </>
                        )}
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