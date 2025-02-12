import React from 'react';
import Header from '../components/TaskHeader'
import Sidebar from '../components/TaskSidebar';
import TaskTitle from '../components/TaskTitle';
import TaskDivider from '../components/TaskDivider';
import DocumentList from '../components/TaskDocument/DocumentList';
import Search from '../components/Search';
import DocumentAdd from '../components/TaskDocument/DocumentAdd';

const TaskDocument: React.FC = () => {
  const handleDocumentsearch = (term: string) => {
    console.log(term);
  };

  return (
    <div className="w-[640px] h-[972px] relative bg-[#F8F9FC] rounded-tl-lg shadow-[inset_0px_0px_8px_0px_rgba(26,26,35,0.12)]  overflow-hidden">
      <Header />
      <div>
        <Sidebar />
        <main>  
          {/* 업무 이름 */}
          <TaskTitle isEditable={false} title="ABC 업무" />
          <h4 className="absolute h-[28px] left-[128px] top-[174px] text-[#4f5462] text-xl font-semibold leading-7">
                문서
          </h4>
          {/* 서치 탭 */}
          <Search
            className="left-[333px]"
            placeholder="문서 검색"
            onSearch={handleDocumentsearch}
          />
          <DocumentAdd />
          <TaskDivider />
          <DocumentList />
        </main>
      </div>
    </div>
  );
};

export default TaskDocument;
