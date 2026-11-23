import { useState } from "react"
import { api } from '../src/api.js'
import { useNavigate } from "react-router"

function Login() {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()
        // console.log(username, password)

        // 로그인 처리 (fastapi한테 토큰 달라고 하기)
        try {
            const data = await api('/api/auth/login', {
                method: 'POST',
                body: new URLSearchParams({ username, password })
            })
            // console.log(data)

            localStorage.setItem('access_token', data.access_token)
            // fastAPI의 Redirection
            navigate('/')

        } catch(e) {
            setError(e.message)
            // 비밀번호만 초기화
            setPassword('')
        }
        // console.log(data)
    }

    // 기존 로그인 화면
    // return (
    //     <>
    //         <h1>로그인 페이지입니다.</h1>
    //         <form action="" onSubmit={ handleSubmit }>
    //             <input value={ username } type="text" onChange={ (e) => { setUsername(e.target.value) } } />
    //             <input value={ password } type="password" onChange={ (e) => { setPassword(e.target.value) } } />
    //             <button>제출</button>
    //             {/* <input type="submit" /> */}
    //         </form>
    //     </>
    // )

    return (
        <div className="card p-4 text-center">
            <h2 className="mb-4">insta</h2>
            <form className="d-grid gap-2" onSubmit={handleSubmit}>
                <input
                    className="form-control"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="아이디"
                    required
                />
                <input
                    className="form-control"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="비밀번호"
                    required
                />
                <button className="btn btn-primary">로그인</button>
            </form>
        </div>
    )
 }

export default Login