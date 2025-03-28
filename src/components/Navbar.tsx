import React from "react";

interface NavbarProps {
  activeTab: string; // 활성화된 탭
  setActiveTab: (tab: string) => void; // 탭 변경 함수
}

const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const tabs = ["개요", "업무", "문서함", "팀원 관리", "프로젝트 설정"];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        background: "#F8F9FC",
      }}
    >
      {tabs.map((tab) => (
        <div
          key={tab}
          onClick={() => setActiveTab(tab)} // 클릭 시 활성화 상태 변경
          style={{
            position: "relative",
            padding: "10px 25px",
            cursor: "pointer",
            color: activeTab === tab ? "#FF432B" : "#949BAD", // 활성화 상태 색상
            fontWeight: activeTab === tab ? "bold" : "normal",
            fontSize: "14px",
            transition: "color 0.3s",
          }}
        >
          {tab}

          {/* 하단 강조선 */}
          {activeTab === tab && (
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "1.3px",
                backgroundColor: "#FF432B",
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default Navbar;
