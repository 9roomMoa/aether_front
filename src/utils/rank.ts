export const rankMap: Record<string, string> = {
  Intern: "인턴",
  Junior: "사원",
  Senior: "대리",
  Manager: "부장",
  Director: "부서장",
  VP: "부사장",
  CEO: "최고경영자",
};

export const getRankKorean = (rank: string | null) => {
  return rankMap[rank ?? ""] ?? rank ?? "알 수 없음";
};
