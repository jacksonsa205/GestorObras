const Model = require('../../models/dashboard/painelEntrante');

// Função de tratamento de erros centralizada
const handleDatabaseError = (res, error) => {
    console.error('Erro no banco de dados:', error);

    return res.status(500).send('Erro ao executar as queries no banco de dados');
};

// Middleware para verificar permissões
const checkPermissions = (req, res, next) => {
    const { credencial, permissoesModulo, permissoesSubModulo } = req.session;
    if (credencial < '2'
        || !permissoesModulo.split(',').includes('121')
        || !permissoesSubModulo.split(',').includes('181')) {
        return res.status(403).send('Acesso negado: permissões insuficientes');
    }
    next();
};

// Obtém dados
const get = async (_req, res) => {
    try {
        const gaugeChart = await Model.gaugeChart();
        const entranteHxH = await Model.entranteHxH();
        const desvioHxH = await Model.desvioHxH();

        const responseObj = {
            gaugeChart,
            entranteHxH,
            desvioHxH,
           
        };

        return res.json(responseObj);
        
    } catch (error) {
        handleDatabaseError(res, error);
    }
};

module.exports = {
    checkPermissions,
    get,
};