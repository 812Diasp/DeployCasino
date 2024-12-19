import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import {BrowserRouter, Route, Routes} from "react-router-dom";
import Login from "../components/logincomponent/login.jsx";
import Coin from "../components/coinGame/Coin.jsx";
import Story from "../components/storyGame/Story.jsx";

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <Routes>
            <Route path={'/'} element={<App/>}></Route>
            <Route path={'/login'} element={<Login/>}></Route>
            <Route path={'/coin'} element={<Coin/>}></Route>
            <Route path={'/stat'} element={<Story/>}></Route>
        </Routes>
    </BrowserRouter>
)
