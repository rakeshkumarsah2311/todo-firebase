
import './App.css'
import "./index.scss"

import TasksPage from './components/TasksPage'
import Welcome from './components/Welcome'

import { BrowserRouter as Router, Routes, Route  } from "react-router-dom";
import { useState } from 'react';

function App() {

  const [user, setUser ] = useState()

  return <Router>
    <Routes>
      <Route path='/' element={<Welcome setUser={setUser} />}></Route>
      <Route path='/mytasks' element={<TasksPage user={user} setUser={setUser} />}></Route>
    </Routes>
  </Router>
}


export default App
