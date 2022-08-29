import './App.css';
import Chemistry from './pages/Chemistry';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { elementMapEasy } from './pages/ChemistryEasy';
import { elementMapHard } from './pages/ChemistryHard';
import Home from './pages/Home';
import Leaderboard from './pages/Leaderboard';


function App() {




  let easy=elementMapEasy;
  let hard=elementMapHard;


  return (
    <div className="App">

      <BrowserRouter>
        <Routes>
          <Route exact path="/chemical-elements/easy-chemistry" element={ <Chemistry difficulty={easy} /> } />
          <Route exact path="/chemical-elements/hard-chemistry" element={ <Chemistry difficulty={hard} /> } />
          <Route exact path="/chemical-elements/" element={ <Home/> } />
          <Route exact path="/chemical-elements/leaderboard" element={ <Leaderboard /> } />


        </Routes>
      </BrowserRouter>      
    </div>
  );
}



export default App;
