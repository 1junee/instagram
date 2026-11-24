import { createContext, useContext, useState, useEffect } from "react";
import { api } from '../src/api.js'

const AuthContext = createContext(null)


// 여러개 뽑을 땐 함수 앞에 export
export function AuthProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem('access_token'))
    const [user, setUser] = useState(null)

    // { 이떄 실행이 됨 } [안의 값이 변경될 때마다]
    useEffect(() => {  
        async function load() {
            if (!token) return
            try {
                setUser(await api('/api/auth/me', { headers: {Authorization: `Bearer ${token}`} }))
            } catch (e) {
                logout()
            } 
        }

        load()

    }, [token])


    async function login(username, password) {  
        const data = await api('/api/auth/login', {
            method: 'POST',
            body: new URLSearchParams({ username, password })
        })
        setToken(data.access_token)
        localStorage.setItem('access_token', data.access_token)
    }
    function logout() {  
        setToken(null)
        setUser(null)
        localStorage.removeItem('access_token')
    }

    return <AuthContext value={{ token, user, login, logout }}>{ children }</AuthContext>
}

// 하위 컴포넌트에서 provider의 state에 접근하기 위한 함수
export function useAuth() {
    return useContext(AuthContext)
}


// 하나만 뽑을 땐
// export default