import { db } from '../firebase';
import React, {useState, useEffect} from 'react';
import uniqid from 'uniqid';
import '../styles/Leaderboard.css'
import LeaderboardItem from './LeaderboardItem';
import '../styles/Leaderboard.css'
import { Link } from 'react-router-dom';

const Leaderboard = () => {
    const [leaderboardData,setLeaderboardData] = useState([]);
    window.onload = function() {
        if(!window.location.hash) {
            window.location = window.location + '#loaded';
            window.location.reload();
        }
    }

    useEffect(() => {
        const getData = async () => {
            let leaderArray = [];
            const firestoreData = await db.collection('high-scores').get();
            firestoreData.forEach((doc) => {
                leaderArray.push(doc.data());
            })


            function compare(a,b) {
                const score1 = a.Time;
                const score2 = b.Time;
                let comparison = 0;
                if (score1 > score2) {
                    comparison = 1;
                } else if (score1 < score2) {
                    comparison = -1
                }
                return comparison;
            }
            leaderArray.sort(compare);
            setLeaderboardData(leaderArray.slice(0,10));
        }
        // eslint-disable-next-line
    getData()}, []);
        // console.log(leaderboardData);

    console.log(db.collection("high-scores").orderBy("Time", "asc"));

    const secondsToMinutes = seconds => Math.floor(seconds / 60) + ':' + ('0' + Math.floor(seconds % 60)).slice(-2);

    
    return (
        <div>
            <h1>CHEMICAL ELEMENT SEARCH</h1>
            <h2>Best Times Leaderboard</h2>
            <div className='best-times'>
            {leaderboardData.map((item) => {
                return (
                    <div key={uniqid()}>
                        <LeaderboardItem
                        rank={leaderboardData.indexOf(item)+1}
                        name={item.Name}
                        time={secondsToMinutes(item.Time)}
                        />
                    </div>
                )
            })}
            </div>  
            <Link to='/chemical-elements/'><button type='button' className='play-again'>Play Again</button></Link>
        </div>
    )
} 
export default Leaderboard;