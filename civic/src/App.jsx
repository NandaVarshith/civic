import './App.css'
import {Routes , Route} from 'react-router-dom'

function App() {
  

  return (
    <>
    <Routes>
      <Route path="/" element={<div>Home</div>}></Route>
      <Route path="/about" element={<div>About</div>}></Route>
    </Routes>
      
    </>
  )
}

export default App
