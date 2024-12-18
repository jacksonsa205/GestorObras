import React, { useState } from 'react';
import './Sidebar.css';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faHouseSignal, faTowerCell,faCircleNodes, faCircle, faBatteryQuarter, faTachometerAlt, faChartSimple } from '@fortawesome/free-solid-svg-icons';
import logo from "../../assets/images/logo/signalmonitoLogoDash5.png";
import logo2 from "../../assets/images/logo/signalmonitoLogoDash4.png";

export const Sidebar = ({ isClosed }) => {
    const [openSubmenu, setOpenSubmenu] = useState(null);
    const navigate = useNavigate();

    const items = [
        {
            text: 'Dashboard',
            icon: faHouse,
            route: '/dashboard'
        },
        {
            text: 'Backbone',
            icon: faCircleNodes,
            subItems: [
                // {
                //     text: 'Mapa',
                //     icon: faCircle,
                //     route: '/movel/mapa-fixa'
                // },
                // {
                //     text: 'Backlog Ocorrências',
                //     icon: faCircle,
                //     route: '/movel/mapa-movel'
                // },
                
            ]
        },
        {
            text: 'Móvel',
            icon: faTowerCell,
            subItems: [
                {
                    text: 'Mapa',
                    icon: faCircle,
                    route: '/movel/mapa-movel'
                },
                {
                    text: 'Evolução Backlog',
                    icon: faCircle,
                    route: '/movel/evolucao-backlog'
                },
                
            ]
        },
        {
            text: 'Infra',
            icon: faBatteryQuarter,
            subItems: [
                // {
                //     text: 'Mapa',
                //     icon: faCircle,
                //     route: '/movel/mapa-fixa'
                // },
                // {
                //     text: 'Backlog Ocorrências',
                //     icon: faCircle,
                //     route: '/movel/mapa-movel'
                // },
                // {
                //     text: 'Grande Vulto',
                //     icon: faCircle,
                //     route: '/movel/mapa-movel'
                // },
            ]
        },
        {
            text: 'Ast/Gpon',
            icon: faHouseSignal,
            subItems: [
                {
                    text: 'Mapa',
                    icon: faCircle,
                    route: '/ast-gpon/mapa-fixa'
                },
                // {
                //     text: 'Backlog Ocorrências',
                //     icon: faCircle,
                //     route: '/ast-gpon/mapa-movel'
                // },
                // {
                //     text: 'Grande Vulto',
                //     icon: faCircle,
                //     route: '/ast-gpon/mapa-movel'
                // },
            ]
        },
        {
            text: 'Performance',
            icon: faTachometerAlt,
            subItems: [
                // {
                //     text: 'Mapa',
                //     icon: faCircle,
                //     route: '/movel/mapa-fixa'
                // },
                // {
                //     text: 'Backlog Ocorrências',
                //     icon: faCircle,
                //     route: '/movel/mapa-movel'
                // },
                // {
                //     text: 'Grande Vulto',
                //     icon: faCircle,
                //     route: '/movel/mapa-movel'
                // },
            ]
        },
        // {
        //     text: 'Relatorios P.B',
        //     icon: faChartSimple,
        //     subItems: [
        //         {
        //             text: 'Mapa',
        //             icon: faCircle,
        //             route: '/movel/mapa-fixa'
        //         },
        //         {
        //             text: 'Backlog Ocorrências',
        //             icon: faCircle,
        //             route: '/movel/mapa-movel'
        //         },
        //         {
        //             text: 'Grande Vulto',
        //             icon: faCircle,
        //             route: '/movel/mapa-movel'
        //         },
        //     ]
        // },
        
    ];

    const handleItemClick = (index, route) => {
        if (openSubmenu === index) {
            setOpenSubmenu(null);
        } else {
            setOpenSubmenu(index);
            if (route) {
                navigate(route);
            }
        }
    };

    const handleSubItemClick = (route) => {
        navigate(route);
    };

    const handleSubmenuClick = (index) => {
        setOpenSubmenu(index);
    };

    return (
        <div className={`ffi-sidebar ${isClosed ? 'open' : ''}`}>
            <div className={isClosed ? 'logo-closed' : 'logo-open'}>
                <Link to="/dashboard">
                    <img src={isClosed ? logo2 : logo} alt="logo" />
                </Link>
            </div>
            {isClosed ? (
                <ul>
                    {items.map((item, index) => (
                        <li key={index} className={`ffi-icon-closed ${openSubmenu === index ? 'active' : ''}`} onClick={() => handleItemClick(index, item.route)}>
                            <div className="ffi-icon-closed">
                                <FontAwesomeIcon icon={item.icon} className="ffi-icon" />
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <nav className="ffi-sidebar-nav">
                    <ul>
                        {items.map((item, index) => (
                            <li key={index} className={`ffi-icon-open ${openSubmenu === index ? 'active' : ''}`}>
                                <div className="ffi-icon-open" onClick={() => handleItemClick(index, item.route)}>
                                    <FontAwesomeIcon icon={item.icon} className="ffi-icon" />
                                    {item.text && <span className="ffi-text">{item.text}</span>}
                                </div>
                                {item.subItems && item.subItems.length > 0 && openSubmenu === index && (
                                    <ul>
                                        {item.subItems.map((subItem, subIndex) => (
                                            <li key={subIndex} className={`ffi-icon-open-sub ${isClosed ? 'ffi-icon-open' : ''}`} onClick={() => handleSubItemClick(subItem.route)}>
                                                <div className="ffi-icon-open-sub" onClick={() => handleSubmenuClick(index)}>
                                                    <FontAwesomeIcon icon={subItem.icon} className="ffi-icon" />
                                                    {!isClosed && subItem.text && <span className="ffi-text">{subItem.text}</span>}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>
            )}
        </div>
    );
};