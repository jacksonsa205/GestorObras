import React, { useState, useEffect } from "react";
import "./EvolucaoBacklog.css";
import { Header } from '../../../components/Header/Header';
import { Sidebar } from '../../../components/Sidebar/Sidebar';
import { toggleSidebar } from '../../../helpers/toggleSidebar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faChevronDown, 
    faChevronRight,
    faCircleNodes, 
    faTowerCell,
    faExclamationTriangle,
    faHelmetSafety,
    faSitemap,
    faCity,
    faMobile,
    faStopwatch,
    faBuilding,
    faExpand} from '@fortawesome/free-solid-svg-icons';
import CardThree from '../../../components/CardThree/CardThree';
import SimpleLineChart from '../../../components/SimpleLineChart/SimpleLineChart';
import SimplePieChart from '../../../components/SimplePieChart/SimplePieChart';
import SimpleBarChart from '../../../components/SimpleBarChart/SimpleBarChart';
import { FilterDropdown } from '../../../components/FilterDropdown/FilterDropdown';


export const EvolucaoBacklog = () => {
    const [isClosed, setClosed] = useState(false);
    const navigate = useNavigate();
    const [TAs, setTAs] = useState([]);
    const [prioridade2, setPrioridade2] = useState([]);
    const [prioridade1, setPrioridade1] = useState([]);
    const [isExpandedMovel, setIsExpandedMovel] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [dataLine, setDataLine] = useState([]);
    const [dataBar, setDataBar] = useState([]);
    const [dataPie, setDataPie] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuthentication = async () => {
            try {
                const response = await axios.get(`http://${process.env.REACT_APP_IP_APP}:${process.env.REACT_APP_PORT}/check-session`, { withCredentials: true });
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
        const fetchMapaData = async () => {
            try {
                const response = await axios.get(`/movel/evolucao-backlog`);
                const { dadosMovel, tasPrioridadeMovel, dadosMovelTabela } = response.data;
    
                const filteredTAsTotal = [];
                const filteredPrioridade1 = [];
                const filteredPrioridade2 = [];
    
                // Filtra os dados de acordo com a prioridade do TQA
                dadosMovel.forEach((dado) => {
                    if (dado.TQA_PRIORIDADE > 0) {
                        filteredTAsTotal.push(dado);
                    }
                    
                    if (dado.TQA_PRIORIDADE === 1) {
                        filteredPrioridade1.push(dado);
                    }
                    if (dado.TQA_PRIORIDADE === 2) {
                        filteredPrioridade2.push(dado);
                    }
                });
    
                setPrioridade1(filteredPrioridade1);
                setPrioridade2(filteredPrioridade2);
                setTAs(filteredTAsTotal);
                
                // Verifique se tasPrioridadeMovel é um array
                if (!Array.isArray(tasPrioridadeMovel)) {
                    console.error('tasPrioridadeMovel não é um array:', tasPrioridadeMovel);
                    return;
                }
    
                // Transformar os dados para o gráfico de tasPrioridadeMovel
                const groupedTasData = {};
    
                tasPrioridadeMovel.forEach(item => {
                    if (!groupedTasData[item.DT_REF]) {
                        groupedTasData[item.DT_REF] = {
                            name: item.DT_REF,
                            TA: 0,
                            P1: 0,
                            P2: 0,
                            amt: 2400
                        };
                    }
    
                    groupedTasData[item.DT_REF].TA += item.TAS;
                    if (item.FLAG_PRIORIDADE === 'P1') {
                        groupedTasData[item.DT_REF].P1 += item.TAS;
                    } else if (item.FLAG_PRIORIDADE === 'P2') {
                        groupedTasData[item.DT_REF].P2 += item.TAS;
                    }
                });
    
                const transformedTasData = Object.values(groupedTasData);
                setDataLine(transformedTasData);
    
                // Transformar os dados para o gráfico de barras a partir de dadosMovelTabela
                const groupedBarData = {};
    
                dadosMovelTabela.forEach(item => {
                    if (!groupedBarData[item.DDD]) {
                        groupedBarData[item.DDD] = {
                            name: item.DDD,
                            value: 0
                        };
                    }
    
                    groupedBarData[item.DDD].value += 1; // Incrementa a contagem de TA
                });
    
                const transformedBarData = Object.values(groupedBarData);
                setDataBar(transformedBarData);
    
                // Transformar os dados para o gráfico de pizza a partir de dadosMovelTabela
                const groupedPieData = {};
    
                dadosMovelTabela.forEach(item => {
                    if (!groupedPieData[item.TECNOLOGIA]) {
                        groupedPieData[item.TECNOLOGIA] = {
                            name: item.TECNOLOGIA,
                            value: 0
                        };
                    }
    
                    groupedPieData[item.TECNOLOGIA].value += 1; // Incrementa a contagem de TA
                });
    
                const transformedPieData = Object.values(groupedPieData);
                setDataPie(transformedPieData);
            } catch (error) {
                console.error('Erro ao buscar dados:', error);
            } finally {
                setTimeout(() => {
                    setLoading(false); // Desativa o carregamento após 5 segundos
                }, 3000);
            }
        };
    
        fetchMapaData();
    }, []);
  
    const toggleExpandMovel = () => {
        setIsExpandedMovel(!isExpandedMovel);
    };

    const handleSearch = () => {
        setIsLoading(true);
        // Simulação de busca
        setTimeout(() => setIsLoading(false), 2000);
    };

    const dataCardFour = [
        { subject: 'Math', A: 120, fullMark: 150 },
        { subject: 'Chinese', A: 98, fullMark: 150 },
        { subject: 'English', A: 86, fullMark: 150 },
        { subject: 'Geography', A: 99, fullMark: 150 },
        { subject: 'Physics', A: 85, fullMark: 150 },
        { subject: 'History', A: 65, fullMark: 150 },
      ];


      const lines = [
        // { dataKey: 'TA', stroke: '#5a5278', strokeWidth: 2 },
        { dataKey: 'P1', stroke: '#e74a3b', strokeWidth: 2 },
        { dataKey: 'P2', stroke: '#f4cc43', strokeWidth: 2 },
      ];

    // Dados do grafico de Rosca Ast/Gpon

      const colorPie = ['#007bff', '#1cc88a', '#f4cc43', '#e74a3b', '#5a5278','#e8768f'];
    
    // Dados do grafico de Rosca Ast/Gpon

      const colorBar = [ '#5a5278'];

    const handleFullscreen = () => {
    const elem = document.getElementById("chart-container");
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) { // Firefox
        elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) { // Chrome, Safari and Opera
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { // IE/Edge
        elem.msRequestFullscreen();
    }
};

    return (
        <>
            <Header toggleSidebar={() => toggleSidebar(isClosed, setClosed)} isClosed={isClosed} />
            <Sidebar isClosed={isClosed} toggleSidebar={() => toggleSidebar(isClosed, setClosed)} />
            <div className={`section-dashboard ${isClosed ? 'closed' : 'open'}`}>
                <div className="dashboard-title">Evolução Backlog Móvel</div>
                {loading ? (
                    <div className="spinner">Carregando dados...</div>
                ) : (
                    <>
                {/* MOVEL */}
                <div className="dashboard-descricao-section">
                    <div className="dashboard-descricao">Visão Geral Móvel</div>
                    <button className="toggle-button" onClick={toggleExpandMovel}>
                        <FontAwesomeIcon 
                        icon={faChevronRight} 
                        className={`icon-transition ${isExpandedMovel ? 'icon-hidden' : ''}`} 
                        />
                        <FontAwesomeIcon 
                        icon={faChevronDown} 
                        className={`icon-transition ${!isExpandedMovel ? 'icon-hidden' : ''}`} 
                        style={{ position: 'absolute' }}
                        />
                    </button>
                </div>
                <div className="cardBody-section">
                <CardThree 
                        tagValue={TAs.length}
                        icon={faCircleNodes}
                        title="TAs" 
                        tagColor="#5a5278" 
                        progressValue={1} 
                />
                <CardThree 
                    tagValue={prioridade1.length}
                    icon={faTowerCell}
                    title="TAs Prioridade 1" 
                    tagColor="#e74a3b" 
                    progressValue = {prioridade1?.length / TAs?.length || 0}
                />
                <CardThree 
                    tagValue={prioridade2.length}
                    icon={faTowerCell}
                    title="TAs Prioridade 2" 
                    tagColor="#f4cc43" 
                    progressValue = {prioridade2?.length / TAs?.length || 0}
                />
                <CardThree 
                    tagValue="2" 
                    icon={faExclamationTriangle}
                    title="Municipios Isolados" 
                    tagColor="#007bff" 
                    progressValue={0.7} 
                />
                </div>
                <div className="ocorrencias-mapa-movel-descricao">Filtros</div>
                <div className="ocorrencias-mapa-movel-filtro-section">
                    <div className="ocorrencias-mapa-movel-filters-container">
                        <div className="ocorrencias-mapa-movel-filter-row">
                            <div className="ocorrencias-mapa-movel-filter-column">
                                <label htmlFor="statusNt-filter" className="ocorrencias-mapa-movel-filter-label">
                                    <FontAwesomeIcon icon={faHelmetSafety} className="ocorrencias-mapa-movel-filter-icon" />
                                    {' '}   Impacto
                                </label>
                                <FilterDropdown
                                label="Selecione uma opção"
                                options={[
                                    { label: 'Parcial', value: 'parcial' },
                                    { label: 'Total', value: 'total' }
                                ]}
                                value={[]}
                                onChange={(selectedOptions) => console.log(selectedOptions)}
                                isMulti={true}
                                includeSelectAll={true}
                            />
                            </div>
                            <div className="ocorrencias-mapa-movel-filter-column">
                                <label htmlFor="segmento-filter" className="ocorrencias-mapa-movel-filter-label">
                                    <FontAwesomeIcon icon={faSitemap} className="ocorrencias-mapa-movel-filter-icon" />
                                    {' '}   ERB
                                </label>
                                <FilterDropdown
                                    label=""
                                    options={[
                                        { label: 'Parcial', value: 'parcial' },
                                        { label: 'Total', value: 'total' }
                                    ]}
                                    value={[]}
                                    onChange={(selectedOptions) => console.log(selectedOptions)}
                                    isMulti={true}
                                    includeSelectAll={true}
                                />
                            </div>
                            <div className="ocorrencias-mapa-movel-filter-column">
                                <label htmlFor="status-massiva-filter" className="ocorrencias-mapa-movel-filter-label">
                                    <FontAwesomeIcon icon={faTowerCell} className="ocorrencias-mapa-movel-filter-icon" />
                                    {' '}   Tecnologia
                                </label>
                                <FilterDropdown
                                    label=""
                                    options={[
                                        { label: 'Parcial', value: 'parcial' },
                                        { label: 'Total', value: 'total' }
                                    ]}
                                    value={[]}
                                    onChange={(selectedOptions) => console.log(selectedOptions)}
                                    isMulti={true}
                                    includeSelectAll={true}
                                />
                            </div>
                        </div>
                        <div className="ocorrencias-mapa-movel-filter-row">
                            <div className="ocorrencias-mapa-movel-filter-column">
                                <label htmlFor="municipio-filter" className="ocorrencias-mapa-movel-filter-label">
                                    <FontAwesomeIcon icon={faCity} className="ocorrencias-mapa-movel-filter-icon" />
                                    {' '}   Municipio
                                </label>
                                <FilterDropdown
                                    label=""
                                    id="municipio-filter"
                                    options={[
                                        { label: 'Parcial', value: 'parcial' },
                                        { label: 'Total', value: 'total' }
                                    ]}
                                    value={[]}
                                    onChange={(selectedOptions) => console.log(selectedOptions)}
                                    isMulti={true}
                                    includeSelectAll={true}
                                />
                            </div>
                            <div className="ocorrencias-mapa-movel-filter-column">
                                <label htmlFor="ddd-filter" className="ocorrencias-mapa-movel-filter-label">
                                    <FontAwesomeIcon icon={faMobile} className="ocorrencias-mapa-movel-filter-icon" />
                                    {' '}   DDD
                                </label>
                                <FilterDropdown
                                    label=""
                                    id="ddd-filter"
                                    options={[
                                        { label: 'Parcial', value: 'parcial' },
                                        { label: 'Total', value: 'total' }
                                    ]}
                                    value={[]}
                                    onChange={(selectedOptions) => console.log(selectedOptions)}
                                    isMulti={true}
                                    includeSelectAll={true}
                                />
                            </div>
                            <div className="ocorrencias-mapa-movel-filter-column">
                                <label htmlFor="sla-filter" className="ocorrencias-mapa-movel-filter-label">
                                    <FontAwesomeIcon icon={faStopwatch} className="ocorrencias-mapa-movel-filter-icon" />
                                    {' '}   SLA
                                </label>
                                <FilterDropdown
                                    label=""
                                    id="sla-filter"
                                    options={[
                                        { label: 'Parcial', value: 'parcial' },
                                        { label: 'Total', value: 'total' }
                                    ]}
                                    value={[]}
                                    onChange={(selectedOptions) => console.log(selectedOptions)}
                                    isMulti={true}
                                    includeSelectAll={true}
                                />
                            </div>
                            <div className="ocorrencias-mapa-movel-filter-column">
                                <label htmlFor="contratada-filter" className="ocorrencias-mapa-movel-filter-label">
                                    <FontAwesomeIcon icon={faBuilding} className="ocorrencias-mapa-movel-filter-icon" />
                                    {' '}   Contratada
                                </label>
                                <FilterDropdown
                                    label=""
                                    id="contratada-filter"
                                    options={[
                                        { label: 'Parcial', value: 'parcial' },
                                        { label: 'Total', value: 'total' }
                                    ]}
                                    value={[]}
                                    onChange={(selectedOptions) => console.log(selectedOptions)}
                                    isMulti={true}
                                    includeSelectAll={true}
                                />
                            </div>
                        </div>
                        <div className="ocorrencias-mapa-movel-filter-row">
                            <div className="ocorrencias-mapa-movel-button-container">
                                <button
                                    className={`ocorrencias-mapa-movel-search-button ${isLoading ? 'loading' : ''}`}
                                    onClick={handleSearch}
                                >
                                    {isLoading ? 'Carregando...' : 'Buscar'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                {isExpandedMovel && (
                    <div className="dashboard-chart-container" id="chart-container" style={{ position: 'relative' }}>
                        <div className="dashboard-chart-descricao">Volumetria de TAs por Elemento</div>
                        <SimpleLineChart data={dataLine} lines={lines} />
                        <FontAwesomeIcon 
                            icon={faExpand} 
                            onClick={handleFullscreen} 
                            style={{ position: 'absolute', top: 10, right: 10, cursor: 'pointer' }} 
                        />
                    </div>
                )}

                {isExpandedMovel && (
                    <div className="dashboard-chart-section">
                        <div className="dashboard-chart-container2">
                            <div className="dashboard-chart-descricao">Tipo de Tecnologia</div>
                            <SimplePieChart data={dataPie} colors={colorPie} /> 
                        </div>
                        <div className="dashboard-chart-container2">
                            <div className="dashboard-chart-descricao">Volumetria de TAs por DDD</div>
                            <SimpleBarChart data={dataBar} colors={colorBar} />
                        </div>
                    </div>
                    )}
                </>
                )} 
            </div>
        </>
    );
};
