import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { MapaMovel } from './Mapa/Mapa';
import { EvolucaoBacklog } from './EvolucaoBacklog/EvolucaoBacklog';

export const Movel = () => {
    return (
        <Routes>
            <Route path="/mapa-movel" element={<MapaMovel />} />
            <Route path="/evolucao-backlog" element={<EvolucaoBacklog />} />
        </Routes>
    );
}