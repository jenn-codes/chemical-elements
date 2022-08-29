import React from "react";
import { Link } from "react-router-dom";
import '../styles/Home.css';

const Home = () => {

    return (
        <div className="home-page">
            <h1>CHEMICAL ELEMENT SEARCH</h1>
            <span className="directions">Pick a level:</span>
            <div className="home-level">
            <Link to={'/easy-chemistry'}><div className="level-item">Easy</div></Link>
            
            <Link to={'/hard-chemistry'}><div className="level-item">Hard</div></Link>
            </div>
        </div>  
        )
}

export default Home;