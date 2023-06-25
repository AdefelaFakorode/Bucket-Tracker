import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import Display from './componenets/Display.jsx'
//import NavBar from './componenets/NavBar.jsx'
//import Footer from './componenets/Footer.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <Display />
  </React.StrictMode>,
)
