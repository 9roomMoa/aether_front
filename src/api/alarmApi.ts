import {axiosInstance} from "../api/lib/axios";

// 알림 상세 조회
export const fetchAlarmList = async () => {
  const { data } = await axiosInstance.get("/notifications", {
    params: { page: 0, size: 10 },
  });
  console.log("알림 응답 데이터", data.result.notifications); 
  return data.result.notifications; 
};


// 알림 전체 읽음
export const markNotificationsAsRead = async (notificationIds: string[]) => {
  const { data } = await axiosInstance.patch("/notifications/read", {
    notificationIds,
  });
    console.log(data);
  return data.result;
};