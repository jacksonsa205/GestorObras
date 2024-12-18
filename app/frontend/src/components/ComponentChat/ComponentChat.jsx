import React, { useState, useEffect, useRef } from 'react';
import './ComponentChat.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import io from 'socket.io-client';
import dani from "../../assets/images/logo/dani2.png";
import daniGifOperadorOff from "../../assets/images/logo/daniGifOperadorOff.mp4";
import daniGifOperadorOn from "../../assets/images/logo/daniGifOperadorOn.mp4";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// import { BeatLoader } from 'react-spinners';



export const ComponentChat = () => {
  const [selecionar, setSelecionar] = useState('');
  const [userId, setUserId] = useState('');
  const [userIdTecnico, setUserIdTecnico] = useState('');
  // const [terminal, setTerminal] = useState('');
  const [userNome, setUserNome] = useState('');
  const [userStatus, setUserStatus] = useState('');
  // const [handleSelecionar, setHandleSelecionar] = useState([]);
  // eslint-disable-next-line
  const [isLoading, setIsLoading] = useState(false);
  const [socket, setSocket] = useState(io());
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [roomId, setRoomId] = useState(null);
  // eslint-disable-next-line
  const [atendimentoIniciado, setAtendimentoIniciado] = useState(false);

  const [pon, setPon] = useState('');
  const [numeroTerminal, setNumeroTerminal] = useState('');
  const [tipoServico, setTipoServico] = useState('');
  const [regional, setRegional] = useState('');
  const [contrato, setContrato] = useState('');
  const [nomeCliente, setNomeCliente] = useState('');
  const [endereco, setEndereco] = useState('');
  const [tipo, setTipo] = useState('');
  const [tecnologia, setTecnologia] = useState('');
  const [rede, setRede] = useState('');
  const [produto, setProduto] = useState('');
  const [nomeTecnico, setNomeTecnico] = useState('');
  const [reTecnico, setReTecnico] = useState('');
  const [dtCadastroTecnico, setDtCadastroTecnico] = useState('');
  const [isOrdemCarregada, setIsOrdemCarregada] = useState(false);
  const [isTecnicoCarregado, setIsTecnicoCarregado] = useState(false);
  const [isOperadorOnline, setIsOperadorOnline] = useState(false);
  const [statusFila, setStatusFila] = useState('');
  const [isModalEncerrar, setIsModalEncerrar] = useState(false);

  const [motivosEncerramentos, setMotivosEncerramentos] = useState([]);
  const [motivoEncerramento, setMotivoEncerramento] = useState('');
  const [motivosTransferencias, setMotivosTransferencias] = useState([]);
  const [motivoTransferencia, setMotivoTransferencia] = useState('');
  const [idFilaTrasferencia, setIdFilaTrasferencia] = useState('');
  const [motivoIdMap, setMotivoIdMap] = useState({});

  const [frasesChat, setFrasesChat] = useState([]);
  const [fraseChat, setFraseChat] = useState('');
  // const [idChat, setIdChat] = useState('');
  const [tecnicoSocketId, setTecnicoSocketId] = useState('');
  const [exibirTransferencia, setExibirTransferencia] = useState(false);
  const [atSimultaneo, setAtSimultaneo] = useState('');


  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const userNomeRef = useRef();
  const moment = require('moment');


function abrirNovasGuias(qtd) {
  let guia = parseInt(localStorage.getItem('guia')) || 0;
  let url = new URL(window.location.href);
  
  if(guia < qtd - 1) {
      guia++;
      localStorage.setItem('guia', guia);
      url.searchParams.set('guia', guia);
      window.open(url.toString(), "_blank");
    }
}

window.addEventListener('beforeunload', function() {
    localStorage.removeItem('guia');
});

  async function obterDadosDoOperador(userIdIn) {
    try {
      const response = await fetch(`http://${process.env.REACT_APP_IP_APP}:${process.env.REACT_APP_PORT}/chat/operador?ID_USUARIO=${userIdIn}`);
      const data = await response.json();

      console.log('Dados do operador:', data);

      // Extrair o valor do MOTIVO_PARADA
      const atSimultaneo = data.operadoresDisponiveis[0].AT_SIMULTANEO;
      console.log('CONSOLE ATENDIMENTO SIMUNTANEO: ',atSimultaneo);
      setAtSimultaneo(atSimultaneo);
      const motivoParada = data.operadoresDisponiveis[0].MOTIVO_PARADA;
      if (motivoParada === 'DISPONIVEL') {
        setIsOperadorOnline(true);
      }
      else {
        setIsOperadorOnline(false);
      };
      // Definir o estado setUserStatus com o valor do MOTIVO_PARADA
      setUserStatus(motivoParada);
      const statusColor = getStatusColor(motivoParada);
      document.querySelector('.status-ball').style.backgroundColor = statusColor;

      // Aqui você pode fazer qualquer outra coisa que precisa com os dados

    } catch (error) {
      console.error('Erro ao obter os dados do operador:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'DISPONIVEL':
        return '#2E8B57';
      case 'EM ATENDIMENTO':
        return '#FF0000';
      case '1º PAUSA DESCANSO':
        return '#DAA520';
      case '2º PAUSA DESCANSO':
        return '#DAA520';
      case 'PAUSA ALMOÇO':
        return '#1E90FF';
      case 'PAUSA FEEDBACK':
        return '#B0C4DE';
      case 'PAUSA BANHEIRO':
        return '#D2691E';
      case 'TRATANDO':
        return '#f4b619';
      default:
        return 'gray'; // Cor padrão para outros status
    }
  };

  const statusCompleto = userStatus;
  const statusFormatado = statusCompleto.toLowerCase().split(" ").map((palavra) => palavra.charAt(0).toUpperCase() + palavra.slice(1)).join(" ");

  const handleSendMessage = (messageText) => {
    if (messageText.trim() !== '') {
      const message = { text: messageText, userId: 1, roomId }; // Incluir o ID da sala na mensagem
      socket.emit('message', message);
      socket.emit('mensagemEnviadaOperador', message);
      setMessages([...messages, { text: messageText, userId: 1 }]);
      setNewMessage('');
      setFraseChat('');
    }
  };

  

  const processHTMLTags = (text) => {
    return { __html: text };
  };

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        // Faz uma requisição ao servidor para verificar a autenticação
        const response = await axios.get(`http://${process.env.REACT_APP_IP_APP}:${process.env.REACT_APP_PORT}/check-session`, {
          withCredentials: true,
        });

        // Se o servidor retornar um código de status diferente de 200, redirecione para a tela de login
        if (response.status !== 200) {
          navigate('/');
        } else {
          // Se o usuário estiver autenticado, define o ID do usuário

          // Emite o ID do usuário para o servidor via socket.io
          setUserId(response.data.userId);
          setUserNome(response.data.userNome);
          await obterDadosDoOperador(response.data.userId);

          socket.emit('sessionUserIn', response.data.userId);
          console.log('ID do usuário enviado:', response.data.userId);
          userNomeRef.current = response.data.userNome;
          console.log('ID do usuário enviado:', response.data.userNome);

        }
      } catch (error) {
        console.error("Erro ao verificar a autenticação:", error);
        // Em caso de erro, também redirecione para a tela de login
        navigate('/');
      }
    };

    // Chama a função de verificação de autenticação
    checkAuthentication();
    // eslint-disable-next-line
  }, [navigate, socket]);

  


  useEffect(() => {
    const newSocket = io(`http://${process.env.REACT_APP_ROUTER_SOCKET}/ffi`, {
      transports: ['websocket'],
      reconnection: true,
    });

    // Emitir o evento 'systemConnect' ao conectar
    newSocket.on('connect', () => {
      console.log('Conectado ao Servidor');
      

    });

    newSocket.on('sessionUserIn', (sessionId) => {
      console.log(`ID do cliente: ${sessionId}`);
    });

    newSocket.on('statusOperador', (status) => {
      console.log(`texto do Socket: ${status}`);
      setUserStatus(status)
      const statusColor = getStatusColor(status);
      document.querySelector('.status-ball').style.backgroundColor = statusColor
    });

    newSocket.on('statusOrdem', (data) => {
      const tecnicoSocketId = data.tecnicoSocketId;
      const userIdTecnico = data.userIdTecnico;
      const terminal = data.terminal;
      const idChat = data.idChat;

      obterDadosDoTecnico(userIdTecnico);
      obterDadosDaOrdem(terminal);
      obterMotivoEncerramento(idChat);
      obterFilaTranferencia();
      obterFrasesChat(idChat);
      setTecnicoSocketId(tecnicoSocketId);
      setUserIdTecnico(data.userIdTecnico);

      if (idChat === 'B2B') {
        setExibirTransferencia(true);
      }
      else {
        setExibirTransferencia(false);
      }
    });

    newSocket.on('transferenciaChat', (data) => {

    });

    newSocket.on('encerramentoChat', (data) => {

    });

    if (!newSocket._events || !newSocket._events.salaPrivadaCriada) {

      newSocket.on('salaPrivadaCriada', (roomId) => {
        console.log('Sala privada criada:', roomId);
        setRoomId(roomId);

        const newMessage = `Iniciando atendimento na sala privada: ${roomId} Aguarde...`;
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: newMessage, userId: 4, roomId },
        ]);

        // Emitir o evento 'salaPrivadaCriada' imediatamente
        newSocket.emit('salaPrivadaCriada', newMessage);
        setAtendimentoIniciado(true);

        // Adiciona um atraso de 15 segundos antes de enviar a mensagem inicial

        setTimeout(() => {
          const messageInicial = { text: `Olá, eu sou ${userNomeRef.current} , irei auxiliar você com a solicitação!`, userId: 1, roomId };
          const messageAjuda = { text: `Como posso ajudar ?`, userId: 1, roomId };
          setMessages((prevMessages) => [
            ...prevMessages,
            messageInicial
          ]);

          setMessages((prevMessages) => [
            ...prevMessages,
            messageAjuda
          ]);
          newSocket.emit('mensagemEnviadaOperador', messageInicial);
          setTimeout(() => {
            newSocket.emit('mensagemEnviadaOperador', messageAjuda);
          }, 500);

          setAtendimentoIniciado(false);
        }, 1000); // 15000 milissegundos equivalem a 15 segundos

        // Evento para receber uma mensagem do técnico
        if (!newSocket._events || !newSocket._events.mensagemRecebida) {

          newSocket.on('mensagemRecebida', function (message) {
            if (message) {
              const messageObject = JSON.parse(message);
              console.log('Mensagem recebida do tecnico:', messageObject);
              // Verifica se a mensagem recebida pertence à mesma sala
              if (messageObject.roomId === roomId) {
                // Adicione a mensagem recebida ao estado de mensagens
                setMessages((prevMessages) => [
                  ...prevMessages,
                  { text: messageObject.text, userId: 2 }, // userId 2 para indicar mensagem do operador
                ]);

              } else {
                console.error('Mensagem recebida de uma sala diferente:', messageObject.roomId);
              }
            }
          });
        }
      });
    }

    setSocket(newSocket);

    return () => newSocket.disconnect();
    // eslint-disable-next-line
  }, []);

  const handleSelectChange = (event) => {
    setSelecionar(event.target.value);
  };
  const handleButtonClick = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.put(`http://${process.env.REACT_APP_IP_APP}:${process.env.REACT_APP_PORT}/chat/operador?ID_USUARIO=${userId}&MOTIVO_PARADA=${selecionar}`, {
      }, {
        withCredentials: true,
      });
      console.log(selecionar)
      console.log("Resposta do servidor:", response);
      await obterDadosDoOperador(userId);
      setIsLoading(false);
      setSelecionar('')
      if(selecionar === 'DISPONIVEL'){
        abrirNovasGuias(atSimultaneo);
      };

    } catch (error) {
      console.error("Erro ao enviar os dados:", error);
    }
  }

  const nomeCompleto = userNome;
  const nomeFormatado = nomeCompleto
    .toLowerCase() // Converte todas as letras para minúsculas
    .split(" ") // Divide o nome em palavras
    .map((palavra) => palavra.charAt(0).toUpperCase() + palavra.slice(1)) // Capitaliza a primeira letra de cada palavra
    .join(" "); // Junta as palavras novamente



  const obterDadosDaOrdem = async (terminal) => {
    try {
      const response = await axios.get(`http://${process.env.REACT_APP_IP_APP}:${process.env.REACT_APP_PORT}/chat/operador?PON=${terminal}`, {
        withCredentials: true,
      });

      const pon = response.data.consultaOrdem[0].PON;
      const nTerminal = response.data.consultaOrdem[0].TERMINAL;
      const tipoServico = response.data.consultaOrdem[0].TIPO_ORDEM;
      const regional = response.data.consultaOrdem[0].REGIONAL;
      const contrato = response.data.consultaOrdem[0].CONTRATO;
      const nomeCliente = response.data.consultaOrdem[0].NOME_CLIENTE;
      const endereco = response.data.consultaOrdem[0].ENDERECO;
      const tipo = response.data.consultaOrdem[0].TIPO;
      const tecnologia = response.data.consultaOrdem[0].TECNOLOGIA;
      const rede = response.data.consultaOrdem[0].REDE;
      const produto = response.data.consultaOrdem[0].PRODUTO;
      const statusFila = response.data.consultaOrdem[0].STATUS_FILA;

      setPon(pon);
      setNumeroTerminal(nTerminal);
      setTipoServico(tipoServico);
      setRegional(regional);
      setContrato(contrato);
      setNomeCliente(nomeCliente);
      setEndereco(endereco);
      setTipo(tipo);
      setTecnologia(tecnologia);
      setRede(rede);
      setProduto(produto);
      setIsOrdemCarregada(true);
      setStatusFila(statusFila);

      console.log(statusFila);

    } catch (error) {
      console.error("Erro ao obter os dados:", error);
    }
  };

  const obterDadosDoTecnico = async (userIdTecnico) => {
    try {
      const response = await axios.get(`http://${process.env.REACT_APP_IP_APP}:${process.env.REACT_APP_PORT}/chat/operador?ID=${userIdTecnico}`, {
        withCredentials: true,
      });

      const nomeTecnico = response.data.consultaTecnico[0].NOME;
      const reTecnico = response.data.consultaTecnico[0].RE;
      let dataCadastro = response.data.consultaTecnico[0].DATA_CRIACAO;

      // Formatar a data
      dataCadastro = moment(dataCadastro).format('DD/MM/YYYY HH:mm');

      setNomeTecnico(nomeTecnico);
      setReTecnico(reTecnico);
      setDtCadastroTecnico(dataCadastro);
      setIsTecnicoCarregado(true);



    } catch (error) {
      console.error("Erro ao obter os dados:", error);
    }
  };


  const obterMotivoEncerramento = async (idChat) => {
    try {
      const response = await axios.get(`http://${process.env.REACT_APP_IP_APP}:${process.env.REACT_APP_PORT}/chat/operador?CHAT=${idChat}`, {
        withCredentials: true,
      });

      setMotivosEncerramentos(response.data.motivoEncerramento.map(item => item.ENCERRAMENTO));

    } catch (error) {
      console.error("Erro ao obter os dados:", error);
    }
  };


  const obterFilaTranferencia = async () => {
    try {
      const response = await axios.get(`http://${process.env.REACT_APP_IP_APP}:${process.env.REACT_APP_PORT}/chat/operador?`, {
        withCredentials: true,
      });

      const motivosTransferencias = response.data.transferenciaChat.map(item => item.TIPO_SERVICO);

      // Cria um objeto que mapeia motivos de transferência para IDs
      const novoMotivoIdMap = {};
      for (let i = 0; i < response.data.transferenciaChat.length; i++) {
        novoMotivoIdMap[response.data.transferenciaChat[i].TIPO_SERVICO] = response.data.transferenciaChat[i].ID;
      }

      setMotivosTransferencias(motivosTransferencias);
      setMotivoIdMap(novoMotivoIdMap);

    } catch (error) {
      console.error("Erro ao obter os dados:", error);
    }
  };


  const obterFrasesChat = async (idChat) => {
    try {
      const response = await axios.get(`http://${process.env.REACT_APP_IP_APP}:${process.env.REACT_APP_PORT}/chat/operador?CHAT=${idChat}`, {
        withCredentials: true,
      });

      setFrasesChat(response.data.chatFrases.map(item => item.FRASE));
      console.log(response.data.chatFrases.map(item => item.FRASE));

    } catch (error) {
      console.error("Erro ao obter os dados:", error);
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      // eslint-disable-next-line
      const currentScrollTop = messagesEndRef.current.scrollTop;
      const newScrollTop = messagesEndRef.current.scrollHeight;

      messagesEndRef.current.style.transition = 'scroll-top 0.5s ease-in-out';
      messagesEndRef.current.scrollTop = newScrollTop;

      const transitionEndHandler = () => {
        messagesEndRef.current.style.transition = '';
        messagesEndRef.current.removeEventListener('transitionend', transitionEndHandler);
      };

      messagesEndRef.current.addEventListener('transitionend', transitionEndHandler);

      setTimeout(() => {
        messagesEndRef.current.style.transition = '';
      }, 500);
    }
  }, [messages]);

  const handleModalOpen = () => {
    setIsModalEncerrar(true);
  };

  const handleModalClose = () => {
    setIsModalEncerrar(false);
    setMotivoEncerramento('');
  };


  const emitirEventoTransferencia = async () => {
    const message = {
      text: 'O chat atual foi encerrado. Você sera tranferido para outra fila de atendimento!',
      userId: 1,
      roomId
    };

    const data = {
      idOperador: userId,
      tecnicoSocketId: tecnicoSocketId,
      motivoTransferencia: motivoTransferencia,
      idFilaTrasferencia: idFilaTrasferencia,
      terminal: pon,
      userIdTecnico: userIdTecnico,
    };
    setMessages((prevMessages) => [
      ...prevMessages,
      message
    ]);
    socket.emit('mensagemEnviadaOperador', message);
    socket.emit('transferenciaChat', data);


    // Armazena a informação no sessionStorage antes de recarregar a página
    sessionStorage.setItem('reload', 'true');
    window.location.reload();
  };

  // Verifica a informação no sessionStorage quando a página é carregada
  window.onload = function () {
    const reload = sessionStorage.getItem('reload');
    if (reload) {
      sessionStorage.removeItem('reload');  // remove a informação do sessionStorage

      // Aguarda 1 segundo antes de executar a chamada
      setTimeout(async function () {
        try {

          // eslint-disable-next-line
          const statusOperador = 'DISPONIVEL';

          // eslint-disable-next-line
          const response = await axios.put(`http://${process.env.REACT_APP_IP_APP}:${process.env.REACT_APP_PORT}/chat/operador?ID_USUARIO=${userId}&MOTIVO_PARADA=${statusOperador}`, {
          }, {
            withCredentials: true,
          });
          await obterDadosDoOperador(userId);
          setIsOrdemCarregada(false);
          setIsTecnicoCarregado(false);
          setMotivoTransferencia('');
          setMessages([]);

        } catch (error) {
          console.error("Erro ao atualizar o operador:", error);
        }
      }, 2000);  // 1000 milissegundos = 1 segundo
    }
  };

  const emitirEventoEncerramento = async () => {
    const message = {
      text: 'O chat foi encerrado, por favor responda a pesquisa de satisfação!'
      , userId: 1
      , roomId
    };

    const data = {
      idOperador: userId,
      tecnicoSocketId: tecnicoSocketId,
      motivoEncerramento: motivoEncerramento
    };
    setMessages((prevMessages) => [
      ...prevMessages,
      message
    ]);
    socket.emit('mensagemEnviadaOperador', message);
    socket.emit('encerramentoChat', data);
    const statusOperador = 'DISPONIVEL';
    try {
      // eslint-disable-next-line
      const response = await axios.put(`http://${process.env.REACT_APP_IP_APP}:${process.env.REACT_APP_PORT}/chat/operador?ID_USUARIO=${userId}&MOTIVO_PARADA=${statusOperador}`, {
      }, {
        withCredentials: true,
      });
      await obterDadosDoOperador(userId);
      setIsModalEncerrar(false);
      setMotivoEncerramento('');
      setIsOrdemCarregada(false);
      setIsTecnicoCarregado(false);
      setMessages([]);

    } catch (error) {
      console.error("Erro ao atualizar o operador:", error);
    }
  };


  return (
    <div>
      <div className="chat-control-operador">
        <div className="custom-select-section">
          <label className="custom-select-label" for="pausa">Selecionar pausas e ficar disponivel:</label>
          <div>
            <select
              id="pausa"
              value={selecionar}
              onChange={handleSelectChange}
              className={`custom-select-chat ${isOrdemCarregada || isTecnicoCarregado ? 'disabled' : ''}`}
              disabled={isOrdemCarregada || isTecnicoCarregado}
              required
            >
              <option value="">Selecione um Status:</option>
              <option value="DISPONIVEL">DISPONIVEL</option>
              <option value="1º PAUSA DESCANSO">1º PAUSA DESCANSO</option>
              <option value="PAUSA ALMOÇO">PAUSA ALMOÇO</option>
              <option value="2º PAUSA DESCANSO">2º PAUSA DESCANSO</option>
              <option value="PAUSA FEEDBACK">PAUSA FEEDBACK</option>
              <option value="PAUSA BANHEIRO">PAUSA BANHEIRO</option>
              <option value="OFFLINE">OFFLINE</option>
            </select>
            <button
              className={`login-button-chat ${isOrdemCarregada || isTecnicoCarregado ? "disabled" : ""}`}
              type="submit"
              disabled={isOrdemCarregada || isTecnicoCarregado}

              onClick={handleButtonClick}
            >
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </div>
        </div>

        {exibirTransferencia && (
          <div className="custom-select-section">
            <label className="custom-select-label" for="pausa">Selecionar uma fila para transferir:</label>
            <div>
              <select
                id="pausa"
                value={motivoTransferencia}
                onChange={(event) => {
                  setMotivoTransferencia(event.target.value);
                  setIdFilaTrasferencia(motivoIdMap[event.target.value]);
                }}
                className={`custom-select-chat ${isOrdemCarregada || isTecnicoCarregado ? 'disabled' : ''}`}
                disabled={!isOrdemCarregada || !isTecnicoCarregado}
                required
              >
                <option value="">Selecione uma fila:</option>
                {motivosTransferencias.map((motivo, index) => (
                  <option key={index} value={motivo}>
                    {motivo}
                  </option>
                ))}
              </select>
              <button
                className={`login-button-chat ${!isOrdemCarregada || !isTecnicoCarregado ? "disabled" : ""}`}
                type="submit"
                disabled={!isOrdemCarregada || !isTecnicoCarregado}
                onClick={emitirEventoTransferencia}
              >
                <FontAwesomeIcon icon={faArrowRight} />
              </button>
            </div>
          </div>
        )}
        <div className="custom-encerrar-section">

          <div>
            <button
              className={`encerrar-button-chat ${!isOrdemCarregada || !isTecnicoCarregado ? "disabled" : ""}`}
              type="submit"
              onClick={handleModalOpen}
              disabled={!isOrdemCarregada || !isTecnicoCarregado}
            >
              Encerrar Chat
            </button>

            <div className={`modal ${isModalEncerrar ? 'show' : ''}`} onClick={handleModalClose}>
              <div className="modal-encerrar-content" onClick={e => e.stopPropagation()}>
                <span className="modal-encerrar-close" onClick={handleModalClose}>&times;</span>
                <div className="modal-encerrar-title">Encerrar chat</div>
                <div className="modal-encerrar-text">Escolha o tipo de encerramento do chat.</div>
                <select
                  id="pausa"
                  value={motivoEncerramento}
                  onChange={(event) => setMotivoEncerramento(event.target.value)}
                  className="custom-select-chat-encerrar"
                  required
                >
                  <option value="">Selecione um motivo de encerramento:</option>
                  {motivosEncerramentos.map((motivo, index) => (
                    <option key={index} value={motivo}>
                      {motivo}
                    </option>
                  ))}
                </select>
                <div className="modal-encerrar-button-section">
                  <button
                    className="modal-encerrar-button-cancelar"
                    type="submit"
                    onClick={handleModalClose}
                  >
                    Cancelar
                  </button>
                  <button
                    className="modal-encerrar-button-encerrar"
                    type="submit"
                    onClick={emitirEventoEncerramento}
                  >
                    Encerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="chat-section">
        <div className="chat-message-section">
          <div className="dani-container">
            <div className="dani-container-operador">
              <div className="dani-logo">
                <img src={dani} alt="" className="dani" />
              </div>
              <div className="dani-title">{nomeFormatado}</div>
            </div>
            <div className="status-section">
              <div className="status-ball"></div>
              <div className="status-title">{statusFormatado}</div>
            </div>
          </div>
          <div className="chat-container">
            <div className="chat-messages" ref={messagesEndRef}>
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`chat-message ${message.userId === 1
                    ? 'current-user'
                    : message.userId === 2
                      ? 'other-user'
                      : message.userId === 3
                        ? 'button-option'
                        : message.userId === 4
                          ? 'fila-chat'
                          : ''
                    }`}
                  onClick={() => message.userId === 3 && handleSendMessage(message.text)}
                >
                  {message.userId !== 3 ? (
                    message.userId !== 4 ? (
                      <div dangerouslySetInnerHTML={processHTMLTags(message.text)} />
                    ) : (
                      <div>{message.text}</div>
                    )
                  ) : (
                    <div>
                      <FontAwesomeIcon
                        icon={faPenToSquare}
                        style={{
                          marginRight: '10px',
                        }}
                      />
                      <span>{message.text}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className={`chat-session2 ${!isOrdemCarregada || !isTecnicoCarregado ? 'disabled' : ''}`}>
              <input
                className="inputChat-message"
                type="text"
                placeholder="Digite sua mensagem..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                disabled={!isOrdemCarregada || !isTecnicoCarregado}
              />
              <button
                className={`sendChat-button ${!isOrdemCarregada || !isTecnicoCarregado ? 'disabled' : ''}`}
                onClick={() => handleSendMessage(newMessage)}
              >
                Enviar
              </button>
            </div>
            <div className={`chat-session ${!isOrdemCarregada || !isTecnicoCarregado ? 'disabled' : ''}`}>
              <select
                id="pausa"
                value={fraseChat}
                onChange={(event) => setFraseChat(event.target.value)}
                className="custom-select-chat-frases"
                disabled={!isOrdemCarregada || !isTecnicoCarregado}
              >
                <option value="">Selecione uma frase:</option>
                {frasesChat.map((frase, index) => (
                  <option key={index} value={frase}>
                    {frase}
                  </option>
                ))}
              </select>
              <button
                className={`sendChat-button ${!isOrdemCarregada || !isTecnicoCarregado ? 'disabled' : ''}`}
                onClick={() => handleSendMessage(fraseChat)}
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
        <div className="chat-data-order">
          {isOrdemCarregada && isTecnicoCarregado ? (
            <div className="chat-card-order">
              <div className="chat-card-data-pon" style={{ backgroundColor: getStatusColor(statusFila) }}>
                <span>PON: {pon}</span>
              </div>
              <div className="chat-card-data-dados">
                Técnico (RE):
                <span>{nomeTecnico} ( {reTecnico} )</span>
              </div>
              <div className="chat-card-data-dados">
                Terminal:
                <span>{numeroTerminal}</span>
              </div>
              <div className="chat-card-data-dados">
                Tipo Serviço:
                <span>{tipoServico}</span>
              </div>
              <div className="chat-card-data-dados">
                Data Cadastro Técnico:
                <span>{dtCadastroTecnico}</span>
              </div>
              <div className="chat-card-data-dados">
                Regional:
                <span>{regional}</span>
              </div>
              <div className="chat-card-data-dados">
                Contrato:
                <span>{contrato}</span>
              </div>
              <div className="chat-card-data-dados">
                CNL/AT/Armário:
                {/* <span>//</span> */}
              </div>
              <div className="chat-card-data-dados">
                Árvore Produto:
                <span></span>
              </div>
              <div className="chat-card-data-dados">
                Nome Cliente:
                <span>{nomeCliente}</span>
              </div>
              <div className="chat-card-data-dados">
                Endereço:
                <span>{endereco}</span>
              </div>
              <div className="chat-card-data-dados">
                Tipo/Tecnologia/Rede:
                <span>{tipo} / {tecnologia} / {rede}</span>
              </div>
              <div className="chat-card-data-dados">
                Produto:
                <span>{produto}</span>
              </div>
            </div>)
            :
            (isOperadorOnline ? (
              <div className="chat-carregando-on-operador-at">
                <video key={daniGifOperadorOn} autoPlay loop muted style={{ width: '200px', height: '200px' }}>
                  <source className="video-operador" src={daniGifOperadorOn} type="video/mp4" />
                </video>
                <div className="chat-carregando-on-text-operador-at">Buscando Atendimento ...</div>
              </div>
            ) : (
              <div className="chat-carregando-off-at">
                <video key={daniGifOperadorOff} autoPlay loop muted style={{ width: '200px', height: '200px' }}>
                  <source className="video-operador" src={daniGifOperadorOff} type="video/mp4" />
                </video>
                <div className="chat-carregando-off-text-at">Fique Disponivel !!!</div>
              </div>
            )
            )}
        </div>
      </div>
    </div>
  );
};