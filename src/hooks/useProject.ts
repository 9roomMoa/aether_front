import { useEffect, useState} from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery,useMutation, useQueryClient } from "@tanstack/react-query";
import { createProject, fetchProject, fetchProjectList, updateProject } from "../api/projectApi";

const projectSchema = z.object({
   _id: z.string().optional(),
   status: z.string(),
   name: z.string().min(1, ""),
   description: z.string().min(1, "").optional(),
   scope: z.string(),
   priority: z.number(),
   startDate: z.preprocess((val) => (val === "" ? undefined : val), z.string().optional()),
   dueDate: z.preprocess((val) => (val === "" ? undefined : val), z.string().optional()),
   members: z.array(z.string()).optional().default([]),
});

export interface ProjectIinfoValues extends z.infer<typeof projectSchema> {}

function useProject(teamId: string, isCreate: boolean, options?: { onSuccess?: () => void; sortType: "dueDate" | "priority"; projectId?: string; }) {
    const queryClient = useQueryClient();
    const [projects, setProjects] = useState<ProjectIinfoValues[]>([]);

    const methods = useForm<ProjectIinfoValues>({
        defaultValues: {
            status: "To Do",
            name: "",
            description: "",
            scope: "Team",
            priority: 0,
            startDate: "",
            dueDate: "",
            members: [],
        },
        resolver: zodResolver(projectSchema),
      });

    // 프로젝트 생성 mutation
    const createProjectMutation = useMutation(
      (newProject: ProjectIinfoValues) => createProject(newProject),
      {
          onSuccess: () => {
              queryClient.invalidateQueries(["projectInfo", teamId]);
              options?.onSuccess?.();
          },
          onError: (error) => {
              console.error("프로젝트 생성 에러:", error);
          },
      }
    );

    // 프로젝트 생성
    const handleCreateProject = methods.handleSubmit(async (formData) => {
        try {
          await createProjectMutation.mutateAsync(formData);
        } catch (error) {
          console.log(error);
        }
    });

    // 수정 mutation
    const updateProjectMutation = useMutation(
        (updatedData: Partial<ProjectIinfoValues>) => {
            const {_id, members, ...safeData} = updatedData;
            console.log("전송될 최종 safeData:", safeData);
            return updateProject(options!.projectId!, safeData);
        },      
        {
            onSuccess: () => {
                queryClient.invalidateQueries(["projectDetail", options?.projectId]);
                queryClient.invalidateQueries(["projectInfo", teamId]);
                options?.onSuccess?.();
            },
            onError: (error) => {
                console.error(error);
            },
        }
    );

    // 프로젝트 수정
    const handleUpdateProject = methods.handleSubmit(async (formData) => {
        const prevData = projectDetail?.data;
        if (!prevData) return;

        const updatedData = Object.fromEntries(
            Object.entries(formData).filter(([key, value]) => {
                const typedKey = key as keyof ProjectIinfoValues;
                let prevValue = projectDetail?.data?.[typedKey];

                // 날짜 형식 비교
                if ((typedKey === "startDate" || typedKey === "dueDate")) {
                    const valueStr =
                        typeof value === "string"
                        ? value.split("T")[0] 
                        : String(value);

                    const prevStr =
                        typeof prevValue === "string"
                        ? new Date(prevValue).toISOString().split("T")[0]
                        : String(prevValue);

                    return valueStr !== prevStr;
                }

                return value !== prevValue;
            })
        ) as Partial<ProjectIinfoValues>;

        // 날짜 값 T 제거
        if (updatedData.startDate) {
            updatedData.startDate = updatedData.startDate.split("T")[0];
        }
        if (updatedData.dueDate) {
            updatedData.dueDate = updatedData.dueDate.split("T")[0];
        }

        if (Object.keys(updatedData).length === 0) {
            return;
        }

        try {
            await updateProjectMutation.mutateAsync(updatedData);
        } catch (error) {
            console.error(error);
        }
    });

    // 프로젝트 상세 조회
    const { data: projectDetail } = useQuery(
        ["projectDetail", options?.projectId],
        () => fetchProject(options!.projectId!),
        {
        enabled: !!options?.projectId && !isCreate,
        onSuccess: (data) => {
            methods.reset({
            ...data.data,
            });
        },
        }
    );

    // 프로젝트 전체 리스트 조회
    const { data: projectData = [], isLoading,} = useQuery(
        ["projectInfo", teamId, options?.sortType ?? "dueDate"],
        () => fetchProjectList(teamId as string, options?.sortType ?? "dueDate"),
        { enabled: !isCreate, }
    );

    // 데이터를 가져오면 상태 업데이트
    useEffect(() => {
        if (projectData?.data) {
            setProjects(projectData.data);
        }
    }, [projectData]);

    return { ...methods, projects, isLoading, handleCreateProject, projectDetail, handleUpdateProject };
}

export default useProject;