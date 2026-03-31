import {useAuth} from "../context/AuthContext.jsx";
import {Navigate} from "react-router-dom";

const PublicRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) return <div>Loading...</div>;

    if (user) return <Navigate to="/profile" replace />;

    return children;
};

export default PublicRoute;
