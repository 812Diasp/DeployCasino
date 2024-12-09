import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
import {useEffect, useState} from "react"
import './navbar.css'

const Navbar = () => {
        axios.defaults.baseURL = `http://localhost:8080`;
        axios.defaults.withCredentials = true;
        const [balance, setBalance] = useState(0);  // Инициализация состояния
        const [error, setError] = useState(null);     // Для обработки ошибок
        const [loading, setLoading] = useState(true); // Индикатор загрузки
    const navigate = useNavigate();
        const [Authorised, setAuth] = useState(null);
    const setAuthorised = () => {
        setAuth(sessionStorage.getItem("token"));
    };
        const getCsrfToken = async () => {
            let response = await axios.get(`/csrf`);
            return response.data.token;
        };


    const handleExit = () => {
        if (window.confirm('Вы уверены?')) {
            sessionStorage.removeItem("token")
            navigate('/');
            setAuthorised()
           alert('Вы вышли из аккаунта');
        } else {
            // Действие, если пользователь нажал "Отмена"
            alert('Отмена');
        }
    };
        useEffect(() => {
                setAuthorised();

                const fetchBalance = async () => {
                    try {
                        const csrf = await getCsrfToken();
                        const jwt = sessionStorage.getItem("token");
                        const response = await axios.get('/user/balance', {
                            headers: {
                                Authorization: `Bearer ${jwt}`,
                                "X-XSRF-TOKEN": csrf
                            },
                        });

                        if (response.status !== 200) { // Проверка на успешный статус-код
                            throw new Error(`HTTP error! status: ${response.status}, message: ${response.statusText}`);
                        }

                        setBalance(response.data.toFixed(2));
                    } catch (e) {
                        setError(e.message);
                    } finally {
                        setLoading(false);
                    }
                };
                const intervalId = setInterval(() => {
                    fetchBalance();
                }, 3000); // 5000 milliseconds = 5 seconds

                // Функция очистки, вызывается перед повторным рендерингом или размонтированием компонента
                return () => clearInterval(intervalId);
                }, []);

        return (
            <div>
                <header
                    className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
                    <div className="col-md-3 mb-2 mb-md-0">
                        <a href="/" className="d-inline-flex link-body-emphasis text-decoration-none">
                            <img src={'/dice.png'} alt="dice" width="64px" height="64px"/>
                        </a>
                    </div>

                    <ul className="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
                        <li>
                            <Link to={'/'} className="nav-link px-2 link-secondary">Главная</Link>
                        </li>
                        {Authorised === null ? (
                           ""
                        ) : <li><Link className="nav-link px-2" to={'/stat'}>Статистика</Link></li>}

                    </ul>

                    <div className="col-md-3 text-end">
                        {Authorised === null ? (
                            <Link to={'/login'}>
                                <button type="button" className="btn btn-primary">Войти/Зарегистрироваться</button>
                            </Link>
                        ) : (
                            loading ? (
                                <div className={'balance-node loading-balance'}>Загрузка баланса...</div>
                            ) : error ? (
                                    <div className={'balance-node error-balance'}>Ошибка: {error}
                                        <button className={'btn btn-danger'} onClick={handleExit}>выйти</button>
                                    </div>
                            ) : (
                                    <div className={'balance-node balance'}>{balance} руб.
                                        <button className={'btn btn-danger'} onClick={handleExit}>выйти</button>
                                    </div>
                            )
                        )}
                                </div>
                            </header>
                            </div>
                            );
                        }
;

export default Navbar;








