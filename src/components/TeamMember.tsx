import React, { useState } from "react";
import Profile from "../assets/Profile-small.svg";
import { useProjectMembers, User } from "../hooks/useUser";
import { getRankKorean } from "../utils/rank";
import AddTeamMembers from "./AddTeamMembers";
import { axiosInstance } from "../api/lib/axios";
import { useQueryClient } from "@tanstack/react-query";

const TeamMember: React.FC<{ projectId: string }> = ({ projectId }) => {
  const queryClient = useQueryClient();
  const [tempMembers, setTempMembers] = useState<User[]>([]);
  const [isAdding, setIsAdding] = useState(false);

  // 조회 시 필요한 멤버 목록
  const { data } = useProjectMembers(projectId);
  const creator = data?.creator;
  const members = data?.members ?? [];

  // 임시 멤버 추가 
  const handleAddTempMember = (user: User) => {
    console.log(user);
    if (!tempMembers.find((m) => m._id === user._id)) {
      setTempMembers((prev) => [...prev, user]);
    }
  };

  // 최종 멤버 저장 
  const handleSave = async () => {
    try {

      for (const member of tempMembers) {
        await axiosInstance.patch(`/api/projects/${projectId}/members`, {
          memberId: member._id,
        });
        console.log("최종 멤버:", member._id,);
      }
      setTempMembers([]);
      queryClient.invalidateQueries(["projectMembers", projectId]);
    } catch (err) {
      console.log(err);
    }
  };

  if (isAdding) {
    return (
      <AddTeamMembers
        projectId={projectId}
        onClose={() => setIsAdding(false)}
        onAdd={handleAddTempMember}
      />
    );
  }

  return (
    <div className="w-full px-10 py-8 flex flex-col gap-8">
      {/* 팀장 */}
      {creator && (
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <div className="text-[#4f5462] text-xl font-semibold leading-7">팀장</div>
          </div>
          <div className="px-5 py-4 bg-[#f3f5f8] rounded-lg border border-[#e5eaf2] flex items-center gap-5">
            <img className="w-12 h-12 rounded-full" src={Profile} />
            <div className="flex flex-col justify-between">
              <div className="text-[#4f5462] text-base font-semibold leading-normal">{creator.name}</div>
              <div className="text-[#ff432b] text-sm font-medium leading-normal">
                {getRankKorean(creator.rank)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 구분선 */}
      <div className="h-0.5 bg-[#e5eaf2] rounded-lg" />

      {/* 팀원 */}
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div className="text-[#4f5462] text-xl font-semibold leading-7">팀원</div>
          <button
            onClick={() => setIsAdding(true)}
            className="px-4 py-1 bg-[#ff432b] rounded text-white text-base font-semibold"
          >
            팀원추가
          </button>
        </div>

        {/* 기존 + 임시 팀원 */}
        {(members.concat(tempMembers)).length === 0 ? (
          <div className="text-[#949bad] text-sm">팀원이 없습니다.</div>
        ) : (
          members.concat(tempMembers).map((member, idx) => (
            <div
              key={member._id || idx}
              className="px-5 py-4 bg-[#f3f5f8] rounded-lg border border-[#e5eaf2] flex items-center gap-5"
            >
              <img className="w-12 h-12 rounded-full" src={Profile} />
              <div className="flex flex-col justify-between">
                <div className="text-[#4f5462] text-base font-semibold leading-normal">{member.name}</div>
                <div className="text-[#ff432b] text-sm font-medium leading-normal">{getRankKorean(member.rank)}</div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 수정 버튼 */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="px-4 py-1 bg-[#ff432b] rounded text-white text-base font-semibold"
        >
          수정하기
        </button>
      </div>
    </div>
  );
};

export default TeamMember;
