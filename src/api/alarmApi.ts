import {axiosInstance} from "../api/lib/axios";

// 알림 상세 조회
export const fetchAlarmList = async () => {
  const { data } = await axiosInstance.get("/notifications", {
    params: { page: 0, size: 10 },
  });

  return data.result.notifications; 
};