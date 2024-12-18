import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import { Header } from '../../components/Header/Header';
import { Sidebar } from '../../components/Sidebar/Sidebar';
import { toggleSidebar } from '../../helpers/toggleSidebar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronRight,faInfoCircle,faCircleNodes, faTowerCell,faDatabase,faSignal,faStopwatch,faExclamationTriangle,faBolt,faBug ,faBullhorn} from '@fortawesome/free-solid-svg-icons';
import CustomGaugeChart from '../../components/CustomGaugeChart/CustomGaugeChart';
import Thermometer from '../../components/Thermometer/Thermometer';
import SimpleLineChart from '../../components/SimpleLineChart/SimpleLineChart';


export const Dashboard = () => {
    const [isClosed, setClosed] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [campinasData, setCampinasData] = useState(null);
    const [osascoData, setOsascoData] = useState(null);
    const [saoJoseDosCamposData, setSaoJoseDosCamposData] = useState(null);
    const [interiorData, setInteriorData] = useState(null);
    const [PCSCData, setPCSCData] = useState(null);
    const [jundiaiData, setJundiaiData] = useState(null);
    const [entranteHxHData, setEntranteHxHData] = useState([]);
    const [desvioHxHData, setDesvioHxHData] = useState([]);
    const [isExpandedBackbone, setIsExpandedBackbone] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const KPI = 10.00
    useEffect(() => {
        const checkAuthentication = async () => {
            try {
                const response = await axios.get(`/check-session`, { withCredentials: true });
                if (response.status !== 200) {
                    navigate('/');
                }
            } catch (error) {
                console.error("Erro ao verificar a autenticação:", error);
                navigate('/');
            }
        };
        checkAuthentication();
    }, [navigate]);

    useEffect(() => {
        const fetchPainelData = async () => {
            try {
                const response = await axios.get(`/dashboard/painel-entrante`);
                const { gaugeChart,entranteHxH ,desvioHxH} = response.data;

                // Filtra o cluster "Campinas"
                const campinas = gaugeChart.find(item => item.CLUSTER === 'CAMPINAS');
                setCampinasData(campinas);

                const osasco = gaugeChart.find(item => item.CLUSTER === 'OSASCO');
                setOsascoData(osasco);

                const saoJoseDosCampos = gaugeChart.find(item => item.CLUSTER === 'SAO_JOSE_DOS_CAMPOS');
                setSaoJoseDosCamposData(saoJoseDosCampos);

                const interior = gaugeChart.find(item => item.CLUSTER === 'INTERIOR');
                setInteriorData(interior);

                // Buscar dados do cluster PC_SC
                const pcsc = gaugeChart.find(item => item.CLUSTER === 'PC_SC');
                setPCSCData(pcsc);

                const jundiai = gaugeChart.find(item => item.CLUSTER === 'JUNDIAI');
                setJundiaiData(jundiai);

                const sortedEntranteHxH = entranteHxH.sort((a, b) => a.HORA - b.HORA);
                setEntranteHxHData(sortedEntranteHxH);

                // Atualiza o estado com os dados de desvioHxH
                const sortedDesvioHxH = desvioHxH.sort((a, b) => a.HORA - b.HORA);
                setDesvioHxHData(sortedDesvioHxH);

            } catch (error) {
                console.error('Erro ao buscar dados:', error);
            } finally {
                setTimeout(() => {
                    setLoading(false); // Desativa o carregamento após 5 segundos
                }, 3000);
            }
        };

        fetchPainelData();
    }, []);

    const toggleExpandBackbone = () => {
        setIsExpandedBackbone(!isExpandedBackbone);
    };
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
   

    const dataCardFour = [
        { subject: 'Math', A: 120, fullMark: 150 },
        { subject: 'Chinese', A: 98, fullMark: 150 },
        { subject: 'English', A: 86, fullMark: 150 },
        { subject: 'Geography', A: 99, fullMark: 150 },
        { subject: 'Physics', A: 85, fullMark: 150 },
        { subject: 'History', A: 65, fullMark: 150 },
      ];

      const formatHour = (hour) => {
        return hour.toString().padStart(2, '0') + ':00';
    };

    const formattedData = desvioHxHData.map(item => ({
        name: formatHour(item.HORA),
        Desvio: item.DESVIO,
        Alto:KPI,
        Medio:5,
    }));

    const lines = [
        { dataKey: 'Desvio', stroke: '#007bff', strokeWidth: 2 },
        { dataKey: 'Alto', stroke: '#e74a3b', strokeWidth: 2 },
        { dataKey: 'Medio', stroke: '#f4cc43', strokeWidth: 2 },
      ];


    return (
        <>
            <Header toggleSidebar={() => toggleSidebar(isClosed, setClosed)} isClosed={isClosed} />
            <Sidebar isClosed={isClosed} toggleSidebar={() => toggleSidebar(isClosed, setClosed)} />
            <div className={`section-dashboard ${isClosed ? 'closed' : 'open'}`}>
                <div className="dashboard-title">Dashboard</div>
                {/* Exibir spinner durante o carregamento */}
                {loading ? (
                    <div className="spinner">Carregando dados...</div>
                ) : (
                    <>
                {/* BACKBONE*/}
                <div className="dashboard-descricao-section">
                    <div className="dashboard-descricao">Painel de Monitoramento de Entrantes de Reparos
                        <FontAwesomeIcon 
                            icon={faInfoCircle} 
                            className="info-icon" 
                            onClick={openModal} 
                        />
                    </div>
                    <button className="toggle-button" onClick={toggleExpandBackbone}>
                        <FontAwesomeIcon 
                        icon={faChevronRight} 
                        className={`icon-transition ${isExpandedBackbone ? 'icon-hidden' : ''}`} 
                        />
                        <FontAwesomeIcon 
                        icon={faChevronDown} 
                        className={`icon-transition ${!isExpandedBackbone ? 'icon-hidden' : ''}`} 
                        style={{ position: 'absolute' }}
                        />
                    </button>
                </div>
                <div className="painel-section">
                    <div className="card-section">
                        <div className="cardBody-section">
                        {campinasData && (
                            <CustomGaugeChart
                                value={campinasData.ENTRANTE}
                                max={campinasData.MEDIA}
                                valueKPI={campinasData.KPI_DESVIO}
                                maxKPI={KPI}
                                title="Campinas"
                            />
                        )}
                        {osascoData && (
                            <CustomGaugeChart
                                value={osascoData.ENTRANTE}
                                max={osascoData.MEDIA}
                                valueKPI={osascoData.KPI_DESVIO}
                                maxKPI={KPI}
                                title="Osasco"
                            />
                        )}

                        {saoJoseDosCamposData && (
                            <CustomGaugeChart
                                value={saoJoseDosCamposData.ENTRANTE}
                                max={saoJoseDosCamposData.MEDIA}
                                valueKPI={saoJoseDosCamposData.KPI_DESVIO}
                                maxKPI={KPI}
                                title="São Jose dos Campos"
                            />
                        )}
                        
                        </div>
                        <div className="cardBody-section">
                        {interiorData && (
                            <CustomGaugeChart
                                value={interiorData.ENTRANTE}
                                max={interiorData.MEDIA}
                                valueKPI={interiorData.KPI_DESVIO}
                                maxKPI={KPI}
                                title="Interior"
                            />
                        )}
                        {PCSCData && (
                            <CustomGaugeChart
                                value={PCSCData.ENTRANTE}
                                max={PCSCData.MEDIA}
                                valueKPI={PCSCData.KPI_DESVIO}
                                maxKPI={KPI}
                                title="Pc/Sc"
                            />
                        )}

                        {jundiaiData && (
                            <CustomGaugeChart
                                value={jundiaiData.ENTRANTE}
                                max={jundiaiData.MEDIA}
                                valueKPI={jundiaiData.KPI_DESVIO}
                                maxKPI={KPI}
                                title="Jundiai"
                            />
                        )}
                        
                        </div>
                    </div>
                    <div className="thermometer-section">
                        <div className="thermometer-title">Entrante HxH</div>
                        <div className="thermometer-value">
                            {entranteHxHData.map((item, index) => (
                                <Thermometer
                                    key={index}
                                    label={formatHour(item.HORA)}
                                    value={item.ENTRANTE}
                                    max={KPI}
                                    kpi={item.KPI_DESVIO}
                                />
                            ))}
                        </div>
                    </div>
                </div>
                <div className="dashboard-chart-container">
                        <div className="dashboard-chart-descricao">Desvio de entrante HxH</div>
                        <SimpleLineChart data={formattedData} lines={lines} />
                    </div>
                {isModalOpen && (
                    <div className="dashboard-modal">
                        <div className="dashboard-modal-content">
                            <span className="dashboard-close" onClick={closeModal}>&times;</span>
                            <h2 className="dashboard-modal-title">Painel de Monitoramento de Entrantes de Reparos</h2>
                            <div className="dashboard-modal-content-sub">
                                <h3 className="dashboard-modal-subtitle">KPI</h3>
                                <p className="dashboard-modal-paragraph">
                                    <span className="dashboard-definition-label">Definição:</span> Se o valor atual (BDS) for maior que a média (MEDIA_BDS), calcula o KPI.
                                </p>
                                <h3 className="dashboard-modal-subtitle">Entrante</h3>
                                <p className="dashboard-modal-paragraph">
                                    <span className="dashboard-definition-label">Definição:</span> Quantidade de reparos abertos (reclamados) no dia.
                                </p>
                                <h3 className="dashboard-modal-subtitle">Média</h3>
                                <p className="dashboard-modal-paragraph">
                                    <span className="dashboard-definition-label">Definição:</span> Média dos reparos abertos no dia corrente das últimas 4 semanas.
                                </p>
                                <h3 className="dashboard-modal-subtitle">Desvio</h3>
                                <p className="dashboard-modal-paragraph">
                                    <span className="dashboard-definition-label">Definição:</span> Quantidade de reparos abertos acima da média.
                                </p>
                                <h3 className="dashboard-modal-subtitle">Massiva</h3>
                                <p className="dashboard-modal-paragraph">
                                    <span className="dashboard-definition-label">Definição:</span> Quantidade de reparos que estão envolvidos em eventos de rede massiva (afeta mais de um cliente).
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </>)}
            </div>
        </>
    );
};
