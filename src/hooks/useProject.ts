import { useEffect, useState} from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery,useMutation, useQueryClient } from "@tanstack/react-query";
import { createProject, fetchProjectList } from "../api/projectApi";

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

function useProject(teamId: string, isCreate: boolean, options?: { onSuccess?: () => void }) {
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
          onSuccess: (data) => {
              console.log("프로젝트 생성:", data);
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

    // 프로젝트 전체 리스트 조회
    const { data: projectData, isLoading } = useQuery(
        ["projectInfo", teamId],
        () => fetchProjectList(teamId as string),
        {
            enabled: !isCreate,  // 프로젝트 생성이 아닐 때만 조회 요청
            initialData: null,
        }
    );

    // 데이터를 가져오면 상태 업데이트
    useEffect(() => {
        if (projectData?.data) {
            setProjects(projectData.data);
        }
    }, [projectData]);

    return { ...methods, projects, isLoading, handleCreateProject };
}

export default useProject;