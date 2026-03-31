import {useAuth} from "../context/AuthContext.jsx";
import {useNavigate} from "react-router-dom";

const Profile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div>
            <h2>Profile</h2>
            <p>Name: {user.name}</p>
            <p>Email: {user.email}</p>

            <button onClick={handleLogout}>
                Logout
            </button>
        </div>
    );
};

export default Profile;
