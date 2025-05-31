import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {fetchNotices, createNotice} from '../api/noticeApi';

// 공지 조회
export const useNotices = () => {
  return useQuery({
    queryKey: ['notices'],
    queryFn: fetchNotices,
  });
};

// 공지 생성
export const useCreateNotice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createNotice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notices'] });
    },
  });
};