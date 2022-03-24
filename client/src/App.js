import React from "react"
import "./App.css"
import NavBar from "./components/navbar"
import Profile from "./pages/profile"
import Login from './pages/login'
import Register from "./pages/register"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Calendar from './pages/calendar'
import Dashboard from "./pages/dashboard"
import Stream from "./pages/stream"



function App() {


	if (localStorage.theme === 'dark') {
		document.documentElement.classList.add('dark')
		document.documentElement.classList.add("bg-dark-mode")
	  } else {
		document.documentElement.classList.remove('dark')
		document.documentElement.classList.remove('bg-dark-mode')
	  }

	return (
		<>
		<div id="rootChild" className="dark:bg-dark-mode bg-none min-h-screen bg-no-repeat">
		
			<Router>
			<NavBar />
				<Routes>
				<Route path='/' element={<Dashboard />}/>
				<Route path='/stream' element={<Stream />}/>
					<Route path='/dashboard' element={<Dashboard />}/>
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
