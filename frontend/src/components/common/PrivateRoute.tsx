import { Navigate, Outlet, useLocation } from "react-router-dom";
import { commonValue } from "../../common.value";
function PrivateRoute() {
    const authenticate = commonValue.ACCESS_TOKEN === '';
    const location = useLocation();
    
    return !authenticate ? (
        <Outlet />
    ) : (
        <Navigate to={`/login?redirect=${location.pathname}`}/>
    );
}

export default PrivateRoute;
