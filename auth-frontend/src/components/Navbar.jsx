import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout, loading } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    if (loading) return null;

    return (
        <nav style={styles.nav}>
            <div>
                <Link to="/" style={styles.link}>Home</Link>

                {user && (
                    <>
                        <Link to="/profile" style={styles.link}>Profile</Link>
                        <Link to="/chat" data-testid='chat' style={styles.link}>Chat</Link>
                    </>
                )}
            </div>

            <div>
                {!user ? (
                    <>
                        <Link to="/login" style={styles.link}>Login</Link>
                        <Link to="/register" style={styles.link}>Register</Link>
                    </>
                ) : (
                    <button onClick={handleLogout} style={styles.button}>
                        Logout
                    </button>
                )}
            </div>
        </nav>
    );
};

const styles = {
    nav: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '12px 20px',
        borderBottom: '1px solid #ddd',
    },
    link: {
        marginRight: '12px',
        textDecoration: 'none',
    },
    button: {
        cursor: 'pointer',
    },
};

export default Navbar;