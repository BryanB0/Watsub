import { Outlet, useLocation, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"

export const Layout = () => {

    const navigate = useNavigate()
    const {pathname} = useLocation

    const [me, setMe] = useState()


    useEffect(() => {
        fetch('http://localhost:3000/users/protected', {
        })
            .then(res => res.json())
            .then(data => {
                setMe(data)
                data ? null : navigate('/login')
            })
            .catch(console.error)
    }, [pathname])

    return (
        <>
        <Outlet  context={{me}} />
        </>
    )
}