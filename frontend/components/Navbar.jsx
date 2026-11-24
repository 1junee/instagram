import { Link } from 'react-router'
import { useAuth } from '../hooks/useAuth.jsx'

function Navbar () {
    const { token, logout, user } = useAuth()

    return (
        <nav className="navbar bg-white border-bottom sticky-top px-3">
            <Link className="navbar-brand" to="/">insta</Link>
            { token ?
                <>
                    { user && <b>{ user.username }</b> }
                    <button className="btn btn-sm btn-outline-danger" onClick={ logout }>logout</button>
                </>
            :
                <Link className="btn btn-sm btn-outline-secondary" to="/login">login</Link>
            }
        </nav>
    )
}

export default Navbar