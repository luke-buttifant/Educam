import React from "react"
import "./App.css"
import NavBar from "./components/navbar"
import Profile from "./pages/profile"
import Login from './pages/login'
import Register from "./pages/register"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Calendar from './pages/calendar'

function App() {
	if (localStorage.theme === 'dark') {
		document.documentElement.classList.add('dark')
		document.documentElement.classList.remove('bg-background')
		document.documentElement.classList.add("bg-dark-mode")
	  } else {
		document.documentElement.classList.remove('dark')
		document.documentElement.classList.remove('bg-dark-mode')
		document.documentElement.classList.add("bg-background")
	  }

	return (
		<>
		<div className="dark:bg-dark-mode bg-none min-h-screen bg-no-repeat">
		
			<Router>
			<NavBar />
				<Routes>
					<Route path='/Profile' element={<Profile />}/>
					<Route path='/login' element={<Login />}/>
					<Route path='/register' element={<Register />}/>
					<Route path='/calendar' element={<Calendar />}/>

				</Routes>
			</Router>
		</div>
		</>
	)
}

export default App
