import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await login(email, password);
            navigate('/profile');
        } catch (err) {
            setError(err);
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '40px' }}>
            <h2>Login</h2>

            <form onSubmit={handleSubmit}>
                <div>
                    <input
                        data-testid="email-input"
                        name="email"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div style={{ marginTop: '10px' }}>
                    <input
                        data-testid="password"
                        name="password"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button
                    data-testid="login-btn"
                    type="submit"
                    disabled={loading}
                    style={{ marginTop: '20px' }}
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>

            {error && (
                <p style={{ color: 'red', marginTop: '10px' }}>
                    {error}
                </p>
            )}
        </div>
    );
};

export default Login;
