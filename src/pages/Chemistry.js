import React, { useEffect, useState, useRef } from 'react';
import PeriodicTable from '../assets/periodic-table.jpg';
import check from '../assets/check.png';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import '../styles/Chemistry.css';


const Chemistry = ({difficulty}) => {

    let elementMap = difficulty.slice(0,2);
    const [showElements, setShowElements] = useState(false);  
    const [xPos, setXPos] = useState(); 
    const [yPos, setYPos] = useState();
    const [status, setStatus] = useState('')
    const [score, setScore] = useState(0);
    const elementsList = useRef();
    const [timer, setTimer] = useState(0);
    const [elementsLeft, setElementsLeft] = useState(elementMap);
    const [currElement, setCurrElement] = useState('');
    const [isGameOver, setIsGameOver] = useState(false);
    let opacity = 0;

    const show = () => {
        const status = document.querySelector('.status');
        if (status) {          
            opacity = parseFloat(window.getComputedStyle(status).getPropertyValue('opacity'))
            if (opacity < 1) {
                opacity = opacity + 0.1;
                status.style.opacity = opacity;
            } else if (opacity > 1) {
                status.style.opacity = 1;
            }
        }
    }

    const handleClick = () => {
        const img = document.querySelector('.periodic-table');
        if (img) {
            img.onclick = (e) => {
                // calculate relative position 
                const x = e.pageX - e.target.offsetLeft;
                const y = e.pageY - e.target.offsetTop;
                // console.log('x,y', x,y)
                checkSpotMatch(x,y);
                // calculate absolute position
                let rect = img.getBoundingClientRect();
                setXPos(x + rect.left);
                setYPos(y + rect.top);
                }
            }
    }


    const checkSpotMatch = (x,y) => {

        for (let i=0; i<elementMap.length; i++) {
            if (elementMap[i].x1 <= x && 
            elementMap[i].x2 >= x && 
            elementMap[i].y1 <= y && 
            elementMap[i].y2 >= y) {
                
                let elementFound = elementMap[i].name;
                // console.log(elementFound);

                setCurrElement(elementFound);
                setShowElements(true);
                return;
            }   
        } setShowElements(false);
        setStatus('That\'s not one of the listed elements to be found.')
    }

    // check that actual element is the one selected by user
    const checkElementMatch = (e) => {
        const selectedElement = e.target.textContent;
        if (selectedElement === currElement) {
            setStatus('Congratulations, that\'s a match!')
            let newArr = elementsLeft.slice();
            newArr = newArr.filter((item) => item.name !== selectedElement);
            setElementsLeft(newArr);
            setScore(score => score + 10);
            setShowElements(false);
            placeMarkerInBox();
        } else {
            setShowElements(false);
            setStatus('Nope, try again!')
        }
    }

    
    const placeMarkerInBox = () => {
        const xStart = elementMap.filter((item) => item.name === currElement)[0].x1
        const yStart = elementMap.filter((item) => item.name === currElement)[0].y1
        const img = document.createElement('img');
        const periodicTable = document.querySelector('.periodic-table')
        let rect = periodicTable.getBoundingClientRect();
        const x = xStart + rect.left + 12;
        const y = yStart + rect.top + 12;
        img.src= check;
        img.classList.add('check');
        img.alt = 'check';
        img.style.position = 'absolute';
        img.style.left = `${x}px`;
        img.style.top = `${y}px`;
        document.body.appendChild(img);
    }

    const navigate = useNavigate();
    const handleSave = async () => {
        let userName = document.querySelector('.user-name').value;
        let elapsedTime = timer;
        console.log(userName, elapsedTime);
        const newHigh = {
            'Time': elapsedTime,
            'Name':  userName
        }
        db.collection('high-scores').add(newHigh);
        navigate('/chemical-elements/leaderboard');
    }

    const secondsToMinutes = seconds => Math.floor(seconds / 60) + ':' + ('0' + Math.floor(seconds % 60)).slice(-2);
    const formattedTimer = secondsToMinutes(timer);

    
    useEffect(() => {
        window.addEventListener('load', () => setInterval(show, 200));
        window.addEventListener('click', handleClick);
        window.addEventListener('click', () => setInterval(show, 200));
        document.addEventListener('click', (e) => {
            if (e.target.matches('.modal') || e.target.matches('.close-form')) {
                document.querySelector('.modal').style.display = 'none';
            }
        })
    })

    useEffect(() => {
        if (elementsLeft.length < 1) {
            setIsGameOver(true);
            setStatus(`Wow! You found all the elements in ${timer} seconds.`);
            document.querySelector('.timer').textContent = `Timer: ${timer}`;
        }}, [timer, elementsLeft, isGameOver]); 

    useEffect(() => {
        const myTimer = setInterval(() => {
          if(!isGameOver) { 
            setTimer(timer + 1);
            }
        }, 1000);
        return () => clearInterval(myTimer);
      }, [isGameOver, timer]);

    useEffect(() => {
        document.querySelector('.status').style.opacity = 0;
    }, [status])

    // clean up checkmarks
    useEffect(() => {
        return () => {
            const checks = document.querySelectorAll('.check');
            checks.forEach(check => check.remove());
        }
    }, [])

    return (
        <div className='main'>
            <div className='header'>
                <h1>CHEMICAL ELEMENT SEARCH</h1>
                <div className='stats'>
                <span className='score'>Score: {score}</span>
                <span className='timer'>Timer: {formattedTimer}</span>
                </div>
            </div>
            <p className='status'>{status ? status : 'Find the elements listed in the right sidebar. Choose a spot in the periodic table to place each element.'}</p>
            
            <div className='content'>
            <div className='board'>
            <div>
                <img src={PeriodicTable} alt='periodic table' className='periodic-table'/>
            </div>
            <div ref={elementsList} className='message' style={{
                position: 'absolute', 
                top: `${yPos}px`, 
                left: `${xPos}px`, 
                zIndex: '100', 
                visibility: showElements ? 'visible' : 'hidden' }}>
                    <ul id='dropdown'>
                    {elementsLeft.map((item) => {
                        return (
                            <li className='dropdown-item' value={item.name} key={item.name} onClick={checkElementMatch}>
                                {item.name}
                            </li>
                        )
                    })}
                    </ul>
            </div>
            <div className='sidebar'>
                <ul>Elements Remaining:
                    {elementsLeft.map((item) => {
                        return (
                            <div className='element-item' key={item.name}>
                                {item.name}
                            </div>
                    )
                    })}
                </ul>
            </div>
            </div>
            </div>

            {isGameOver && 
            <div className='modal'>
                <div className='form'>
                <span className='close-form'>X</span>
                <span className='message'>Congratulations! You completed the round!</span>
                <input type='text' className='user-name' placeholder='Enter your name'></input>
                <button type='button' className='submit-button' onClick={handleSave}>Submit</button>
                </div>
            </div> }
        </div>

    )
}

export default Chemistry



