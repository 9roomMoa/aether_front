import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createTask, fetchTaskInfo, updateTask } from "../api/taskApi";
import { fetchUserInfo } from "../api/userApi";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const projectId = "679aedec4f051a6eaac0204c"; // 현재 프로젝트 ID (하드코딩)

const taskSchema = z.object({
  title: z.string().min(1, "업무 제목을 입력해주세요."),
  description: z.string().min(1, "업무 설명을 입력해주세요."),
  isDaily: z.boolean(),
  status: z.string(),
  projectScope: z.string(),
  priority: z.number(),
  startDate: z.string().optional(),
  dueDate: z.string().optional(),
  createdBy: z.string(),
  project: z.string(),
  assignedTo: z.array(z.string()).optional(),
});

export interface TaskInfoValues extends z.infer<typeof taskSchema> {}

export const useTask = (tid: string | null, isCreate: boolean) => {
  const queryClient = useQueryClient();
  const { data: userInfo } = useQuery(["userInfo"], () => fetchUserInfo());
  const { data: taskData, isLoading } = useQuery(["taskInfo", tid], () => fetchTaskInfo(tid as string), {
    enabled: !isCreate && !!tid,
    initialData: null,
  });

  const methods = useForm<TaskInfoValues>({
    defaultValues: {
      title: "",
      description: "",
      isDaily: false,
      status: "To Do",
      projectScope: "Public",
      priority: 1,
      startDate: "",
      dueDate: "",
      createdBy: "",
      project: "",
      assignedTo: [],
    },
    resolver: zodResolver(taskSchema),
  });

  //기존 데이터를 가져오면 reset
  useEffect(() => {
    if (taskData?.data) {
      methods.reset({
        title: taskData.data.title || "",
        description: taskData.data.description || "",
        isDaily: taskData.data.isDaily || false,
        status: taskData.data.status || "To Do",
        projectScope: taskData.data.projectScope || "Public",
        priority: taskData.data.priority || 0,
        startDate: taskData.data.startDate ? new Date(taskData.data.startDate).toISOString().split("T")[0] : "",
        dueDate: taskData.data.dueDate ? new Date(taskData.data.dueDate).toISOString().split("T")[0] : "",
        createdBy: taskData.data.createdBy || (userInfo ? `${userInfo.name} (${userInfo.rank})` : ""),  // ✅ 유저 정보 반영
        project: taskData.data.project || projectId,  // ✅ 프로젝트 ID 반영
        assignedTo: taskData.data.assignedTo || [],
      });
    }
  }, [taskData, userInfo, projectId, methods]);  // ✅ userInfo, projectId 의존성 추가


  // 업무 생성 mutation
  const createTaskMutation = useMutation(
    (newTask: TaskInfoValues) => {
      // createdBy 필드 제거 후 요청
      const { createdBy, ...filteredTask } = newTask;
      return createTask(filteredTask);
    },
    {
      onSuccess: (data) => {
        console.log("업무 생성:", data);
        queryClient.invalidateQueries(["tasks"]);
      },
      onError: (error) => {
        console.error("업무 생성 에러:", error);
      },
    }
  );
  
  // 업무 생성
  const handleCreateTask = methods.handleSubmit(async (formData) => {
    try {
      await createTaskMutation.mutateAsync(formData);
    } catch (error) {
      console.log(error);
    }
  });

  // 수정 mutation
  const updateTaskMutation = useMutation(
    (updatedData: Partial<TaskInfoValues>) => {
      // createdBy 필드 제거 후 요청
      const { createdBy, ...filteredUpdate } = updatedData;
      return updateTask(tid as string, filteredUpdate);
    },      {
      onSuccess: (data) => {
        queryClient.invalidateQueries(["taskInfo", tid]); 
      },
      onError: (error) => {
        console.error(error);
      },
    }
  );
  
  // 업무 수정
  const handleUpdateTask = methods.handleSubmit(async (formData) => {
    try {
      const updatedData = Object.fromEntries(
        Object.entries(formData).filter(([key, value]) => {
          const typedKey = key as keyof TaskInfoValues;
          const prevValue = taskData?.data?.[typedKey];
          
          if (Array.isArray(value) && Array.isArray(prevValue)) {
            return JSON.stringify(value) !== JSON.stringify(prevValue);
          }

        return value !== undefined && value !== prevValue;
      })
    ) as Partial<TaskInfoValues>;
      
    
    if (updatedData.startDate) {
      updatedData.startDate = updatedData.startDate.split("T")[0]; 
    }
    if (updatedData.dueDate) {
      updatedData.dueDate = updatedData.dueDate.split("T")[0];
    }
    
    delete updatedData.createdBy;

    if (Object.keys(updatedData).length > 0) {
        await updateTaskMutation.mutateAsync(updatedData);
      }
    } catch (error) {
      console.log(error);
    }
  });
    

  return { ...methods, handleCreateTask, userInfo, createTaskMutation, handleUpdateTask};
};

export default useTask;