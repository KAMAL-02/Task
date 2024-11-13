import React from 'react'
import Task1 from './components/Task1'
import Task2 from './components/Task2'
import Task3 from './components/Task3'
import ChartAccessLogs from './components/chartAccessLogs'
import { AuthButton } from './components/Authenticate'

const App = () => {
  return (
    <div>
      <div className='flex justify-end items-center'>
      <AuthButton />
      </div>
      <div className='flex flex-col justify-center items-center lg:flex-row'>
      <Task1 />
      <Task2 />
      </div>
      <Task3 />
      <ChartAccessLogs />
    </div>
  )
}

export default App
