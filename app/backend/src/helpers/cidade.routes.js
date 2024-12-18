const express = require('express');
const router = express.Router();
const execSQLQuery = require('../database/connection');
const conversaoReq = require('./conversaoReq');

router.get('/:contrato', async (req, res) => {
    const { contrato } = req.params;

    try {
        const cidades = await execSQLQuery(`SELECT MUNICIPIO AS CIDADE 
        FROM [dbo].[TB_4F_Regional_Contrato] WITH(NOLOCK) 
        WHERE CONTRATO IN(${conversaoReq(contrato)})
        GROUP BY MUNICIPIO ORDER BY MUNICIPIO`);

        return res.json({ success: cidades });
    } catch (error) {
        console.error('Erro ao obter os cidades:', error);

        return res.status(500).json({ error: 'Erro ao obter os cidades' });
    }
});

module.exports = router;