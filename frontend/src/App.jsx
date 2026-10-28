import { signInWithPopup } from 'firebase/auth'
import React, { useEffect } from 'react'
import { MotionConfig } from 'motion/react'
import { auth, googleProvider } from '../utils/firebase'
import api from '../utils/axios'
import Home from './pages/Home'
import getCurrentUser from './features/getCurrentUser'
import { useDispatch, useSelector } from 'react-redux'
import { setUserdata } from './redux/userSlice'

function App() {

const dispatch=useDispatch()
const { theme, reduceMotion } = useSelector(state => state.preferences)

useEffect(()=>{
  const getUser=async ()=>{
    const data=await getCurrentUser()
    dispatch(setUserdata(data))
  }
  getUser()
},[])

useEffect(() => {
  document.documentElement.setAttribute("data-theme", theme)
}, [theme])

  return (
   <MotionConfig reducedMotion={reduceMotion ? "always" : "never"}>
   <Home/>
   </MotionConfig>
  )
}

export default App