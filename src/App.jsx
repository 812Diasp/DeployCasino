import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import GameCard from "../components/gameCard/gameCard.jsx";
import Navbar from "../components/navbar/navbar.jsx";

function App() {
  const games = [
    {
      img:'coin.png',
      title: 'Это - Монетка',
      link:'coin',
      desc:'Орёл или решка? Ура! Самая простая и веселая игра на свете!'
    }]
  return (
      <div><Navbar></Navbar>
        <div className={'games-container'}>
          {games.map((game, index) => (
              <GameCard link={game.link} key={index} img={game.img} title={game.title} desc={game.desc}/>))}
        </div>
      </div>

  )
}

export default App
