const express = require('express');
const router = express.Router();
const execSQLQuery = require('../database/connection');
const conversaoReq = require('./conversaoReq');

router.get('/:es', async (req, res) => {
    const { es } = req.params;

    try {
        const olt = await execSQLQuery(`SELECT DISTINCT OLT FROM [dbo].[VW_4F_Alarme_Geofibra_Concentracao]
        WHERE ES in (${conversaoReq(es)}) ORDER BY OLT`);

        return res.json({ success: olt });
    } catch (error) {
        console.error('Erro ao obter os olt:', error);

        return res.status(500).json({ error: 'Erro ao obter as olt' });
    }
});

module.exports = router;


