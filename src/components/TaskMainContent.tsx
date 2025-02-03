import React from 'react'
import TaskTitle from './TaskTitle'
import TaskInfo from './TaskInfo'
import TaskDivider from './TaskDivider'

function MainContent() {
  return (
    <main>
      {/* 업무 이름 */}
        <TaskTitle />
        <TaskDivider />
      {/* 업무 정보 */}
        <TaskInfo/>
    </main>
  )
}

export default MainContent
