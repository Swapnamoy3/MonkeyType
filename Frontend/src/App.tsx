// App.jsx

import './App.css' 
import { useState, useEffect, useCallback, useRef, use } from 'react'
const text = "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Perferendis qui consequatur necessitatibus nobis repellendus vero saepe. Quaerat odio omnis, atque suscipit alias corrupti, ab dolor accusamus quidem, ipsum illo doloribus.";

function stats(inputString: string, targetString: string): Map<string, number> {
  let misTypedMap: Map<string, number> = new Map<string, number>();
  for(let i = 0; i<inputString.length;i++){
    if(inputString[i]!==targetString[i]){
      if(misTypedMap.has(targetString[i])){
        misTypedMap.set(targetString[i], (misTypedMap.get(targetString[i]) || 0) + 1);
      }else{
        misTypedMap.set(targetString[i], 1);
      }
    }
  }
  return misTypedMap;
}

function App() {

  const [input, setInput] = useState<string>("");
  const target = text;

  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDialogElement>(null);
  let startTime = -1;
  const [time, setTime] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  
  useEffect(() =>{
    inputRef.current?.focus();
    document.addEventListener("click", ()=>{
      inputRef.current?.focus();
    })

    const interval = setInterval(() => {
      if(startTime !== -1){
        setTime(Math.floor((Date.now() - startTime)/10)/100);
      }
    }, 100);
    
    return () => clearInterval(interval);
  }, [])

  

  const cursor = <span className="inline-block text-yellow-400 animate-pulse">|</span>;
  return (
    <div className="bg-[#000000e1] flex flex-col justify-center items-center w-full h-screen">
      <button
        className="text-white text-lg"
        onClick={() => modalRef.current?.showModal()}
      >stats</button>
      <dialog ref = {modalRef}>
          <button 
          onClick={() => modalRef.current?.close()}
          >close</button>
          {stats(input, target).size === 0 ? <p className="text-center">No mistakes</p> : Array.from(stats(input, target)).map(([key, value]) => {
            return <p key = {key}>{key}: {value}</p>
          })}
      </dialog>
      <span className='text-white text-lg'>Time: {startTime != -1? 0: time}</span>
      <span className='text-white text-lg'>Accuracy: {startTime != -1? 0: accuracy}</span>
      <div className='bg-[#ffffff10] flex flex-col justify-between py-[10rem] items-center w-[93%] h-[90%] rounded-lg'>
        
        <input
          className=' opacity-0 absolute top-[-9999px]  '
          ref={inputRef}
          onInput={(e: React.FormEvent<HTMLInputElement>) => {
            if(startTime == -1)
              startTime = Date.now();
            const x = e.currentTarget.value;
            setInput(x)
            let statMap = 0;
            for(let i = 0; i<input.length; i++){
              if(input[i]!==target[i]){
                statMap++;
              }
            }
            setAccuracy(statMap == 0? 100: Math.floor((text.length-statMap)/text.length*100));
            // console.log(e.currentTarget.value)
          }}
        ></input>
        
        <h1 className='text-5xl/12 text-[#ffffff30] w-3/4'>
          {target.split("").map((char, i) => {
            let className = ""

            if(i < input.length){
              className = (input[i] === char) ? "text-green-400": "text-red-500";
              
            }

            
            return <span key = {i} className = {className}>
              {i == input.length? cursor: null}
                {char}
              </span>;
          })}
        </h1> 


      </div>

    </div>
  )
}

export default App
