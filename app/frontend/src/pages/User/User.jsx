import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Configuracoes } from './Configuracoes/Configuracoes';
import { Logs } from './Logs/Logs';

export const User = () => {
    return (
        <Routes>
            <Route path="/configuracoes" element={<Configuracoes/>} />
            <Route path="/logs" element={<Logs/>} />
        </Routes>
    );
}