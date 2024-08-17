import React, { useState } from 'react';
import './App.css'; 

export default function Login() {
    const [state, setState] = useState(false);
    const handleSubmit = (e) => {
        e.preventDefault(); 
        setState(!state);
    };

    return (
        <div>
            <button type="submit" onClick={handleSubmit}>{state?"Hide content":"Show content"}</button>
            {state&&<p>Hii, How are You</p>}
        </div>
    );
}
