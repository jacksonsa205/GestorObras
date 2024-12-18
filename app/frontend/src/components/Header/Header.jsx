import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';  // Importe o componente Link
import './Header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faBell, faUser, faCog, faSignOutAlt, faFileAlt, faExpand,faCompress } from '@fortawesome/free-solid-svg-icons';
import user from "../../assets/images/logo/user.png";

export const Header = ({ toggleSidebar, isClosed }) => {

    const [menuOpen, setMenuOpen] = useState(false);
    const [hasNotifications, setHasNotifications] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [userCredentialMaster, setCredentialMaster] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const navigate = useNavigate();

    const checkAuthentication = async () => {
        try {
            console.log("Iniciando verificação de autenticação...");

            const response = await axios.get(`http://${process.env.REACT_APP_IP_APP}:${process.env.REACT_APP_PORT}/check-session`, {
                withCredentials: true,
            });

            if (response.status !== 200) {
                console.error("Status de resposta não 200. Redirecionando para a página de login.");
                navigate('/');
                return;
            }

            // Assumindo que 'data' é o objeto que contém as informações do usuário
            if (response.data) {
                if (Number(response.data.credencial) === 8) {
                    setCredentialMaster(true);
                }
                else {
                    setCredentialMaster(false);
                };

            } else {
                console.error("Dados ausentes ou inválidos na resposta do servidor.");
                navigate('/');
            }
        } catch (error) {
            console.error("Erro ao verificar a autenticação:", error);
            navigate('/');
        }
    };

    const handleToggleSidebar = async () => {
        setMenuOpen(!menuOpen);
        toggleSidebar();
    };

    const handleNewNotification = () => {
        setHasNotifications(true);
    };

    const handleUserMenuToggle = async () => {  // Adicione esta função
        await checkAuthentication();
        setUserMenuOpen(!userMenuOpen);
    };

    const handleLogout = async () => {
        try {
            const response = await axios.get(`http://${process.env.REACT_APP_IP_APP}:${process.env.REACT_APP_PORT}/logout`, {
                withCredentials: true,
            });

            if (response.status === 200) {
                console.log("Logout bem sucedido.");
                navigate('/');
            } else {
                console.error("Erro ao fazer logout:", response.status);
            }
        } catch (error) {
            console.error("Erro ao fazer logout:", error);
        }
    };

    const handleFullScreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            setIsExpanded(!isExpanded)
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
                setIsExpanded(!isExpanded)
            }
        }
    };

    return (
        <header className={isClosed ? 'header-collapsed' : 'header-expanded'}>
            <button className="menu-button" onClick={handleToggleSidebar}>
                <FontAwesomeIcon
                    icon={menuOpen ? faBars : faBars}
                    size="lg"
                    className="icon-menu-header"
                />
            </button>

            <button className="menu-button" onClick={handleFullScreen}>
            <FontAwesomeIcon
                icon={!isExpanded ? faExpand : faCompress}
                size="lg"
                className="icon-menu-header"
            />
            </button>

            <div className="notification-container" onClick={handleNewNotification}>
                {hasNotifications ? (
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                        <FontAwesomeIcon
                            icon={faBell}
                            size="lg"
                            className="icon-header"
                        />
                        <div
                            style={{
                                position: 'absolute',
                                top: '0',
                                right: '0',
                                backgroundColor: '#0066ff',
                                borderColor: '#fff',
                                borderRadius: '50%',
                                width: '7px',
                                height: '7px',
                                borderWidth: '1px',
                                borderStyle: 'solid',
                            }}
                        ></div>
                    </div>
                ) : (
                    <FontAwesomeIcon
                        icon={faBell}
                        size="lg"
                        className="icon-header"
                    />
                )}
            </div>

            <div className="user-container" onClick={handleUserMenuToggle}>
                <img src={user} alt="" className="logo-user" />
               
                {userMenuOpen && (
                    <div className={`user-menu ${userCredentialMaster ? 'master' : 'normal'}`}>
                        <div className="arrow-up"></div>
                        {userCredentialMaster ? (
                            <div>
                                <Link to="/user/logs">
                                    <FontAwesomeIcon icon={faFileAlt} className="icon-logs" />
                                    Logs
                                </Link>
                            </div>
                        ) : null}

                        <Link to="/user/configuracoes">
                            <FontAwesomeIcon icon={faCog} className="icon-config" />
                            Configuração
                        </Link>
                        <Link to="/logout" onClick={handleLogout}>
                            <FontAwesomeIcon icon={faSignOutAlt} className="icon-logout" />
                            Sair
                        </Link>
                    </div>
                )}
            </div>

        </header>
    );
}