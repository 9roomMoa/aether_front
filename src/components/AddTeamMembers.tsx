import React, { useState } from "react";
import { useAllMembers, User } from "../hooks/useUser";
import Profile from "../assets/Profile-small.svg";
import { getRankKorean } from "../utils/rank";

interface AddTeamMembersProps {
  projectId: string;
  onClose: () => void;
  onAdd: (user: User) => void;
}

const AddTeamMembers: React.FC<AddTeamMembersProps> = ({ projectId, onClose, onAdd }) => {
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const shouldFetch = !selectedUser && search.trim().length > 0;
  // 검색 시 필요한 전체 멤버 목록
  const { data: searchResults = [] } = useAllMembers(shouldFetch ? search : "");

  // 유저 선택
  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
    setSearch(user.name);
  };

  // 프로젝트 멤버로 해당 유저 추가
  const handleAddUsers = () => {
    if (selectedUser) {
      onAdd(selectedUser);
      onClose();
    }
  };

  return (
    <div className="w-full px-10 py-8 flex flex-col gap-8">
      {/* 검색창 */}
      <div className="flex flex-col gap-8">
        <div className="text-[#4f5462] text-xl font-semibold leading-7">팀원 추가</div>

        <div className="h-8 px-3 py-1 bg-[#f3f5f8] rounded-lg flex items-center">
          {selectedUser ? (
            <div className="h-6 px-2 bg-[#ffe3e0] rounded shadow-[0px_0px_28px_0px_rgba(79,84,98,0.12)] flex items-center">
              <div className="text-[#ff432b] text-base font-semibold leading-normal ">
                {selectedUser.name}
              </div>
            </div>
          ) : (
            <input
              className="w-full bg-transparent text-[#4f5462] text-base font-semibold leading-normal outline-none"
              type="text"
              placeholder="담당자를 입력해 주세요."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          )}
        </div>
      </div>

      {/* 검색된 사용자 목록 */}
      {searchResults.length > 0 && (
        <div className="mt-4 flex flex-col gap-2">
          {searchResults.map((user: User) => (
            <div
              key={user._id}
              className="rounded-lg shadow-[inset_0px_0px_4px_0px_rgba(26,26,35,0.12)] bg-[#f3f5f8] px-5 py-4 flex items-center gap-5 cursor-pointer hover:bg-[#e5eaf2]"
              onClick={() => handleSelectUser(user)}
            >
              <img className="w-12 h-12 rounded-full" src={Profile} />
              <div className="flex flex-col justify-between h-12">
                <div className="text-[#4f5462] text-base font-semibold leading-normal">{user.name}</div>
                <div className="text-[#ff432b] text-sm font-medium leading-normal">
                  {getRankKorean(user.rank)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}


      {/* 취소 및 추가 버튼 */}
      <div className="mt-8 flex justify-end gap-3">
        <button
          className="px-4 py-1 bg-[#e5eaf2] rounded text-[#949bad] text-sm font-semibold leading-normal"
          onClick={() => {
            setSearch("");
            setSelectedUser(null);
            onClose();
          }}
        >
          취소
        </button>
        <button
          className="px-4 py-1 bg-[#ff432b] rounded text-[#fcfcff] text-sm font-semibold leading-normal"
          onClick={handleAddUsers}
        >
          추가
        </button>
      </div>
    </div>
  );
};

export default AddTeamMembers;
