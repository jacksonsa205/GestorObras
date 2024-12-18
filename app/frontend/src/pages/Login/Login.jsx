import React, { useState, useEffect } from 'react';
import { FaUser, FaLock, FaTimes } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { BeatLoader } from 'react-spinners';
import './Login.css'; // Estilos CSS podem ser adicionados aqui
import imagem from "../../assets/images/logo/signalmonitoLogoDash2.png";
import axios from "axios";
import { useNavigate, Link } from 'react-router-dom';
import Authenticator from '../../helpers/authenticator.jsx';

export const Login = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState('');
  const [mensagemErro, setMensagemErro] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [forgotPasswordModalVisible, setForgotPasswordModalVisible] = useState(false);
  const [createAcountModalVisible, setCreateAcountModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [captchaModalVisible, setCaptchaModalVisible] = useState(false);
  const [captchaValidated, setCaptchaValidated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginCheck, setLoginCheck] = useState(false);
  const [showAuthenticator, setShowAuthenticator] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (modalVisible) {
      timer = setTimeout(() => {
        setModalVisible(false);
      }, 9091); // 9091 milissegundos = 5 segundos
    }

    return () => {
      clearTimeout(timer); // Limpar o timer se o componente for desmontado antes do término
    };
  }, [modalVisible]);

  const handleLogin = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setMensagemErro('');
  
    try {
      // Chame a rota do backend para autenticação
      const response = await axios.post(
        `/`, // Ajuste para a rota correta
        { login, password }, // Envie login e senha no corpo
        { withCredentials: true } // Inclua credenciais se necessário
      );
  
      if (response.status === 200) {
        // Sucesso no login
        setMensagemErro('Login efetuado com sucesso!');
        setModalVisible(true);
        setLoginCheck(true);
        navigate('/dashboard'); // Redireciona para o dashboard
      }
    } catch (error) {
      // Tratamento de erros
      if (error.response && error.response.status === 401) {
        setMensagemErro('Credenciais inválidas. Por favor, tente novamente.');
      } else {
        setMensagemErro('Erro ao realizar login. Tente novamente mais tarde.');
      }
      setModalVisible(true);
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleForgotPasswordClick = () => {
    setForgotPasswordModalVisible(true);
  };

  const handleCreateAcountClick = () => {
    setCreateAcountModalVisible(true);
  };

  return (
    <div className="body-container">
      <div className='login-container'>
        <div className="login-input">
          <img src={imagem} alt="" className="logo" />
          <div className="message">Faça o login para continuar</div>
          <form onSubmit={handleLogin} className="login-form">
            <div className="input-container">
              <FaUser className="icon" />
              <input
                id="login"
                type="text"
                placeholder="Digite seu E-mail"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
              />
            </div>

            <div className="input-container">
              <FaLock className="icon" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: 10, top: 10, cursor: 'pointer' }}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </span> 
            </div>

            <button className="button-login" type="submit" disabled={isLoading}>
              {isLoading ? (
                <BeatLoader color="#fff" size={8} />
              ) : (
                'Entrar'
              )}
            </button>
            <div className="login-links">
              <div className="login-senha">
                <Link to="#" onClick={handleForgotPasswordClick}>Esqueceu a senha?</Link>
              </div>
              <div className="login-cadastro">
                <Link to="#" onClick={handleCreateAcountClick}>Cadastre-se</Link>
              </div>
            </div>
          </form>
        </div>
      </div>

      {modalVisible && (
        <div className={`custom-modal ${!loginCheck ? 'error' : 'success'}`}>
          <div className="modal-content">
            <p>{mensagemErro}</p>
            <div className="progress-bar"></div>
          </div>
        </div>
      )}

      {forgotPasswordModalVisible && (
        <div className="custom-modal-alert">
          <div className="modal-content-alert">
            <div className="close-button" onClick={() => setForgotPasswordModalVisible(false)}>
              <FaTimes />
            </div>
            <div className='modal-title-alert'>Recuperação de senha</div>
            <div className='modal-message-alert'>
              <p>O acesso é via rede corporativa. Utilize seu RE e senha de rede para acessar o sistema.</p>
              <p>Dúvidas:</p>
              <ul>
                <li>Acesso para técnicos das empresas parceiras: Utilizar o mesmo login e senha de acesso ao ETA (ZEUS).</li>
                <li>Reset de senha deve ser feito pelo gestor CLS de cada cluster/parceira.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {createAcountModalVisible && (
        <div className="custom-modal-alert">
          <div className="modal-content-alert">
            <div className="close-button" onClick={() => setCreateAcountModalVisible(false)}>
              <FaTimes />
            </div>
            <div className='modal-title-alert'>Criar Cadastro</div>
            <div className='modal-message-alert'>
              <p>Os cadastro devem ser solicitado por e-mail. Envie os dados para: anderson.nascimento@telefonica.com</p>
              <p>Dúvidas:</p>
              <ul>
                <li>Acesso para colaboradores das empresas parceiras: Utilizar o mesmo login e senha de acesso ao ETA (ZEUS).</li>
                <li>Reset de senha deve ser feito pelo gestor CLS de cada cluster/parceira.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {showAuthenticator && <Authenticator login={login} />}
    </div>
  );
};