import React from 'react';
import {Link} from "react-router-dom";

// eslint-disable-next-line react/prop-types
const GameCard = ({img,title,desc,link}) => {
    return (
        <Link to={`/${link}`}>
        <div className={'game-card'}>
            <div className="img-game-card">
                <img src={img} alt="tamayjet"/>
            </div>

            <div className="gametext">
                <h1>{title}</h1>
                <p>{desc}</p>
            </div>

        </div>
        </Link>
    );
};

export default GameCard;