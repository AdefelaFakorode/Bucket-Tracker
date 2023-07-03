import './App.css'
import Table from './componenets/Table.jsx'
import { BrowserRouter,Routes,Route } from 'react-router-dom';

function App() {
    return(
        <BrowserRouter>
        <Routes>
            <Route 
            path='/'
            element = {<Table />}
            />
        </Routes>
        </BrowserRouter>
    )
}

export default App;
