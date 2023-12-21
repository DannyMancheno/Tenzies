import react, {useState, useEffect} from 'react';
import { nanoid } from 'nanoid';

export default function Die(props){
    
    let dots = Array(props.value).fill(null);
    let dieClassString = `dieContainer ${`DC${props.value}`} ${props.isHeld ? 'isHeld' : 'shakeDie'}`
    return (
        <div 
            className={dieClassString}
            onClick={()=> props.passHoldDice(props.id)}
        >
            {
                dots.map((dot, ind)=>{
                    return <div className='dot' key={nanoid()} />
                })
            }
        </div>
    )
}


