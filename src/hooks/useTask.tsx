import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createTask, fetchTaskInfo, updateTask , addTaskManager } from "../api/taskApi";
import { fetchUserInfo } from "../api/userApi";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const taskSchema = z.object({
  title: z.string().min(1, ""),
  description: z.string().min(1, ""),
  isDaily: z.boolean(),
  status: z.string(),
  projectScope: z.string(),
  priority: z.number(),
  startDate: z.preprocess((val) => (val === "" ? undefined : val), z.string().optional()),
  dueDate: z.preprocess((val) => (val === "" ? undefined : val), z.string().optional()),
  createdBy: z.string(),
  creator: z.string(),
  project: z.string(),
  assignedTo: z.array(z.string()).optional(),
});

export interface TaskInfoValues extends z.infer<typeof taskSchema> {}

export const useTask = (projectId: string, tid: string | null, isCreate: boolean, fetchTasks: () => void, closeTab: () => void) => {
  const queryClient = useQueryClient();
  const { data: userInfo } = useQuery(["userInfo"], () => fetchUserInfo());
  const { data: taskData } = useQuery(["taskInfo", tid], () => fetchTaskInfo(tid as string), {
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
      creator: "",
      project: projectId,
      assignedTo: undefined,
    },
    resolver: zodResolver(taskSchema),
  });

  //기존 데이터를 가져오면 reset
  useEffect(() => {
    if (taskData?.data && userInfo) {
      methods.reset({
        title: taskData.data.title || "",
        description: taskData.data.description || "",
        isDaily: taskData.data.isDaily || false,
        status: taskData.data.status || "To Do",
        projectScope: taskData.data.projectScope || "Public",
        priority: taskData.data.priority || 0,
        startDate: taskData.data.startDate
          ? new Date(taskData.data.startDate).toISOString().split("T")[0]
          : "",
         dueDate: taskData.data.dueDate
          ? new Date(taskData.data.dueDate).toISOString().split("T")[0]
          : "",
        createdBy: taskData.data.createdBy,
        creator: taskData.data.creator || "",
        project: taskData.data.project || projectId,  // ✅ 프로젝트 ID 반영
        assignedTo: taskData.data.assignedTo || undefined,
      });
    }
  }, [taskData, userInfo, projectId, methods]);  // ✅ userInfo, projectId 의존성 추가


  // 업무 생성 mutation
  const createTaskMutation = useMutation(
    (newTask: TaskInfoValues) => {
      // createdBy 필드 제거 후 요청
      const { creator, createdBy, ...filteredTask } = newTask;
      return createTask(filteredTask);
    },
    {
      onSuccess: (data) => {
        console.log("업무 생성:", data);
        queryClient.invalidateQueries(["tasks"]);
        if (closeTab) closeTab();
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
      fetchTasks();
    } catch (error) {
      console.log(error);
    }
  });

  // 담당자 추가 mutation
  const addTaskManagerMutation = useMutation(
    ({ managerId, projectId }: { managerId: string; projectId: string }) =>
      addTaskManager(tid as string, managerId, projectId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["taskInfo", tid]); 
      },
      onError: (err) => {
        console.log(err);
      },
    }
  );

  // 수정 mutation
  const updateTaskMutation = useMutation(
    (updatedData: Partial<TaskInfoValues>) => {
      // createdBy 필드 제거 후 요청
      const { createdBy, ...filteredUpdate } = updatedData;
      return updateTask(tid as string, filteredUpdate);
    },      {
      onSuccess: (_data) => {
        queryClient.invalidateQueries(["taskInfo", tid]); 
        if (closeTab) closeTab(); // 수정 성공 시 탭 닫기
      },
      onError: (error) => {
        console.error(error);
      },
    }
  );
  
  // 업무 수정
  const handleUpdateTask = methods.handleSubmit(async (formData) => {
    try {
      const updatedData: Partial<TaskInfoValues> = {};
      const prevData = taskData?.data || {};

      // 날짜, 배열, 일반 값 각각 따로 비교
      for (const key in formData) {
        const typedKey = key as keyof TaskInfoValues;
        const newValue = formData[typedKey];
        let prevValue = prevData[typedKey];

        // 날짜 형식 통일 후 비교
        if ((typedKey === "startDate" || typedKey === "dueDate") && typeof prevValue === "string") {
          const prevDate = new Date(prevValue).toISOString().split("T")[0];
          const currentDate = typeof newValue === "string" ? newValue : "";
          if (prevDate !== currentDate) {
            updatedData[typedKey] = currentDate;
          }
          continue;
        }

        // 담당자 비교 
        if (typedKey === "assignedTo" && Array.isArray(prevValue) && Array.isArray(newValue)) {
          const prevSorted = [...prevValue].sort();
          const newSorted = [...newValue].sort();

          const isDifferent = JSON.stringify(prevSorted) !== JSON.stringify(newSorted);

          // 새로 추가된 담당자만 있는 경우 → PATCH에 포함하지 않음
          const addedManagers = newSorted.filter(id => !prevSorted.includes(id));
          const removedManagers = prevSorted.filter(id => !newSorted.includes(id));

          const onlyAdded = addedManagers.length > 0 && removedManagers.length === 0;

          if (isDifferent && !onlyAdded) {
            updatedData[typedKey] = newValue as TaskInfoValues["assignedTo"];
          }

          continue;
        }

        // 일반 비교
        if (newValue !== undefined && newValue !== prevValue) {
          updatedData[typedKey] = newValue as any;
        }
      }

      // 새로 추가된 담당자 감지
      const prevAssignedTo = (prevData.assignedTo || []) as string[];
      const newAssignedTo = formData.assignedTo || [];
      const addedManagers = newAssignedTo.filter(id => !prevAssignedTo.includes(id));

      // 추가된 담당자 API 호출
      for (const managerId of addedManagers) {
        await addTaskManagerMutation.mutateAsync({
          managerId,
          projectId,
        });
      }

      // 백엔드에 필요 없는 필드 제거
      delete updatedData.createdBy;

      console.log("추가된 담당자:", addedManagers);
      console.log("변경된 필드:", updatedData);

      // 변경된 필드가 있을 때만 patch
      if (Object.keys(updatedData).length > 0) {
        if (!updatedData.project) {
          updatedData.project = projectId;
        }

        await updateTaskMutation.mutateAsync(updatedData);
        fetchTasks();
      }
    } catch (error) {
      console.log(error);
    }
  });
    

  return { ...methods, handleCreateTask, userInfo, createTaskMutation, handleUpdateTask};
};

export default useTask;