import { useQuery } from "@tanstack/react-query";
import { fetchProjectMembers, fetchUserInfo  } from "../api/userApi"; 
import { useState, useEffect } from "react";
export interface User {
  _id: string;
  name: string;
  email: string;
  rank: string;
  role: string;
}

// 프로젝트에 속한 멤버 목록
export const useUser = (projectId: string, keyword: string = "") => {
  return useQuery<User[]>({
    queryKey: ["user", projectId, keyword],
    queryFn: () => fetchProjectMembers(projectId, keyword), 
    enabled: !!projectId, 
  });
};


// 로그인한 사용자 정보
export const useCurrentUser = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const userInfo = await fetchUserInfo();
      setUser(userInfo);
    };
    getUser();
  }, []);

  return user;
};