import React, { useState, useEffect } from "react";
import "./Configuracoes.css";
import { Header } from '../../../components/Header/Header';
import { Sidebar } from '../../../components/Sidebar/Sidebar';
import { toggleSidebar } from '../../../helpers/toggleSidebar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BeatLoader } from 'react-spinners';
import InputMask from 'react-input-mask';

export const Configuracoes = () => {

    const [isClosed, setClosed] = useState(false);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [userData, setUserData] = useState({});
    const [userId, setUserId] = useState();
    const [celular, setCelular] = useState();
    const [re, setRe] = useState();

    useEffect(() => {
        const checkAuthentication = async () => {
            try {
                console.log("Iniciando verificação de autenticação...");

                const response = await axios.get(`/check-session`, {
                    withCredentials: true,
                });

                if (response.status !== 200) {
                    console.error("Status de resposta não 200. Redirecionando para a página de login.");
                    navigate('/');
                    return;
                }

                // Assumindo que 'data' é o objeto que contém as informações do usuário
                if (response.data) {
                    fetchData(response.data.userId);
                    setUserId(response.data.userId);
                } else {
                    console.error("Dados ausentes ou inválidos na resposta do servidor.");
                    navigate('/');
                }
            } catch (error) {
                console.error("Erro ao verificar a autenticação:", error);
                navigate('/');
            }
        };

        checkAuthentication();
    }, [navigate]);

    const fetchData = async (idUser) => {
        try {
            const response = await axios.get(`/user/configuracoes?idUser=${idUser}`, {
                withCredentials: true,
            });
            setUserData(response.data.verificaDadosUser[0]);
            setCelular(response.data.verificaDadosUser[0].CELULAR);
            setRe(response.data.verificaDadosUser[0].RE);

        } catch (error) {
            console.error("Erro ao obter os dados:", error);
        }
    };

    const salvarDados = async (idUser, idCelular, idRE) => {

        setIsLoading(true);
        try {
            const response = await axios.put(`/user/configuracoes?ID=${idUser}&CELULAR=${idCelular}&RE=${idRE}`, {
            }, {
                withCredentials: true,
            });
            console.log("Resposta do servidor:", response);
            alert("Dados alterados com sucesso:");
            setIsLoading(false);

        } catch (error) {
            console.error("Erro ao enviar os dados:", error);
            alert("Erro ao enviar os dados:", error);
            setIsLoading(false);
        }
    }




    return (
        <>
            <Header toggleSidebar={() => toggleSidebar(isClosed, setClosed)} />
            <Sidebar isClosed={isClosed} toggleSidebar={() => toggleSidebar(isClosed, setClosed)} />
            <div className={`user-page-section ${isClosed ? 'closed' : 'open'}`}>
                <div className="user-title">Configurações</div>
                <div className="user-descricao">Perfil do Usuário</div>
                <div className="user-data-container">
                    <div className="user-data-edit">
                        <div className="user-card-data-edit" >
                            Nome:
                            <input
                                className="user-input user-input-disabled"
                                type="text"
                                value={userData.NOME}
                                disabled
                            />
                        </div>
                        <div className="user-card-data-edit">
                            Telefone:
                            <InputMask
                                className="user-input"
                                mask="(99) 99999-9999"
                                onChange={(e) => setCelular(e.target.value)}
                                value={celular}
                            />
                        </div>
                        <div className="user-card-data-edit">
                            Login:
                            <input
                                className="user-input user-input-disabled"
                                type="text"
                                value={userData.EMAIL}
                                disabled
                            />
                        </div>
                        <div className="user-card-data-edit">
                            RE:
                            <input
                                className="user-input user-input-disabled"
                                type="text"
                                value={re}
                                onChange={(e) => setRe(e.target.value)}
                                disabled
                            />
                        </div>
                        <div className="user-button-container">
                            <button
                                className={`user-salvar-button ${isLoading ? 'loading' : ''}`}
                                type="submit"
                                disabled={isLoading}
                                style={{ backgroundColor: isLoading ? '#0066ff' : '' }}
                                onClick={() => salvarDados(userId, celular, re)}
                            >
                                {isLoading ? (
                                    <BeatLoader color="#fff" size={8} />
                                ) : (
                                    'Salvar'
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="user-data-order">
                        <div className="user-card-data-nome" >
                            <span>Nome: {userData.NOME}</span>
                        </div>
                        <div className="user-card-data-dados">
                            Último acesso:
                            <span>{userData.PENULTIMO_ACESSO}</span>
                        </div>
                        <div className="user-card-data-dados">
                            Login:
                            <span>{userData.EMAIL}</span>
                        </div>
                        <div className="user-card-data-dados">
                            Regional:
                            <span>{userData.REGIONAL}</span>
                        </div>
                        <div className="user-card-data-dados">
                            Contrato:
                            <span>{userData.CONTRATO}</span>
                        </div>
                        <div className="user-card-data-dados">
                            Credencial:
                            <span>{userData.CRED}</span>
                        </div>
                    </div>
                </div>
            </div>
            <footer className="footer">Gestor360 © 2024</footer>


        </>
    );
}    