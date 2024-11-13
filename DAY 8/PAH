import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toggleTheme } from '../redux/ThemeAction';

const Theme = () => {

    const dispatch = useDispatch();
    const theme = useSelector((state) => state.theme.theme)
    const style = {
        width: '100%',
        height: '100vh',
        backgroundColor: theme,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    }

    const btn = {
        backgroundColor: 'gray',
        color: 'white',
        padding: '10px',
        cursor: 'pointer',
    }

    return (
        <div style={style} data-testid='theme-container'>
            <button style={{ ...btn, width: '120px' }} onClick={() => dispatch(toggleTheme())}>Theme</button>
        </div>
    )
}

export default Theme;
