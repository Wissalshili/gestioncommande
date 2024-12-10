import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../PagesStyle/Login.css';
import Modal from 'react-modal';
import { FaEnvelope, FaLock } from 'react-icons/fa';

Modal.setAppElement('#root');

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userType = localStorage.getItem('userType');
    const adminId = localStorage.getItem('adminId');
    const clientId = localStorage.getItem('clientId');

    if (userType === 'Admin' && adminId) {
      navigate('/admin-home');
    } else if (userType === 'Client' && clientId) {
      navigate('/client-home');
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/user/login', {
        email: email,
        password: password,
      });

      if (response.status === 200) {
        const user = response.data[0];

        localStorage.clear();
        if (user.client) {
          localStorage.setItem('userType', 'Client');
        } else if (user.admin) {
          localStorage.setItem('userType', 'Admin');
        }  else {
          console.error('User type not identified!');
          setLoginError(true);
          return;
        }

        localStorage.setItem('userId', user.id || '');
        localStorage.setItem('useremail', user.email || '');
        localStorage.setItem('userpassword', user.password || '');

        if (user.admin) {
          const { id, nom, prenom, numero } = user.admin;
          localStorage.setItem('adminid', id || '');
          localStorage.setItem('adminNom', nom || '');
          localStorage.setItem('adminPrenom', prenom || '');
          localStorage.setItem('adminnum', numero || '');
        }

        if (user.client) {
          const { id, nomC, prenom, telephone, adresse } = user.client;
          localStorage.setItem('clientid', id || '');
          localStorage.setItem('clientnom', nomC || '');
          localStorage.setItem('clientprenom', prenom || '');
          localStorage.setItem('clienttelephone', telephone || '');
          localStorage.setItem('clientadresse', adresse || '');

        }


        setLoginSuccess(true);
        setTimeout(() => {
          if (user.admin) {
            navigate('/admin-home');
          } else if (user.client) {
            navigate('/client-home');
          }
        }, 800);
      } else if (response.status === 204) {
        console.log("User doesn't exist!");
        setLoginError(true);
      } else {
        setLoginError(true);
        console.error('Login failed. Response data:', response.data);
      }
    } catch (error) {
      setLoginError(true);
      console.error('Error during login:', error.message);
    }
  };

  return (
    <div>
      <div className="login-container">
        <br />
        <br />
        <br />
        <div className="form-container-wrapper">
          <div className="form-container">
            <div className="logo-text-container">
              <div className="form-text">
                <h2 style={{ fontSize: '30px' }}>
                Welcome! Please log in to access your account.
                </h2>
              </div>
            </div>
          </div>
          <div className="form4-container">
            <h3>
              <Link to="/login" className="log">
              Login
              </Link>
              &nbsp;&nbsp;&nbsp;
              <span
                className="link"
                onClick={() => setIsModalOpen(true)}
                style={{ cursor: 'pointer', color: '#007bff' }}
              >
                Registration
              </span>
            </h3>
            <hr style={{ width: '340px', marginLeft: '-20px' }}></hr>
            <form onSubmit={handleLogin}>
              <div>
                <i>
                  <label htmlFor="login" style={{ marginLeft: '30px' }}>
                    Adresse email:
                  </label>
                </i>
                <div className="input-with-icon">
                  <FaEnvelope className="input-icon" />
                  <input
                    type="email"
                    id="email"
                    placeholder="Adresse email"
                    className={`login__input form-control ${loginError ? 'is-invalid' : ''}`}
                    value={email}
                    style={{ width: '270px', marginLeft: '10px', display: 'inline-block' }}
                    required
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setLoginError(false);
                    }}
                  />
                </div>
                <i>
                  <label htmlFor="password" style={{ marginLeft: '30px' }}>
                    Mot de passe:
                  </label>
                </i>
                <div className="input-with-icon">
                  <FaLock className="input-icon" />
                  <input
                    type="password"
                    id="password"
                    placeholder="Mot de passe"
                    className={`login__input form-control ${loginError ? 'is-invalid' : ''}`}
                    style={{ width: '270px', marginLeft: '10px', display: 'inline-block' }}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setLoginError(false);
                    }}
                  />
                </div>
              </div>
              <i>
                <p style={{ fontSize: '16px', color: 'black' }}>
                  <label>
                    <input type="checkbox" /> Se souvenir de moi sur cet appareil
                  </label>
                </p>
              </i>
              <div className="links">
                <button
                  type="submit"
                  className={`login-button ${loginSuccess ? 'move-animation' : ''}`}
                >
                  Se connecter
                </button>
              </div>
              <br />
              {loginError && (
                <p
                  className="error-message"
                  style={{
                    color: 'red',
                    fontSize: '16px',
                    textAlign: 'center',
                    marginLeft: '40px',
                  }}
                >
                  Login incorrects. Veuillez réessayer.
                </p>
              )}
              <a
                href="#"
                className="signup__forgot"
                style={{ textAlign: 'center', marginLeft: '20px' }}
              >
                Vous avez perdu votre mot de passe ?
              </a>
              <br />
            </form>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className="modal-content"
        overlayClassName="modal-overlay"
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
          content: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '450px',
            maxWidth: '80%',
            textAlign: 'center',
            borderRadius: '10px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            padding: '30px',
            background: '#f2fbff',
          },
        }}
      >
        <h2>Choose your registration type</h2>
        <button onClick={() => navigate('/registerA')} className="modal-button">
           Admin Registration
        </button>
        <button onClick={() => navigate('/registerC')} className="modal-button">
          Client Registration
        </button>

        <button onClick={() => setIsModalOpen(false)} className="modal-button close-button" style={{marginLeft: '120px', width: '170px' }}>
          close
        </button>
      </Modal>
    </div>
  );
};

export default Login;
