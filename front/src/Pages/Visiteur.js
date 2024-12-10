import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import '../PagesStyle/Visiteur.css';
import { useNavigate } from 'react-router-dom';
import x from '../Images/image.png';

Modal.setAppElement('#root');

const Home = () => {
  const [isLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    
  
  }, []);

 
  const handleLogin = () => {
    try {
      setTimeout(() => {
        navigate('/login');
      }, 100);
    } catch (error) {
      console.error('Error removing items from localStorage:', error);
    }
  };

  
  return (
    <div className="home2-container">
      <nav className="navbar">
        <div class="logo2-container" style={{marginRight:'1250px',marginTop:'-10px'}}></div>
        <div className="header">
          <div className="navbar-buttons">
              <React.Fragment>
              <button className={`login3-animation ${isLoggedIn ? 'hidden' : ''}`} onClick={handleLogin}>
                Se connecter
              </button>
              </React.Fragment>
          </div>
        </div>
        
      </nav>
      <div className="content">
      <img src={x} width=" 150px" className="image" alt="Background"></img>
      </div>

    </div>
  );
};

export default Home;
