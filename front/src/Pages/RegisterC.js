import { useState } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, Link } from 'react-router-dom';
import '../PagesStyle/Register.css';
import { FaUser, FaMobileAlt, FaEnvelope, FaLock } from 'react-icons/fa';


function Registre() {
  const [firstname, setfirstname] = useState("");
  const [lastname, setlastname] = useState("");
  const [telephone, settelephone] = useState("");
  const [adresse, setadresse] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signupError, setSignupError] = useState(false);
  const [emailError, setemailError] = useState(false);
  const [passwordError, setpasswordError] = useState(false);
  const navigate = useNavigate();



  async function save(event) {
    event.preventDefault();

    setSignupError(false);
    setemailError(false);
    setpasswordError(false);

    if (!firstname || !lastname || !telephone || !adresse || !email || !password) {
      setSignupError(true);
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setemailError(true);
      return;
    }
  
    
    if (password.length < 6) {
      setpasswordError(true);
      return;
    }

    try {
      const requestData = {
        nom: firstname,
        prenom: lastname,
        telephone: telephone,
        adresse: adresse,
        email: email,
        password: password,
      };

      await axios.post("http://localhost:8080/user/RegisterC", requestData);
      navigate('/login');
    } catch (err) {
      setSignupError(true);
    }
  }

  return (
    <div className="sign-container">
      <br /><br /><br />
      <div className="form-container-wrapper">
        <div className="form2-container">
          <h2>
            <Link to="/login" className="">
            Login
            </Link>
            &nbsp;&nbsp;&nbsp;
            <Link to="/registerC" className="log">
            Registration
            </Link>
          </h2>
          <hr style={{ width: '345px', marginLeft: '-20px' }}></hr>
          <form className="form-signup">
            <div style={{ textAlign: 'center' }}>
              <b className="bold-text"><i>Please enter your information</i></b>
            </div>

            <div className="form-group">
              <FaUser className="input-icon" />
              <input
                type="text"
                className={`signup__input form-control ${signupError ? 'is-invalid' : ''}`}
                id="firstname"
                placeholder="Nom"
                value={firstname}
                style={{ width: '300px', marginLeft: '10px' }}
                onChange={(event) => setfirstname(event.target.value)}
              />
            </div>

            <div className="form-group">
              <FaUser className="input-icon" />
              <input
                type="text"
                className={`signup__input form-control ${signupError ? 'is-invalid' : ''}`}
                id="lastname"
                placeholder="Prénom"
                value={lastname}
                style={{ width: '300px', marginLeft: '10px' }}
                onChange={(event) => setlastname(event.target.value)}
              />
            </div>

            <div className="form-group">
              <FaMobileAlt className="input-icon" />
              <input
                type="telephone"
                className={`signup__input form-control ${signupError ? 'is-invalid' : ''}`}
                id="telephone"
                placeholder="Telephone"
                value={telephone}
                style={{ width: '300px', marginLeft: '10px' }}
                onChange={(event) => settelephone(event.target.value)}
              />
            </div>

            <div className="form-group">
              <FaUser className="input-icon" />
              <input
                type="text"
                className={`signup__input form-control ${signupError ? 'is-invalid' : ''}`}
                id="adresse"
                placeholder="Adresse"
                value={adresse}
                style={{ width: '300px', marginLeft: '10px' }}
                onChange={(event) => setadresse(event.target.value)}
              />
            </div>

            <div className="form-group">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                className={`signup__input form-control ${signupError ? 'is-invalid' : ''} ${emailError ? 'is-invalid' : ''}`}
                id="email"
                placeholder="Adresse email"
                value={email}
                style={{ width: '300px', marginLeft: '10px' }}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>

            <div className="form-group">
              <FaLock className="input-icon" />
              <input
                type="password"
                className={`signup__input form-control ${signupError ? 'is-invalid' : ''} ${passwordError ? 'is-invalid' : ''}`}
                id="password"
                placeholder="Mot de passe"
                value={password}
                style={{ width: '300px', marginLeft: '10px' }}
                onChange={(event) => setPassword(event.target.value)}
                onFocus={() => setpasswordError(false)}
              />
            </div>

            <button type="submit" className="sign-button" onClick={save}>Save</button><br />
            {signupError && (
              <i><p className="error-message" style={{ color: 'red', fontSize: '18px', textAlign: 'center', marginLeft: '40px' }}>Veuillez remplir tous les champs !</p></i>
            )}
            {emailError && (
              <i><p className="error-message" style={{ color: 'red', fontSize: '18px', textAlign: 'center', marginLeft: '30px' }}>Format d'email invalide !</p></i>
            )}
            {passwordError && (
              <i><p className="error error-message" style={{ color: 'red', fontSize: '18px', textAlign: 'center', marginLeft: '10px' }}>Format de mot de passe invalide !</p></i>
            )}
          </form>
        </div>
        <div className="form3-container">
          <div className="logo-text-container">
            <div className="form-text">
              <h2 style={{ fontSize: "30px" }}>
                Create a New Account<br />
                <span style={{ fontSize: "18px" }}>
                Complete the form below to register and access your client account.
                </span>
              </h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Registre;
