import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Breadcrumb from "../components/BreadCrumb";
import TaskMenu from "../components/KanbanBoard/TaskMenu";
import TaskCard from "../components/KanbanBoard/TaskCard";
import ProjectAdd from "../components/ProjectAdd";
import useProject from "../hooks/useProject";
import { useNavigate } from "react-router-dom";

const TeamSpace: React.FC = () => {
  const [isProjectAddOpen, setIsProjectAddOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [_isTaskSettingOpen, setIsTaskSettingOpen] = useState(false);
  const navigate = useNavigate();
  const teamId = "67fce39dddf4eb5d55ecb3d0";
  const { projects } = useProject(teamId, false);

  const projectState = {
    "To Do": projects.filter((project) => project.status === "To Do"),
    "In Progress": projects.filter((project) => project.status === "In Progress"),
    "Done": projects.filter((project) => project.status === "Done"),
    "Issue": projects.filter((project) => project.status === "Issue"),
    "Hold": projects.filter((project) => project.status === "Hold"),
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "To Do":
        return "대기";
      case "In Progress":
        return "진행";
      case "Done":
        return "완료";
      case "Issue":
        return "이슈";
      default:
        return status;
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "To Do":
        return "#FFA14A";
      case "In Progress":
        return "#4999F8";
      case "Done":
        return "#5DC896";
      case "Issue":
        return "#FF6B6B";
      default:
        return "#D3D3D3";
    }
  };

  const handleProjectClick = (projectId: string) => {
    setSelectedProject(projectId);
    setIsTaskSettingOpen(true);
    setIsProjectAddOpen(false);
    navigate(`/tasks/${projectId}`);
  };

  const handleProjectAddClick = () => {
    setIsProjectAddOpen(!isProjectAddOpen);
    setIsTaskSettingOpen(false);
    setSelectedProject(null);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <div>
        <Breadcrumb
            paths={[
                { label: "DB Inc" },
                { label: "팀 스페이스" },
            ]}
        />
      </div>
        <div
            style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%",
            borderRadius: "8px 0 0 0",
            background: "#F8F9FC",
            boxShadow: "0px 0px 8px 0px rgba(26, 26, 35, 0.12) inset",
            overflowX: "hidden",
            transition: "width 0.3s ease",
            }}
        >
            <div className="ml-[40px] mt-[10px]">
            {/* NavBar의 탭은 '프로젝트' 하나만 존재 */}
            <Navbar tabs={isProjectAddOpen ? ["프로젝트 생성"] : ["프로젝트"]} activeTab={isProjectAddOpen ? "프로젝트 생성" : "프로젝트"} setActiveTab={() => {}} />
            </div>
            <div>
                <TaskMenu
                    isTaskAddOpen={isProjectAddOpen}
                    setIsTaskAddOpen={handleProjectAddClick}
                    addLabel="프로젝트 생성"
                />
             </div>
             <div className="flex flex-col w-full px-10 py-8">
                {/* 프로젝트 생성 버튼 눌렀을 때 화면 전환 */}
                {isProjectAddOpen ? (
                <ProjectAdd onSuccess={() => setIsProjectAddOpen(false)}/>
                ) : (
                  <div className="flex gap-4 overflow-x-auto overflow-y-auto whitespace-nowrap min-h-screen">
                      {Object.entries(projectState).map(([status, projectList]) => (
                        <div key={status} className="flex flex-col min-w-[362px] max-w-[402px] overflow-visible min-h-0">
                          {/* 컬러 바 */}
                          <div
                            className="h-[6px]"
                            style={{
                              backgroundColor: getStatusColor(status),
                              borderTopLeftRadius: "12px",
                              borderTopRightRadius: "12px",
                            }}
                          />

                          {/* 흰색 헤더 박스 */}
                          <div className="bg-white p-5 shadow-md flex flex-col gap-3 rounded-t-none rounded-b-[12px]">
                            <div className="flex justify-between items-center">
                              <span className="text-[#3D3D3D] font-semibold">{getStatusLabel(status)}</span>
                              <select
                                value={"마감일순"}
                                onChange={() => {}}
                                className="text-xs text-[#949BAD] bg-transparent cursor-pointer border-none focus:outline-none"
                              >
                                <option value="마감일순">마감일순</option>
                                <option value="최신생성일순">최신생성일순</option>
                              </select>
                            </div>

                            {projectList.length === 0 ? (
                              <div></div>
                            ) : (
                              <div className="flex flex-col gap-3">
                                {projectList
                                  // .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                                  .sort((a, b) => a.name.localeCompare(b.name))
                                  .map((project, index) => (
                                    <TaskCard
                                      key={project._id}
                                      title={project.name}
                                      description={project.description ?? ""}
                                      status={project.status}
                                      onClick={() => handleProjectClick(project._id ?? "")}
                                      isSelected={selectedProject === project._id}
                                      isCompact
                                      className={index === projectList.length - 1 ? "" : ""}
                                  />
                                ))}
                            </div>
                        )}
                  </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
  );
};

export default TeamSpace;
