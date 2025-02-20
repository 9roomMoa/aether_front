import React, {useState} from 'react';
import Header from '../components/TaskHeader';
import Sidebar from '../components/TaskSidebar';
import TaskInfo from '../components/TaskInfo/TaskInfo';
import TaskTitle from '../components/TaskTitle';
import TaskDivider from '../components/TaskDivider';
import TaskManager from '../components/TaskManager/TaskManager';
import { useForm, FormProvider } from "react-hook-form"
import useTaskForm from "../hooks/useTaskInfo"


const TaskAdd: React.FC = () => {
  const methods = useTaskForm();

  const [activeTab, setActiveTab] = useState('info')
  const [title, setTitle] = useState("");

  const renderContent = () => {
    switch (activeTab) {
      case 'info':
        return <TaskInfo />;
      case 'user':
        return <TaskManager />;
      default:
        return <TaskInfo />;
    }
  };

  return (
    <FormProvider {...methods}>  
      <div className="flex items-stretch h-full bg-white pl-2">
        <div className="w-full h-full relative bg-[#F8F9FC] rounded-tl-lg overflow-auto shadow-[inset_0px_0px_8px_rgba(26,26,35,0.12)]">
          <Header title="업무 생성" />
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} visibleTabs={['info', 'user']}/>
          <div className="overflow-auto">
            <TaskTitle isEditable={true} title={title} setTitle={setTitle}/>
            <TaskDivider top='152px'/>
            <div>{renderContent()}</div>
          </div>
        </div>
      </div>
    </FormProvider>
  );
};

export default TaskAdd;