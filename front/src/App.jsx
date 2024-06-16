import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Register from './pages/register/register'
import Login from './pages/login/login'
import Home from './pages/home/home'
import Subslist from './pages/subslist/subslist'
import User from './pages/user/user'
import Addsub from './pages/addsub/addsub'
import { Layout } from './layout'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/' element={<Layout />}>
            <Route path='/' element={<Home />} />
            <Route path='/subslist' element={<Subslist />} />
            <Route path='/user' element={<User />} />
            <Route path='/addsub' element={<Addsub />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
