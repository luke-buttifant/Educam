import React from "react"
import "./App.css"
import NavBar from "./components/navbar"
import Profile from "./pages/profile"
import Login from './pages/login'
import Register from "./pages/register"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Calendar from './pages/calendar'
import Stream from "./pages/stream"
import Permissions from './pages/permissionBarrier'
import StudentDashboard from "./pages/StudentDashboard"
import TeacherDashboard from "./pages/TeacherDashboard"
import Viewer from "./pages/viewer"



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
				<Route path='/permissions' element={<Permissions />}/>
				<Route path='/studentDashboard' element={<StudentDashboard />}/>
				<Route path='/teacherDashboard' element={< TeacherDashboard/>}/>
				<Route path='/stream' element={<Stream />}/>
					<Route path='/Profile' element={<Profile />}/>
					<Route path='/login' element={<Login />}/>
					<Route path='/register' element={<Register />}/>
					<Route path='/calendar' element={<Calendar />}/>
					<Route path='/viewer' element={<Viewer />}/>
					

				</Routes>
			</Router>
		</div>
		</>
	)
}

export default App
