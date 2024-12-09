import './coin.css'
import AMIR from './amir.png'
import NIKITA from './nekit.png'
import COINSOUND from '/sonic-ring-sound2.mp3'
import {useRef, useState} from "react";
import axios from "axios";
import Navbar from "../navbar/navbar.jsx";

function CoinToss() {
    // eslint-disable-next-line no-unused-vars
    const [loading, setLoading] = useState(true);

    axios.defaults.baseURL = `http://localhost:8080`;
    axios.defaults.withCredentials = true;

    const [betAmount, setBetAmount] = useState('25');
    const [selectedSide, setSelectedSide] = useState('1'); // или 'амир' по умолчанию
    const [betError, setBetError] = useState('');
    const [balance, setBalance] = useState(0);
    const getCsrfToken = async () => {
        let response = await axios.get(`/csrf`);
        return response.data.token
    };
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
            return response.data


        } catch (e) {
            console.log(e.message)
        } finally {
            setLoading(false);
        }
    };
    async function coinServer() {
        let csrf = await getCsrfToken()
        const jwt = sessionStorage.getItem("token");

        if (!jwt) {
            console.error("JWT token not found in sessionStorage");
            return;
        }
        if (csrf) {
            try {
                const response = await axios.post('/games/coin', {
                    choose: selectedSide.toString(), betAmount: betAmount.toString(), //
                }, {

                    headers: {
                        'Content-Type': 'application/json', 'X-XSRF-TOKEN': csrf, // Возможно, можно удалить, если сервер не требует CSRF с JWT
                        Authorization: `Bearer ${jwt}`,
                    },
                });
                if (response.status===402){
                    alert('Нужно пополнить счет');
                    return;
                }
                return response.data
            } catch (error) {
                if (error.response) {
                    // Запрос был сделан и сервер ответил со статусом, отличным от диапазона 2xx
                    console.error('Response data:', error.response.data); // Ошибка от сервера
                    console.error('Response status:', error.response.status);
                    console.error('Response headers:', error.response.headers);
                } else if (error.request) {
                    // Запрос был сделан, но ответа не было
                    console.error('Request:', error.request);
                } else {
                    // Что-то произошло до запроса
                    console.error('Error message:', error.message);
                }
                console.error('Error:', error);
            }
        }

    }

    const [volume, setVolume] = useState(0.1); // Начальная громкость 10%
    const audioRef = useRef(null);
    const handleBetChange = (e) => {
        setBetAmount(e.target.value);
        setBetError(''); // Сброс ошибки при изменении
    };
   async function tossCoinFunction() {
       const result = document.querySelector('.result');
       result.style.color = 'black';

        if ( await fetchBalance() < betAmount ){
            alert('Недостаточно средств нужно пополнить')
            return
        }
       if (audioRef.current) {
           audioRef.current.volume = volume;
       }
        let datafromserver =  await coinServer();
       console.log(datafromserver);
        const coinIcon = document.getElementById('coin');
        const soundEffect = document.getElementById('coinsound');

        const tossBtn = document.getElementById('toss-button');

        coinIcon.insertAdjacentElement('afterend', result);
        tossBtn.disabled = true;

       const faceCoin = datafromserver.valueOfCoin

        const imageUrl = faceCoin == "1" ? AMIR : NIKITA;

        coinIcon.classList.add('flip');

        soundEffect.play();
        coinIcon.innerHTML = `<img src="${'/zaglushka.jpg'}" alt="${faceCoin}">`;
        result.textContent = `Выпало: ...`;
        setTimeout(() => {
            coinIcon.innerHTML = `<img src="${imageUrl}" alt="${faceCoin}">`;
            result.textContent = `Выпало: ${faceCoin}`;
            if (datafromserver.isWinner){
                result.style.color = 'green';
            }else{
                result.style.color = 'red';
            }

            setTimeout(() => {

                coinIcon.classList.remove('flip');
                tossBtn.disabled = false;

            }, 1790);


        }, 1800);
    }
    const handleSideChange = (e) => {
        setSelectedSide(e.target.value);

    };

    return (<div>
        <Navbar></Navbar>
        {sessionStorage.getItem("token") === null ? 'Не авторизованы ' :
            <div className='c-container-coin'>
                <div className="coin-container">
                    <h1 className="title">
                        Монетка
                    </h1>

                    <br/>
                    <div className="coin" id="coin">
                        <img src="/zaglushka.jpg" alt="Heads"/>
                    </div>
                    <p className="result">Выпало: ...</p>
                    <p className="selectedSideNode">Выбран: {selectedSide}</p>
                    <div>
                        <input
                            type="number"
                            id="betAmount"
                            value={betAmount}
                            onChange={handleBetChange}
                            min="25"
                            max="150000"
                            required
                        />
                        {betError && <span style={{color: 'red'}}>{betError}</span>}
                    </div>
                    <div>

                        <select id="side" value={selectedSide} onChange={handleSideChange}>
                            <option value="1">Амир</option>
                            <option value="2">Никита</option>
                        </select>
                    </div>
                    <button id="toss-button" onClick={tossCoinFunction}>
                        Подкинуть
                    </button>


                </div>
                <audio ref={audioRef} src={COINSOUND} id={'coinsound'} preload={'auto'}></audio>
                <img src={AMIR} className={'none'} alt="AMIR"/>
                <img src={NIKITA} className={'none'} alt="AMIR"/>

            </div>}

    </div>);
}

export default CoinToss;