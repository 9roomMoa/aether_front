import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../api/lib/axios";

const AuthRedirect: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {

    const urlParams = new URLSearchParams(window.location.search);
    // const accessToken = urlParams.get("accessToken");
    // const userId = urlParams.get("id");
    // const username = urlParams.get("username");
    // const email = urlParams.get("email");
    // 완전히 안전하게 처리하기 위해 로컬 스토리지에 이미 존재한다면 그걸 불러오도록
    const accessToken = urlParams.get("accessToken") ?? localStorage.getItem("accessToken");
    
    if (!accessToken) {
      console.error("accessToken 없음");
      navigate("/login");
      return;
    }
    localStorage.setItem("accessToken", accessToken);

    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get("/auth/profile",{
        });

        const result = response.data.result;

        if (!result) {
          navigate("/login");
          return;
        }

        const { username, rank, userId, email } = response.data.result;

        localStorage.setItem("username", username);
        localStorage.setItem("rank", rank);
        localStorage.setItem("userId", userId);
        localStorage.setItem("email", email);

        setTimeout(() => {
          navigate("/user-info");
        }, 0);
      } catch (error) {
        console.error("인증 데이터 가져오기 실패:", error);
        navigate("/login");
      }
    };

    fetchProfile();
  }, [navigate]);

  return <div>로그인 중입니다. 잠시만 기다려주세요...</div>;
};

export default AuthRedirect;
