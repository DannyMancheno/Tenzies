import react, {useState, useEffect, useRef} from 'react';
import {nanoid} from 'nanoid'
import '../index.css';
import Die from  '../components/Die';
import Confetti from 'react-confetti';

export default function App() {
    let [dice, updateDice] = useState(allNewDice());
    let [tenzies, updateTenzies] = useState(false);

    let [totalRolls, updateTotalRolls] = useState(1);

    let [gameActive, updateGameActive] = useState(false);
    let [timeValue, updateTimeValue] = useState(0);
    let [timeBest, updateTimeBest] = useState(localStorage.getItem('timebest'));
    let timeInterval = useRef(null);    

    useEffect(()=>{
        let heldNumber = null;
        let totalHeld = 0;
        dice.forEach(item =>{
            if(item.isHeld && !heldNumber){
                heldNumber = item.value;
            }
            if(item.isHeld && item.value == heldNumber){
                totalHeld++;
            }
        })
        if(totalHeld == dice.length){
            updateTenzies(true);
            updateGameActive(false);
            if(timeValue < timeBest || timeBest == null){
                localStorage.setItem('timebest', timeValue);
                updateTimeBest(timeValue)
            }
        }
    }, [dice])
    useEffect(()=>{
        if(gameActive && !timeInterval.current){
            timeInterval.current = setInterval(()=>{
                updateTimeValue((old)=>{
                    return old + 10;
                });
            }, 10)
        }
        else{
            clearInterval(timeInterval.current);
            timeInterval.current = null;
        }
    }, [gameActive])
    function allNewDice(){
        let diceArray = []
        for(let i = 0; i < 10; i++){
            diceArray.push({
                value: Math.floor(Math.random() * 6 + 1),
                isHeld: false,
                id: nanoid(),
            });
        }
        return diceArray
    }
    function rollDice(){
        let newDice = allNewDice();
        if(tenzies){
            // The 'doll' dice button became 'new game' and *was clicked*
            updateTenzies(false); 
            updateDice(newDice);
            updateTotalRolls(1);
            updateGameActive(false);
            updateTimeValue(0);          
        }
        else{
            updateTotalRolls(old => {return old + 1});
            updateDice(oldDice =>{
                return oldDice.map(
                    (die, index)=>{ return die.isHeld ? die : newDice[index] }
                )
            })
            if(!gameActive){
                updateGameActive(true);
            }
        }
    }
    function holdDice(dieId){
        if(!gameActive){
            updateGameActive(true);
        }
        updateDice(dice.map(die => die.id == dieId ? {...die, isHeld: !die.isHeld} : die));
    }
    return (
        <div className='appContainer'>
            {tenzies && <Confetti />}
            <main>
                <div className='gameInfoContainer'>
                    <h1>Tenzies</h1>
                    <p>
                        Roll untill all dice are the same. Click each die to 
                        freeze it at it's current value between rolls. 
                    </p>
                </div>
                <div className='diceContainer'>
                    {dice.map((die, index)=>{
                        return (
                            <Die key={die.id} 
                                 value={die.value} 
                                 isHeld={die.isHeld}
                                 id={die.id}
                                 passHoldDice={holdDice}
                            />
                        )
                    })}
                </div>
                <div className='gameTimeContainer'>
                    <div className='currentTime'>Current: {timeValue}</div>
                    <div className='bestTime'>Best: {timeBest === null ? 'N/A': timeBest}</div>
                </div>
                <button className='rollButton' onClick={()=>{
                    rollDice();
                }}>{tenzies ? 'New Game' : `Roll ${totalRolls > 1 ? totalRolls : ''}`}</button>
            </main>
        </div>
    );
}


