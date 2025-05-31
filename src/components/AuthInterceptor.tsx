import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { axiosInstance } from '../api/lib/axios';

const AuthInterceptor = () => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const handleAuth = async () => {
            if (location.pathname === "/auth/success") {
                console.log("✅ /auth/success 감지됨, JSON 처리 시작");

                try {
                    const responseText = document.body.innerText; // 현재 페이지의 JSON 데이터 가져오기
                    const data = JSON.parse(responseText); // JSON 파싱

                    if (data.code === 200 && data.result) {
                        const { accessToken } = data.result;
                        
                        localStorage.setItem("accessToken", accessToken);

                        const response = await axiosInstance.get("/user/profile", {   
                        })

                        const { username, rank, userId, email } = response.data.result;
                        console.log(response.data);
                        localStorage.setItem("username", username);
                        localStorage.setItem("rank", rank);
                        localStorage.setItem("userId", userId);
                        localStorage.setItem("email", email);

                        // 즉시 /sign-up으로 이동
                        navigate("/sign-up", { replace: true });
                    }
                } catch (error) {
                    console.error("❌ 인증 데이터 가져오기 실패:", error);
                    navigate("/login");
                }
            }
        }

        handleAuth();
    }, [location, navigate]);

    return null; // UI 요소를 렌더링하지 않음
};

export default AuthInterceptor;
