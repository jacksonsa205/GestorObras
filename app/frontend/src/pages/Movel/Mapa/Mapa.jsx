import React, { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, LayersControl, LayerGroup, Marker, Popup, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../../components/Header/Header';
import { Sidebar } from '../../../components/Sidebar/Sidebar';
import { toggleSidebar } from '../../../helpers/toggleSidebar';
import {CardTwo} from '../../../components/CardTwo/CardTwo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCity,faBuilding,faMobile,faTowerCell,faSitemap, faStopwatch,faHelmetSafety, faToggleOn, faToggleOff } from '@fortawesome/free-solid-svg-icons';
import { FilterDropdown } from '../../../components/FilterDropdown/FilterDropdown';
import { AdvancedTable } from '../../../components/AdvancedTable/AdvancedTable';
import 'react-datepicker/dist/react-datepicker.css';
import './Mapa.css';

export const MapaMovel = () => {
    const [isClosed, setClosed] = useState(false);
    const [proiridade2, setPrioridade2] = useState([]);
    const [proiridade1, setPrioridade1] = useState([]);
    const [infoCardData, setInfoCardData] = useState(null);
    const [selectedLayer, setSelectedLayer] = useState(null);
    const [isShowHideMapa, setIsShowHideMapa] = useState(false);
    const [selectedImpacto, setSelectedImpacto] = useState([]);
    const [optionsImpacto, setOptionsImpacto] = useState([]);
    const [selectedERB, setSelectedERB] = useState([]);
    const [optionsERB, setOptionsERB] = useState([]);
    const [selectedTecnologia, setSelectedTecnologia] = useState([]);
    const [optionsTecnologia, setOptionsTecnologia] = useState([]);
    const [selectedMunicipio, setSelectedMunicipio] = useState([]);
    const [optionsMunicipio, setOptionsMunicipio] = useState([]);
    const [selectedDDD, setSelectedDDD] = useState([]);
    const [optionsDDD, setOptionsDDD] = useState([]);
    const [selectedSLA, setSelectedSLA] = useState([]);
    const [optionsSLA, setOptionsSLA] = useState([]);
    const [selectedContratada, setSelectedContratada] = useState([]);
    const [optionsContratada, setOptionsContratada] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [tabela, setTabela] = useState([]);
    const [totalTAs, setTotalTAs] = useState(0);
    const [totalAbility, setTotalAbility] = useState(0);
    const [totalTel, setTotalTel] = useState(0);
    const [totalTAs2Hrs, setTotalTAs2Hrs] = useState(0);
    const [totalAbility2Hrs, setTotalAbility2Hrs] = useState(0);
    const [totalTel2Hrs, setTotalTel2Hrs] = useState(0);
    const [totalTAs4Hrs, setTotalTAs4Hrs] = useState(0);
    const [totalAbility4Hrs, setTotalAbility4Hrs] = useState(0);
    const [totalTel4Hrs, setTotalTel4Hrs] = useState(0);
    const [totalTAs6Hrs, setTotalTAs6Hrs] = useState(0);
    const [totalAbility6Hrs, setTotalAbility6Hrs] = useState(0);
    const [totalTel6Hrs, setTotalTel6Hrs] = useState(0);
    const [totalTAs24Hrs, setTotalTAs24Hrs] = useState(0);
    const [totalAbility24Hrs, setTotalAbility24Hrs] = useState(0);
    const [totalTel24Hrs, setTotalTel24Hrs] = useState(0);
    const [dadosMovelTabela, setDadosMovelTabela] = useState([]);
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
                const response = await axios.get(`/movel/mapa-movel`, {});
                const { dadosMovel, dadosMovelTabela } = response.data;
                
                setDadosMovelTabela(dadosMovelTabela);

                const filteredPrioridade1 = [];
                const filteredPrioridade2 = [];

                dadosMovel.forEach((dado) => {
                    if (dado.TQA_PRIORIDADE === 1) {
                        filteredPrioridade1.push(dado);
                    } else {
                        filteredPrioridade2.push(dado);
                    }
                });

                setPrioridade1(filteredPrioridade1);
                setPrioridade2(filteredPrioridade2);
                setTabela(dadosMovelTabela);

                // Calcular os valores para o Card TOTAL
                setTotalTAs(dadosMovelTabela.length);
                setTotalAbility(dadosMovelTabela.filter(dado => dado.CONTRATADA === 'ABILITY').length);
                setTotalTel(dadosMovelTabela.filter(dado => dado.CONTRATADA === 'TEL').length);

                // Calcular os valores para o Card Ate 2 horas
                const dados2Hrs = dadosMovelTabela.filter(dado => dado.SLA === '02:00');
                setTotalTAs2Hrs(dados2Hrs.length);
                setTotalAbility2Hrs(dados2Hrs.filter(dado => dado.CONTRATADA === 'ABILITY').length);
                setTotalTel2Hrs(dados2Hrs.filter(dado => dado.CONTRATADA === 'TEL').length);

                // Calcular os valores para o Card Ate 4 horas
                const dados4Hrs = dadosMovelTabela.filter(dado => dado.SLA === '04:00');
                setTotalTAs4Hrs(dados4Hrs.length);
                setTotalAbility4Hrs(dados4Hrs.filter(dado => dado.CONTRATADA === 'ABILITY').length);
                setTotalTel4Hrs(dados4Hrs.filter(dado => dado.CONTRATADA === 'TEL').length);

                // Calcular os valores para o Card Ate 6 horas
                const dados6Hrs = dadosMovelTabela.filter(dado => dado.SLA === '06:00');
                setTotalTAs6Hrs(dados6Hrs.length);
                setTotalAbility6Hrs(dados6Hrs.filter(dado => dado.CONTRATADA === 'ABILITY').length);
                setTotalTel6Hrs(dados6Hrs.filter(dado => dado.CONTRATADA === 'TEL').length);

                // Calcular os valores para o Card Maior que 24 horas
                const dados24Hrs = dadosMovelTabela.filter(dado => dado.SLA === '24:00');
                setTotalTAs24Hrs(dados24Hrs.length);
                setTotalAbility24Hrs(dados24Hrs.filter(dado => dado.CONTRATADA === 'ABILITY').length);
                setTotalTel24Hrs(dados24Hrs.filter(dado => dado.CONTRATADA === 'TEL').length);

                //Opção select Impacto
                const uniqueOptionsImpacto= Array.from(new Set(dadosMovelTabela.map(dado => dado.IMPACTO)))
                .map(impacto => ({
                    value: impacto,
                    label: impacto
                }))
                .sort((a, b) => a.value.localeCompare(b.value));  // Ordenar em ordem alfabética

                setOptionsImpacto(uniqueOptionsImpacto);

                //Opção select ERB
                const uniqueOptionsERB= Array.from(new Set(dadosMovelTabela.map(dado => dado.ERB)))
                .map(erb => ({
                    value: erb,
                    label: erb
                }))
                .sort((a, b) => a.value.localeCompare(b.value));  // Ordenar em ordem alfabética

                setOptionsERB(uniqueOptionsERB);

                //Opção select Tecnologia
                const uniqueOptionsTecnologia= Array.from(new Set(dadosMovelTabela.map(dado => dado.TECNOLOGIA)))
                .map(tecnologia => ({
                    value: tecnologia,
                    label: tecnologia
                }))
                .sort((a, b) => a.value - b.value); // Ordenar do menor para o maior

                setOptionsTecnologia(uniqueOptionsTecnologia);

                //Opção select Municipio
                const uniqueOptionsMunicipio= Array.from(new Set(dadosMovelTabela.map(dado => dado.MUNICIPIO)))
                .map(municipio => ({
                    value: municipio,
                    label: municipio
                }))
                .sort((a, b) => a.value.localeCompare(b.value)); // Ordenar em ordem alfabética

                setOptionsMunicipio(uniqueOptionsMunicipio);

                //Opção select DDD
                const uniqueOptionsDDD = Array.from(new Set(dadosMovelTabela.map(dado => dado.DDD)))
                .map(ddd => ({
                    value: ddd,
                    label: ddd
                }))
                .sort((a, b) => a.value - b.value); // Ordenar do menor para o maior

                setOptionsDDD(uniqueOptionsDDD);

                //Opção select SLA
                const uniqueOptionsSLA = Array.from(new Set(dadosMovelTabela.map(dado => dado.SLA)))
                .map(sla => ({
                    value: sla,
                    label: sla
                }))
                .sort((a, b) => a.value - b.value); // Ordenar do menor para o maior

                setOptionsSLA(uniqueOptionsSLA);

                //Opção select Contratada
                const uniqueOptionsContratada = Array.from(new Set(dadosMovelTabela.map(dado => dado.CONTRATADA)))
                .map(contratada => ({
                    value: contratada,
                    label: contratada
                }))
                .sort((a, b) => a.value - b.value); // Ordenar do menor para o maior

                setOptionsContratada(uniqueOptionsContratada);
            } catch (error) {
                console.error(error);
            } finally {
                setTimeout(() => {
                    setLoading(false); // Desativa o carregamento após 5 segundos
                }, 3000);
            }
        };
        fetchMapaData();
    }, []);

    const Prioridade1 = ({ data }) => {
        const iconePrioridade1 = new L.Icon({
            iconUrl: require('../../../assets/images/mapa/icone_prioridade1.png'),
            iconSize: [30, 30],
            iconAnchor: [5, 5],
        });

        const handleMarkerClick = () => {
            setInfoCardData(data);
        };

        return (
            <Marker
                key={data.id}
                position={[data.lat, data.long]}
                icon={iconePrioridade1}
                eventHandlers={{ click: handleMarkerClick }}
            >
                <Popup>
                    {data.endereco}
                    {infoCardData && (
                        <div>
                            <h2> {infoCardData.ALIADA}</h2>
                            <p>ERB: {infoCardData.ERB}</p>
                            <p>Código TA: {infoCardData.TA}</p>
                            <p>Data de Criação: {infoCardData.TQA_DATA_CRIACAO}</p>
                            <p>Última informação NT: Criar campo banco</p>
                        </div>
                    )}
                </Popup>
            </Marker>
        );
    };

    const Prioridade2 = ({ data }) => {
        const iconePrioridade2 = new L.Icon({
            iconUrl: require('../../../assets/images/mapa/icone_prioridade2.png'),
            iconSize: [30, 30],
            iconAnchor: [5, 5],
        });

        const handleMarkerClick = () => {
            setInfoCardData(data);
        };

        return (
            <Marker
                key={data.id}
                position={[data.lat, data.long]}
                icon={iconePrioridade2}
                eventHandlers={{ click: handleMarkerClick }}
            >
                <Popup>
                    {data.MUNICIPIO}
                    {infoCardData && (
                        <div>
                            <h2> {infoCardData.ALIADA}</h2>
                            <p>ERB: {infoCardData.ERB}</p>
                            <p>Código TA: {infoCardData.TA}</p>
                            <p>Data de Criação: {infoCardData.TQA_DATA_CRIACAO}</p>
                        </div>
                    )}
                </Popup>
            </Marker>
        );
    };

    const toggleShowHideMapa = () => {
        setIsShowHideMapa(prevState => !prevState);
    };

    // Funções de manipulação de mudança
    const handleImpactoChange = (selectedOptions) => setSelectedImpacto(selectedOptions);
    const handleERBChange = (selectedOptions) => setSelectedERB(selectedOptions);
    const handleTecnologiaChange = (selectedOptions) => setSelectedTecnologia(selectedOptions);
    const handleMunicipioChange = (selectedOptions) => setSelectedMunicipio(selectedOptions);
    const handleDDDChange = (selectedOptions) => setSelectedDDD(selectedOptions);
    const handleSLAChange = (selectedOptions) => setSelectedSLA(selectedOptions);
    const handleContratadaChange = (selectedOptions) => setSelectedContratada(selectedOptions);
    const handleSearch = () => {
        setIsLoading(true);
    
        // Filtrando os dados com base nos filtros selecionados
        const filteredData = dadosMovelTabela.filter(dado => {
            const impactoMatch = selectedImpacto.length === 0 || selectedImpacto.some(option => String(option) === String(dado.IMPACTO));
            const erbMatch = selectedERB.length === 0 || selectedERB.some(option => String(option) === String(dado.ERB));
            const tecnologiaMatch = selectedTecnologia.length === 0 || selectedTecnologia.some(option => String(option) === String(dado.TECNOLOGIA));
            const municipioMatch = selectedMunicipio.length === 0 || selectedMunicipio.some(option => String(option) === String(dado.MUNICIPIO));
            const dddMatch = selectedDDD.length === 0 || selectedDDD.some(option => String(option) === String(dado.DDD));
            const slaMatch = selectedSLA.length === 0 || selectedSLA.some(option => String(option) === String(dado.SLA));
            const contratadaMatch = selectedContratada.length === 0 || selectedContratada.some(option => String(option) === String(dado.CONTRATADA));
    
            return impactoMatch && erbMatch && tecnologiaMatch && municipioMatch && dddMatch && slaMatch && contratadaMatch;
        });
    
        console.log('Filtered Data:', filteredData); // Verifique se os dados filtrados estão corretos
    
        // Atualizando os cards e a tabela com os dados filtrados
        setTabela(filteredData);
    
        // Atualizando os valores dos cards com os dados filtrados
        setTotalTAs(filteredData.length);
        setTotalAbility(filteredData.filter(dado => dado.CONTRATADA === 'ABILITY').length);
        setTotalTel(filteredData.filter(dado => dado.CONTRATADA === 'TEL').length);
    
        // Atualizando os valores para os diferentes SLAs
        const dados2Hrs = filteredData.filter(dado => dado.SLA === '02:00');
        setTotalTAs2Hrs(dados2Hrs.length);
        setTotalAbility2Hrs(dados2Hrs.filter(dado => dado.CONTRATADA === 'ABILITY').length);
        setTotalTel2Hrs(dados2Hrs.filter(dado => dado.CONTRATADA === 'TEL').length);
    
        const dados4Hrs = filteredData.filter(dado => dado.SLA === '04:00');
        setTotalTAs4Hrs(dados4Hrs.length);
        setTotalAbility4Hrs(dados4Hrs.filter(dado => dado.CONTRATADA === 'ABILITY').length);
        setTotalTel4Hrs(dados4Hrs.filter(dado => dado.CONTRATADA === 'TEL').length);
    
        const dados6Hrs = filteredData.filter(dado => dado.SLA === '06:00');
        setTotalTAs6Hrs(dados6Hrs.length);
        setTotalAbility6Hrs(dados6Hrs.filter(dado => dado.CONTRATADA === 'ABILITY').length);
        setTotalTel6Hrs(dados6Hrs.filter(dado => dado.CONTRATADA === 'TEL').length);
    
        const dados24Hrs = filteredData.filter(dado => dado.SLA === '24:00');
        setTotalTAs24Hrs(dados24Hrs.length);
        setTotalAbility24Hrs(dados24Hrs.filter(dado => dado.CONTRATADA === 'ABILITY').length);
        setTotalTel24Hrs(dados24Hrs.filter(dado => dado.CONTRATADA === 'TEL').length);
    
        setIsLoading(false);
    };

    // Ordenamento das colunas da tabela

    const columns = [
        { Header: 'TA', accessor: 'TA' },
        { Header: 'ERB', accessor: 'ERB' },
        { Header: 'Data Criação', accessor: 'DT_CRIACAO' },
        { Header: 'SLA', accessor: 'SLA' },
        { Header: 'Município', accessor: 'MUNICIPIO' },
        { Header: 'DDD', accessor: 'DDD' },
        { Header: 'Tecnologia', accessor: 'TECNOLOGIA' },
        { Header: 'Contratada', accessor: 'CONTRATADA' },
        { Header: 'Impacto', accessor: 'IMPACTO' },
        { 
            Header: 'Prioridade', 
            accessor: 'PRIORIDADE',
            Cell: ({ value }) => {
                let style = {
                    textAlign: 'center',
                    borderRadius: '8px',
                    padding: '4px'
                };
                if (value === 'P1') {
                    style = { ...style, backgroundColor: 'red', color: 'white' };
                } else if (value === 'P2') {
                    style = { ...style, backgroundColor: 'yellow', color: 'black' };
                }
                return <div style={style}>{value}</div>;
            }
        },
        { Header: 'Aging', accessor: 'AGING' }
    ];

    return (
        <>
            <Header toggleSidebar={() => toggleSidebar(isClosed, setClosed)} isClosed={isClosed} />
            <Sidebar isClosed={isClosed} toggleSidebar={() => toggleSidebar(isClosed, setClosed)} />
            <div className={`ocorrencias-mapa-movel-container ${isClosed ? 'closed' : 'open'}`}>
            {loading ? (
                <div className="spinner">Carregando dados...</div>
                ) : (
                <>
                    <div className={`ocorrencias-mapa-movel-info ${isClosed ? 'closed' : 'open'} ${isShowHideMapa ?  'hide-mapa':'show-mapa'}`}>
                        <div className="ocorrencias-mapa-movel-title">{isShowHideMapa ? 'Ocorrências Móvel' : 'Mapa Móvel'}</div>
                        <div className="ocorrencias-mapa-movel-descricao">Visão das ocorrências da rede móvel</div>
                        <div className="ocorrencias-mapa-movel-descricao-section">
                            <div className="ocorrencias-mapa-movel-descricao-button">
                                {isShowHideMapa ? 'Exibir Mapa' : 'Exibir Dados'}
                            </div>
                            <div className="toggle-icons" onClick={toggleShowHideMapa}>
                            <FontAwesomeIcon 
                                icon={isShowHideMapa ? faToggleOn : faToggleOff} 
                                size="2x" 
                                color={isShowHideMapa ? "#39374e" : "#39374e"} 
                            />
                            </div>
                        </div>
                    </div>
            
                    <div id="map" className={`custom-popup ${isShowHideMapa ? 'open' : 'closed'}`}>
                        {!isShowHideMapa && (
                            <MapContainer
                                center={[-22.91527126881271, -47.073432593365936]}
                                zoom={7}
                                style={{ height: '100%', width: '100%' }}
                                zoomControl={false}
                            >
                                <ZoomControl position="bottomright" />
                                {selectedLayer === '1' && (
                                    <LayerGroup>
                                        {proiridade1.map((dado, index) => (
                                            <Prioridade1 key={dado.id || index} data={dado} />
                                        ))}
                                    </LayerGroup>
                                )}

                                {selectedLayer === '2' && (
                                    <LayerGroup>
                                        {proiridade2.map((dado, index) => (
                                            <Prioridade2 key={dado.id || index} data={dado} />
                                        ))}
                                    </LayerGroup>
                                )}

                                <LayersControl position="bottomleft">
                                    <LayersControl.BaseLayer checked name="OpenStreetMap">
                                        <TileLayer
                                            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                                            attribution='Guardião © 2024'
                                        />
                                    </LayersControl.BaseLayer>
                                    <LayersControl.BaseLayer name="openTopoMap">
                                        <TileLayer
                                            url='https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'
                                            attribution='Guardião © 2024'
                                        />
                                    </LayersControl.BaseLayer>

                                    <LayersControl.BaseLayer name="OpenStreetMap.HOT">
                                        <TileLayer
                                            url='https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'
                                            attribution='Guardião © 2024'
                                        />
                                    </LayersControl.BaseLayer>
                                    <LayersControl.Overlay name="1- Prioridade" checked>
                                        <LayerGroup>
                                            {proiridade1.map((dado, index) => (
                                                <Prioridade1 key={dado.id || index} data={dado} />
                                            ))}
                                        </LayerGroup>
                                    </LayersControl.Overlay>
                                    <LayersControl.Overlay name="2- Prioridade" checked>
                                        <LayerGroup>
                                            {proiridade2.map((dado, index) => (
                                                <Prioridade2 key={dado.id || index} data={dado} />
                                            ))}
                                        </LayerGroup>
                                    </LayersControl.Overlay>
                                </LayersControl>
                            </MapContainer>
                        )}
                    </div>
                    {/* Dados Cards, Filtros e Tabela */}
                    {isShowHideMapa && (
                        <div className="ocorrencias-mapa-movel-cardBody-section">
                            <CardTwo
                                icon={faHelmetSafety}
                                title="TAs"
                                value={totalTAs}
                                upDown={3}
                                valueModalRegional={`TAs: ${totalAbility}`}
                                valueModalContrato={`TAs: ${totalTel}`}
                                tituloRegional="Ability"
                                tituloContrato="Tel"
                                collapse={true}
                                width="185px"
                            />
                            <CardTwo
                                icon={faStopwatch}
                                title="Até 2 Horas"
                                value={totalTAs2Hrs}
                                upDown={totalTAs2Hrs > (totalTAs * 0.5) ? 0 : 1}
                                valueModalRegional={`TAs: ${totalAbility2Hrs}`}
                                valueModalContrato={`TAs: ${totalTel2Hrs}`}
                                tituloRegional="Ability"
                                tituloContrato="Tel"
                                collapse={true}
                                width="185px"
                            />
                            <CardTwo
                                icon={faStopwatch}
                                title="Até 4 Horas"
                                value={totalTAs4Hrs}
                                upDown={totalTAs4Hrs > (totalTAs * 0.5) ? 0 : 1}
                                valueModalRegional={`TAs: ${totalAbility4Hrs}`}
                                valueModalContrato={`TAs: ${totalTel4Hrs}`}
                                tituloRegional="Ability"
                                tituloContrato="Tel"
                                collapse={true}
                                width="185px"
                            />

                            <CardTwo
                                icon={faStopwatch}
                                title="Até 6 Horas"
                                value={totalTAs6Hrs}
                                upDown={totalTAs6Hrs > (totalTAs * 0.5) ? 0 : 1}
                                valueModalRegional={`TAs: ${totalAbility6Hrs}`}
                                valueModalContrato={`TAs: ${totalTel6Hrs}`}
                                tituloRegional="Ability"
                                tituloContrato="Tel"
                                collapse={true}
                                width="185px"
                            />
                        
                            <CardTwo
                                icon={faStopwatch}
                                title="Acima de 24 Horas"
                                value={totalTAs24Hrs}
                                upDown={totalTAs24Hrs > (totalTAs * 0.5) ? 0 : 1}
                                valueModalRegional={`TAs: ${totalAbility24Hrs}`}
                                valueModalContrato={`TAs: ${totalTel24Hrs}`}
                                tituloRegional="Ability"
                                tituloContrato="Tel"
                                collapse={true}
                                width="185px"
                            />
                    </div>
                    )}
                    {isShowHideMapa && (
                        <div className="ocorrencias-mapa-movel-descricao">Filtros</div>
                    )}
                    {isShowHideMapa && (
                        <div className="ocorrencias-mapa-movel-filtro-section">
                            
                            <div className="ocorrencias-mapa-movel-filters-container">
                                <div className="ocorrencias-mapa-movel-filter-row">
                                    <div className="ocorrencias-mapa-movel-filter-column">
                                        <label htmlFor="statusNt-filter" className="ocorrencias-mapa-movel-filter-label">
                                            <FontAwesomeIcon icon={faHelmetSafety} className="ocorrencias-mapa-movel-filter-icon" />
                                            {' '}   Impacto
                                        </label>
                                        <FilterDropdown
                                            label=""
                                            options={optionsImpacto}
                                            value={selectedImpacto}
                                            onChange={handleImpactoChange}
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
                                            options={optionsERB}
                                            value={selectedERB}
                                            onChange={handleERBChange}
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
                                            options={optionsTecnologia}
                                            value={selectedTecnologia}
                                            onChange={handleTecnologiaChange}
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
                                            options={optionsMunicipio}
                                            value={selectedMunicipio}
                                            onChange={handleMunicipioChange}
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
                                            options={optionsDDD}
                                            value={selectedDDD}
                                            onChange={handleDDDChange}
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
                                            options={optionsSLA}
                                            value={selectedSLA}
                                            onChange={handleSLAChange}
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
                                            options={optionsContratada}
                                            value={selectedContratada}
                                            onChange={handleContratadaChange}
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
                    )}
                    {isShowHideMapa && (
                        <div className="ocorrencias-mapa-movel-descricao">Analítico</div>
                    )}
                    {isShowHideMapa && (
                    <div className="ocorrencias-mapa-movel-table-section">
                        <AdvancedTable columns={columns} data={tabela} />
                    </div>
                    )}
            </>
            )}
            </div >
        </>
    );
};