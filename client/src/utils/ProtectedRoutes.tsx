// import { useRecoilValue } from "recoil";
// import { checkAuth } from "../state/atoms/authAtom";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "../redux/store";

interface ProtectedRoutesProps {
    children: React.ReactNode;
}

export const ProtectedRoutes: React.FC<ProtectedRoutesProps> = ({children}) => {
    const { isAuthenticated } = useSelector((state: RootState) => state.user);
    
    if(!isAuthenticated){
        return <Navigate to="/login" />;
    }
    return children;
}