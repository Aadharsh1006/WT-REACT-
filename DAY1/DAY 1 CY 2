import React,{useState} from 'react';
import './App.css';
const Res=()=>{
  return(
    <div>
    <ul class="ul">
    <li>North</li>
    <li>East</li>
    <li>West</li>
    <li>South</li>
  </ul>
  </div>
  )
}
const Arr=()=>{
  return (
    <div>
      <p>North news,East News,West News,South News</p>
  </div>
  )
}
 const App=()=>{
  const [ Component, setComponent ]=useState(null);
  return(
    <div>
      <div>{Component}</div>
      <button onClick={()=>setComponent(<Arr />)}>Array</button>
      <br/>
      <br/>
      <button onClick={()=>setComponent(<Res />)}>Refresh Array</button>
    </div>
  )
 }


export default App;
