// hooks/useProjectDetail.ts
import { useQuery } from "@tanstack/react-query";
import { fetchProject } from "../api/projectApi";
import { ProjectIinfoValues } from "./useProject";

export const useProjectDetail = (projectId: string) => {
  return useQuery<ProjectIinfoValues>({
    queryKey: ["projectDetail", projectId],
    queryFn: () => fetchProject(projectId),
    enabled: !!projectId,
  });
};
