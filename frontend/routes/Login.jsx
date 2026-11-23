import { useState } from "react"
import { api } from '../src/api.js'

function Login() {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    async function handleSubmit(e) {
        e.preventDefault()
        // console.log(username, password)
        // setPassword('')

        // 로그인 처리 (fastapi한테 토큰 달라고 하기)
        const data = await api('/api/auth/login', {
            method: 'POST',
            body: new URLSearchParams({ username, password })
        })
        console.log(data)
    }

    return (
        <>
            <h1>로그인 페이지입니다.</h1>
            <form action="" onSubmit={ handleSubmit }>
                <input value={ username } type="text" onChange={ (e) => { setUsername(e.target.value) } } />
                <input value={ password } type="password" onChange={ (e) => { setPassword(e.target.value) } } />
                <button>제출</button>
                {/* <input type="submit" /> */}
            </form>
        </>
    )
 }

export default Login