import React,{useState} from 'react';
import './App.css';
const App=()=>{
  const[name,Setname]=useState("");
  const[email,Setemail]=useState("");
  const[mes,Setmes]=useState("");
  const A=(e)=>{
    
    console.log({name,email,mes});
  }
  return(
    <div>
      <form>
        <p>Name</p>
        <input type="text" placeholder="Enter your name" value={name} onChange={(e)=>Setname(e.target.value)}/>
        <p>Email</p>
        <input type="email" placeholder="Enter your Email" value={email} onChange={(e)=>Setemail(e.target.value)}/>
        <p>Message</p>
        <input type="text" placeholder="Enter your Message" value={mes} onChange={(e)=>Setmes(e.target.value)}/>
      </form>
      <button onClick={A}>Click</button>
    </div>
  )
 }
export default App;
