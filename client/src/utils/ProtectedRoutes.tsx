// import { useRecoilValue } from "recoil";
// import { checkAuth } from "../state/atoms/authAtom";
import { Navigate } from "react-router-dom";

interface ProtectedRoutesProps {
    children: React.ReactNode;
}

export const ProtectedRoutes: React.FC<ProtectedRoutesProps> = ({children}) => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");

    if(!isAuthenticated){
        return <Navigate to="/login" />;
    }
    return children;
}