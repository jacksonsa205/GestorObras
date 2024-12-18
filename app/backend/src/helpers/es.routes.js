const express = require('express');
const router = express.Router();
const execSQLQuery = require('../database/connection');
const conversaoReq = require('./conversaoReq');

router.get('/:contrato', async (req, res) => {
    const { contrato } = req.params;

    try {
        const es = await execSQLQuery(`SELECT DISTINCT ES FROM [4FIELD].[dbo].[TB_4F_Regional_Contrato] WITH(NOLOCK)
        WHERE CONTRATO IN(${conversaoReq(contrato)})
        GROUP BY ES ORDER BY ES`);

        return res.json({ success: es });
    } catch (error) {
        console.error('Erro ao obter os clusters:', error);

        return res.status(500).json({ error: 'Erro ao obter as es' });
    }
});

module.exports = router;