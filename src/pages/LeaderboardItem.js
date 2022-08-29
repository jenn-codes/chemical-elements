import React, { useState } from "react";
import '../styles/Leaderboard.css';
import AvatarMan from '../assets/man.png'
import AvatarWoman from '../assets/woman.png'
import AvatarAnon from '../assets/user.png'



const LeaderboardItem = ({name, time, rank}) => {

    const pickRandomAvatar = () => {
        const avatars = [AvatarAnon, AvatarMan, AvatarWoman];
        const randomAvatarIndex = Math.floor((Math.random())*(avatars.length));
        console.log(randomAvatarIndex)
        return avatars[randomAvatarIndex];
    }

    let randomImg = pickRandomAvatar()

    return (
        <div className='card'>
            <span className="ranking">{rank}</span>
            <span className="avatar"><img src={randomImg} alt='avatar'/></span>            
            <span className='user-name'>{name}</span>
            <span className='user-score'>{time}</span>
        </div>
    )
}

export default LeaderboardItem;