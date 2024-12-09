import React, {useEffect, useState} from 'react';
import axios from "axios";
import Navbar from "../navbar/navbar.jsx";

const Story = () => {
    axios.defaults.baseURL = `http://localhost:8080`;
    axios.defaults.withCredentials = true;
    const [data, setData] = useState([]);
    // eslint-disable-next-line no-unused-vars
    const [error, setError] = useState(null);
    var csrfToken;
    const [loading, setLoading] = useState(true);
    const getCsrfTokenAndMakeGameReq = async () => {
        let csrfresponse = await axios.get(`/csrf`);
        csrfToken = csrfresponse.data.token
        const jwt = sessionStorage.getItem("token");
        try {
            const response = await axios.get('/games/story/getAll', {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                    'X-XSRF-TOKEN': csrfToken, // Удалите, если CSRF не нужен
                },
            });

            if (response.status !== 200) {
                setError({gameName:"Нет ставок"});
            }else{
                setData(response.data.slice(0, 100))
            }
        } catch (error) {
            setError(error);
            console.error("Ошибка при получении данных:", error);
        } finally {
            setLoading(false);
        }

    };
    useEffect(() => {
        getCsrfTokenAndMakeGameReq();
        }, []);
    if (loading) {
        return <div>Загрузка...</div>;
    }

    if (error) {
        return <div>Ошибка: {error.message}</div>;
    }
    return (
        <div>
            <Navbar></Navbar>

                <h1>История игр</h1>
                <ul className={'story-container'}>
                    {data.map((item) => {
                        const date = new Date(item.date);
                        const formattedDate = date.toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' });
                        const formattedTime = date.toLocaleTimeString('ru-RU', { hour: 'numeric', minute: 'numeric' });
                        let styleItem;
                        if (item.winAmount>0){
                            styleItem='green'
                        }else{
                            styleItem='red'
                        }
                        return (
                            <li style={{background:styleItem}} className={'stavka-story-card'} key={item.id}>
                                <p>Дата: {formattedDate}, {formattedTime}</p>
                                <p>Игра: {item.gameName}</p>
                                <div className="line-stat">
                                    <p>Ставка: {item.betAmount}</p>
                                    <p>Выигрыш: {item.winAmount}</p>
                                    <p>К\Ф: {item.rateCoefficient}</p>
                                </div>

                            </li>
                        );
                    })}
                </ul>

        </div>
    );
};

export default Story;