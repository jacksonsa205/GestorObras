import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import imagem from "../../src/assets/images/logo/signalmonitoLogoDash2.png";
import imagem2 from "../../src/assets/images/logo/2fa.png";
import "./authenticator.css";

const Authenticator = ({ login }) => {
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [token, setToken] = useState('');
  const [verified, setVerified] = useState(false);
  const navigate = useNavigate();

  const generateSecret = async () => {
    const response = await axios.post('/google/generate-secret', { login });
    setQrCode(response.data.qrCode);
    setSecret(response.data.secret);
  };

  const verifyToken = async () => {
    const response = await axios.post('/google/verify-token', { token, login });
    setVerified(response.data.verified);
    if (response.data.verified) {
      navigate('/dashboard');
    } else {
      alert('Token inválido. Tente novamente.');
    }
  };

  return (
    <div className="authenticator-container">
      <img src={imagem} alt="" className="logo" />
      <div className="message">2FA Aunthenticator</div>
      {qrCode && <img className="qr-code" src={qrCode} alt="QR Code" />}
      {!qrCode && <img className="imagem" src={imagem2} alt="QR Code" />}
      <input
        className="auth-input"
        type="text"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        placeholder="Digitar token"
      />
      <div className='auth-button-section'>
        <button className="auth-button" onClick={generateSecret}>Gerar QR Code</button>
        <button className="auth-button" onClick={verifyToken}>Verificar Token</button>
      </div>
      {verified && <p className="verified-message">Token Verificado!</p>}
    </div>
  );
};

export default Authenticator;