import { useEffect, useState  } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { EventSourcePolyfill } from "event-source-polyfill";
import {fetchAlarmList} from "../api/alarmApi"

export interface Notification {
  id: string;
  projectId: string;
  taskId: string;
  projectTitle: string;
  taskTitle?: string;
  message: string;
  noticeType: string;
  isRead: boolean;
  createdAt: string;
  notificationId: string;
}

// 읽음 상태 전역 관리
let globalHasUnread = false;
let listeners: ((value: boolean) => void)[] = [];

export const useAlarm = (enabled: boolean) => {
  const queryClient = useQueryClient();
  const [hasUnread, setHasUnread] = useState(globalHasUnread);

  const update = (value: boolean) => {
    globalHasUnread = value;
    listeners.forEach((fn) => fn(value));
  };

  useEffect(() => {
    listeners.push(setHasUnread);
    return () => {
      listeners = listeners.filter((fn) => fn !== setHasUnread);
    };
  }, []);

  // SSE 구독
  useEffect(() => {
    if (!enabled) return;

    const token = localStorage.getItem("accessToken");
    if (!token) return;

    const source = new EventSourcePolyfill("https://aether.asia/sse/subscribe", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Last-Event-ID": localStorage.getItem("lastEventId") || "",
      },
      withCredentials: true,
    });

    // 연결 상태 확인
    source.addEventListener("connect", (e) => {
      console.log("연결:", e.data);
    });

    // 새로운 알림
    source.addEventListener("notification", (e) => {
      const id = e.data;
      console.log("새 알림 :", id);
      update(true);
      queryClient.invalidateQueries(["alarms"]);
    });

    // 새로운 공지
    source.addEventListener("notice", (e) => {
      
      const noticeId = e.data;
      console.log("새 공지:", noticeId);
    });

    // 클라이언트 타임아웃 방지
    source.addEventListener("keep_alive", (e) => {
      console.log("keep_alive 수신", e.data);
    });

    source.onerror = (err) => {
      console.error("SSE 에러:", err);
      source.close();
    };

    return () => {
      source.close();
    };
  }, [enabled]);


  // 알람 상세 조회
  const query = useQuery<Notification[]>({
    queryKey: ["alarms"],
    queryFn: fetchAlarmList,
    enabled,
    refetchOnWindowFocus: false,
  });

  return {
    ...query,
    hasUnread,
    setHasUnread: update,
  };
};
