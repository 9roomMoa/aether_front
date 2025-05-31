import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchMemo, createMemo } from "../api/memoApi";

export interface Memo {
  description: string;
  createdAt: string;
  _id: string;
}

// 메모 조회
export const useMemos = () => {
  return useQuery<Memo[]>({
    queryKey: ['memos'],
    queryFn: fetchMemo,
  });
};

// 메모 생성
export const useCreateMemo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMemo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memos'] }); // 메모 리스트 새로고침
    },
  });
};