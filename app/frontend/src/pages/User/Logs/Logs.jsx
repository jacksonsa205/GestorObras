import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../../components/Header/Header';
import { Sidebar } from '../../../components/Sidebar/Sidebar';
import { AdvancedTable } from '../../../components/AdvancedTable/AdvancedTable';
import { toggleSidebar } from '../../../helpers/toggleSidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import './Logs.css';

export const Logs = () => {
    const [isSidebarClosed, setIsSidebarClosed] = useState(false);
    const [tabela, setTabela] = useState([]);

    const navigate = useNavigate();

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
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://${process.env.REACT_APP_IP_APP}:${process.env.REACT_APP_PORT}/user/logs`, { withCredentials: true });

                const { table } = response.data;

                setTabela(table);

            } catch (error) {
                console.error("Erro ao obter os dados da tabela:", error);
            }
        };
        fetchData();
    }, []);

    const handleRowClick = rowData => {
        // console.log(`/logs/user/${rowData}`);
    };

    const columnOrder = [
        { key: 'DATA_LOG', header: 'Data' },
        { key: 'USUARIO', header: 'Usuário' },
        { key: 'ACAO', header: 'Ação' },
        { key: 'MENSAGEM', header: 'Mensagem' },
        { key: 'IP', header: 'IP' },
        { key: 'MODULO', header: 'Módulo' },
        { key: 'SUB_MODULO', header: 'Página' },
        {
            header: 'Logs',
            Cell: ({ row }) => (
                <div 
                className='table-search-button'
                onClick={() => handleRowClick(row.original.ID)} >
                    <FontAwesomeIcon
                        icon={faSearch}
                    />
                </div>
            ),
        },
    ];

    const columns = tabela ? columnOrder.map(column => ({
        Header: column.header,
        accessor: column.key || column.header,
        Cell: column.Cell || (({ value }) => typeof value === 'object' ? JSON.stringify(value) : (
            <span>
                {value}
                {column.suffix && ` ${column.suffix}`}
            </span>
        )),
    })) : [];

    return (
        <>
            <Header toggleSidebar={() => toggleSidebar(isSidebarClosed, setIsSidebarClosed)} />
            <Sidebar isClosed={isSidebarClosed} toggleSidebar={() => toggleSidebar(isSidebarClosed, setIsSidebarClosed)} />
            <div className={`dani-chat-esse-container ${isSidebarClosed ? 'closed' : 'open'}`}>
                <div className='dani-chat-esse-header'>
                    <div className="dani-chat-esse-title">Logs do Sistema</div>
                    <div className="dani-chat-esse-icons">
                    </div>
                </div>
                <div className="dani-chat-esse-descricao">Lista de logs de acesso registrado por uso dos usuários.</div>
                <div className="dani-chat-esse-table-description">Analítico</div>
                <div className="advanced-table-container">
                    <AdvancedTable columns={columns} data={tabela} className="dani-chat-table" />
                </div>
                <footer className="footer">4Field © 2024</footer>
            </div>
        </>
    );
};
