import React, { useState, useEffect } from "react";
import Breadcrumb from "../components/BreadCrumb";
import Navbar from "../components/Navbar";
import TaskCard from "../components/KanbanBoard/TaskCard";
import TaskMenu from "../components/KanbanBoard/TaskMenu";
import TaskSetting from "../components/TaskSetting";
import ProjectSetting from "../components/ProjectSetting";
import TaskAdd from "../components/TaskAdd";
import axiosInstance from "../api/lib/axios";
import { useParams } from "react-router-dom";
import TeamMember from "../components/TeamMember";

interface TaskKanbanProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TaskKanban: React.FC<TaskKanbanProps> = ({ activeTab, setActiveTab }) => {
  const { projectId } = useParams<{ projectId: string }>();
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [isTaskSettingOpen, setIsTaskSettingOpen] = useState(false);
  const [isTaskAddOpen, setIsTaskAddOpen] = useState(false);
  const [tasks, setTasks] = useState<{ [key: string]: any[] }>({
    "To Do": [],
    "In Progress": [],
    "Done": [],
    "Issue": [],
  });
  
  const [sortTypes, setSortTypes] = useState<{ [status: string]: "dueDate" | "priority" }>({
    "To Do": "dueDate",
    "In Progress": "dueDate",
    "Done": "dueDate",
    "Issue": "dueDate",
    "Hold": "dueDate",
  });

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

  // 업무 데이터 가져오기
  const fetchTasks = async (type: string = "dueDate") => {
    try {
      const response = await axiosInstance.get(`/api/tasks/${projectId}`,{
         params: { type },
      });
      if (response.data.success) {
        setTasks({
          "To Do": response.data.data["To Do"] || [],
          "In Progress": response.data.data["In Progress"] || [],
          "Done": response.data.data["Done"] || [],
          "Issue": response.data.data["Issue"] || [],
          "Hold": response.data.data["Hold"] || [], 
        });
      }
    } catch (error) {
      console.error("업무 조회 실패", error);
    }
  };

  useEffect(() => {
    fetchTasks(); 
  }, []);

  // 업무 카드 클릭 시 TaskSetting 열기
  const handleTaskClick = (taskId: string) => {
    if (selectedTask === taskId) {
      setSelectedTask(null);
      setIsTaskSettingOpen(false); // 클릭된 업무 카드 다시 클릭 시 닫기
    } else {
      setSelectedTask(taskId);
      setIsTaskSettingOpen(true); // 새로운 업무 카드 클릭 시 열기
      setIsTaskAddOpen(false); // 업무 카드 클릭 시 업무 생성 닫기
    }
  };

  // 업무 생성 클릭 시 TaskAdd 열기
  const handleTaskAddClick = () => {
    setIsTaskAddOpen(!isTaskAddOpen);
    setIsTaskSettingOpen(false);
    setSelectedTask(null);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div>
        <Breadcrumb
          paths={[
            { label: "DB Inc" },
            { label: "팀 스페이스", path: "/teamspace" }, // 여기에만 navigate 기능 추가
            { label: "프로젝트" },
          ]}
        />
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          height: "100%",
          borderRadius: "8px 0 0 0",
          background: "#F8F9FC",
          boxShadow: "0px 0px 8px 0px rgba(26, 26, 35, 0.12) inset",
          overflowX: "hidden",
          transition: "width 0.3s ease",
        }}
      >
        {/* TaskSetting가 열리면 컨테이너 너비 줄이기 */}
        <div
          className="flex flex-col min-w-[320px]"
          style={{
            width: isTaskSettingOpen || isTaskAddOpen ? "calc(100% - 570px)" : "100%",
            transition: "width 0.3s ease",
          }}
        >
          <div style={{ marginLeft: "23px", marginTop: "10px" }}>
            <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>

          {/* "프로젝트 설정" 탭이 활성화되면 TaskInfo 렌더링 */}
          {activeTab === "프로젝트 설정" ? (
            <div className="relative w-full min-h-screen overflow-x-auto overflow-y-auto">
              <ProjectSetting projectId={projectId!}/>
            </div>
          ) : activeTab === "팀원 관리" ? (
            <div className="relative w-full min-h-screen overflow-x-auto overflow-y-auto">
              <TeamMember projectId={projectId!}/>
            </div>
          ) : (
              activeTab === "업무" && (
                <>
                  <div>
                    <TaskMenu isTaskAddOpen={isTaskAddOpen} setIsTaskAddOpen={handleTaskAddClick} addLabel="업무 생성" />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "32px",
                      padding: "40px",
                      overflowX: "auto",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {Object.entries(tasks).map(([status, taskList]) => (
                      <div key={status} className="min-w-[362px] max-w-[402px] flex flex-col">
                        {/* 컬러 바 */}
                        <div
                          className="h-[6px]"
                          style={{
                            backgroundColor: getStatusColor(status),
                            borderTopLeftRadius: "12px",
                            borderTopRightRadius: "12px",
                          }}
                        />

                        {/* 흰색 본문 영역 */}
                        <div className="bg-white p-5 shadow-md flex flex-col gap-3 rounded-t-none rounded-b-[12px]">
                          {/* Header */}
                          <div className="flex justify-between items-center">
                            <span className="text-[#3D3D3D] font-semibold">{getStatusLabel(status)}</span>
                            <select
                              value={sortTypes[status] === "dueDate" ? "마감일순" : "우선순위순"}
                              onChange={(e) => {
                                const selected = e.target.value;
                                setSortTypes((prev) => ({
                                  ...prev,
                                  [status]: selected === "마감일순" ? "dueDate" : "priority",
                                }));
                              }}
                              className="text-xs text-[#949BAD] bg-transparent cursor-pointer border-none focus:outline-none"
                            >
                              <option value="마감일순">마감일순</option>
                              <option value="우선순위순">우선순위순</option>
                            </select>
                          </div>

                          {/* 업무 리스트 or 업무 없음 */}
                          {taskList.length === 0 ? (
                            <div></div>
                          ) : (
                            <div className="flex flex-col gap-3">
                              {taskList
                                .sort((a, b) => {
                                  const sortType = sortTypes[status];
                                  if (sortType === "dueDate") {
                                    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
                                  } else {
                                    return b.priority - a.priority;
                                  }
                                })
                                .map((task, index) => (
                                  <TaskCard
                                    key={task._id}
                                    title={task.title}
                                    description={task.description}
                                    status={task.status}
                                    onClick={() => handleTaskClick(task._id)}
                                    isSelected={selectedTask === task._id}
                                    isCompact
                                    className={index === taskList.length - 1 ? "" : ""}
                                  />
                                ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )
            )}
        </div>

        {/* 업무 설정 / 업무 생성 탭 */}
        {(isTaskSettingOpen || isTaskAddOpen) && (
          <div
            className="min-w-[320px] h-full"
            style={{
              width: "640px",
              transition: "transform 0.3s ease",
              transform: isTaskSettingOpen || isTaskAddOpen ? "translateX(0)" : "translateX(100%)",
              zIndex: 10,
            }}
          >
            {isTaskSettingOpen ? 
              <TaskSetting 
                projectId={projectId!}
                selectedTaskId={selectedTask} 
                fetchTasks={fetchTasks} 
                closeTab={() => setIsTaskSettingOpen(false)}
              /> 
            : 
              <TaskAdd
                projectId={projectId!}
                fetchTasks={fetchTasks} 
                closeTab={() => setIsTaskAddOpen(false)}
              />}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskKanban;
