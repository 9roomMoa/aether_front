import { getGradientByTime } from "../utils/getGradientByTime";
import DashboardHeader from "../components/Dashboard/DashboardHeader";
import DashboardContents from "../components/Dashboard/DashboardContents";
import Notice from "../components/Notice";
import { useNotices } from "../hooks/useNotice";
import { useAlarm } from "../hooks/useAlarm";

const Dashboard = () => {
  const dummyNotices = [
  { id: "1", content: "금일 23:59 서버 점검 예정입니다", createdAt: "2025-06-03" },
  { id: "2", content: "신규 기능 배포 안내", createdAt: "2025-06-01" },
  { id: "3", content: "구름모아 팀 프로젝트 마감일 확인부탁드립니다", createdAt: "2025-06-01" },
  { id: "4", content: "07/31 단합운동회 예정", createdAt: "2025-06-01" }
  ];
  const { gradient } = getGradientByTime();
  const { data: notices = [] } = useNotices();
  useAlarm(true);

  return (
    <div className="relative w-full flex flex-col items-center">
      {/*gradient 적용 배경 전용 레이어*/}
      <div className="absolute top-0 w-full h-[380px] overflow-x-hidden z-0">
        {/*왼→오 그라데이션*/}
        <div className={`absolute inset-0 bg-gradient-to-r ${gradient}`} />
        {/*위→아래 흰색 페이드*/}
        <div className="absolute inset-0 bg-gradient-to-b from-white/0 to-white" />
      </div>

      {/*콘텐츠 레이어*/}
      <div className="relative z-10 w-full max-w-[1344px] px-8 pt-[60px]">
        <DashboardHeader />
        {/* <Notice notices={notices}/> */}
        <Notice notices={dummyNotices} />
        <DashboardContents notices={notices} />
      </div>
    </div>
  );
};

export default Dashboard;