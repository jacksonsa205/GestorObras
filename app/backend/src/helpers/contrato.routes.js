const express = require('express');
const router = express.Router();
const execSQLQuery = require('../database/connection');
const conversaoReq = require('./conversaoReq');

router.get('/:regional', async (req, res) => {
    const { regional } = req.params;

    try {
        const contratos = await execSQLQuery(`SELECT CONTRATO FROM [dbo].[TB_4F_Regional_Contrato] WITH(NOLOCK) 
        WHERE REGIONAL IN (${conversaoReq(regional)})
         GROUP BY CONTRATO ORDER BY CONTRATO`);

        return res.json({ success: contratos });
    } catch (error) {
        console.error('Erro ao obter os contratos:', error);

        return res.status(500).json({ error: 'Erro ao obter os contratos' });
    }
});

module.exports = router;