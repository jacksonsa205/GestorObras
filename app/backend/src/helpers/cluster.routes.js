const express = require('express');
const router = express.Router();
const execSQLQuery = require('../database/connection');
const conversaoReq = require('./conversaoReq');

router.get('/:contrato', async (req, res) => {
    const { contrato } = req.params;

    try {
        const clusters = await execSQLQuery(`SELECT distinct CLUSTER FROM [4FIELD].[dbo].[TB_4F_Regional_Contrato] WITH(NOLOCK)
        WHERE CONTRATO IN(${conversaoReq(contrato)})
        GROUP BY CLUSTER ORDER BY CLUSTER`);

        return res.json({ success: clusters });
    } catch (error) {
        console.error('Erro ao obter os clusters:', error);

        return res.status(500).json({ error: 'Erro ao obter os cidades' });
    }
});

module.exports = router;