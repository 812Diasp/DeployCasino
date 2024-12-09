import {useEffect, useState} from "react";
import {redirect, useNavigate} from "react-router-dom";
import Navbar from "../navbar/navbar.jsx";

const Login = () => {

    const [isRegistering, setIsRegistering] = useState(false);
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(''); // For registration
    const [error, setError] = useState('');
    const [csrfToken, setCsrfToken] = useState(''); // Add state for CSRF token
    // eslint-disable-next-line no-unused-vars
    const [loading, setLoading] = useState(true); // Add loading state

    async function fetchCsrfToken() {
        setLoading(true); // Set loading to true
        try {
            const response = await fetch('http://localhost:8080/csrf', {
                credentials: 'include',
                method: 'GET',
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setCsrfToken(data.token);
        } catch (error) {
            setError(`Failed to fetch CSRF token: ${error.message}`);
        } finally {
            setLoading(false); // Set loading to false regardless of success or failure
        }
    }

    useEffect(() => {
        if (sessionStorage.getItem('token')!==null){
            navigate('/');
        }
        fetchCsrfToken();

    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (isRegistering && sessionStorage.getItem('token')===null) {
            if (password !== confirmPassword) {
                setError('Passwords do not match!');
                return;
            }
            try {
                const response = await fetch('http://localhost:8080/user/register', {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-XSRF-TOKEN': csrfToken,
                    },
                    body: JSON.stringify({username, email, password}),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    setError(errorData.message || 'Registration failed');
                } else {
                    const data = await response.json();
                    const token = data.token;
                    if (token) {
                        sessionStorage.setItem('token', token);
                        alert('Registration successful!');
                        navigate('/');

                    } else {
                        setError('Registration successful, but token not found in response.');
                    }
                }
            } catch (error) {
                setError(`Registration failed: ${error.message}`);
            }
        } else {
            try {
                const response = await fetch('http://localhost:8080/user/login', {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-XSRF-TOKEN': csrfToken,
                    },
                    body: JSON.stringify({username, email, password}),
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    setError(errorData.message || 'Login failed');
                } else {
                    const data = await response.json();
                    const token = data.token;

                    if (token) {
                        sessionStorage.setItem('token', token);
                        alert('Login successful!');
                        navigate('/');
                        // Redirect or proceed with the application, now that the token is stored.
                    } else {
                        setError('Login successful, but token not found in response.');
                    }
                }
            } catch (error) {
                setError(`Login failed: ${error.message}`);
            }
        }

    };
    return (
        <div>
            <Navbar></Navbar>
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>

                <form style={{padding: '20px', border: '1px solid #ccc', borderRadius: '5px', width: "500px"}}
                      onSubmit={handleSubmit}>
                    <h1>{isRegistering ? 'Регистрация' : 'Войти'}</h1>
                    {error && <div style={{color: 'red', marginBottom: '10px'}}>{error}</div>}

                    <div style={{marginBottom: '10px'}}>
                        <label htmlFor="username" style={{display: 'block', marginBottom: '5px'}}>USERNAME:</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={{width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px'}}
                            required
                        />
                    </div>
                    {isRegistering && (
                        <div style={{marginBottom: '10px'}}>
                            <label htmlFor="email" style={{display: 'block', marginBottom: '5px'}}>Email:</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={{width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px'}}
                                required
                            />
                        </div>
                    )}
                    <div style={{marginBottom: '10px'}}>
                        <label htmlFor="password" style={{display: 'block', marginBottom: '5px'}}>Пароль:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px'}}
                            required
                        />
                    </div>

                    {isRegistering && (
                        <div style={{marginBottom: '10px'}}>
                            <label htmlFor="confirmPassword" style={{display: 'block', marginBottom: '5px'}}>Подтвердите
                                пароль:</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                style={{width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px'}}
                                required
                            />
                        </div>
                    )}


                    <button style={{cursor: 'pointer'}} type="submit"
                            className="btn btn-primary">{isRegistering ? 'Регистрация' : 'Войти'}</button>

                    <p style={{marginTop: '10px'}}>
                        {isRegistering ? 'Уже есть аккаунт?' : 'Нет аккаунта?'}
                        <button type="button" onClick={() => setIsRegistering(!isRegistering)} style={{
                            backgroundColor: 'transparent',
                            border: 'none',
                            color: '#3386ff',
                            cursor: 'pointer',
                            textDecoration: 'underline'
                        }}>
                            {isRegistering ? 'Войти' : 'Регистрация'}
                        </button>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;