const Model = require('../../models/user/logs');

// Função de tratamento de erros centralizada
const handleDatabaseError = (res, error) => {
    console.error('Erro no banco de dados:', error);

    return res.status(500).send('Erro ao executar as queries no banco de dados');
};

// Obtém dados
const get = async (req, res) => {
    try {
        const { regional, contrato } = req.session;

        const table = await Model.table(regional, contrato);

        const responseObj = {
            table,
        };
        return res.json(responseObj);
    } catch (error) {
        handleDatabaseError(res, error);
    }
};

module.exports = {
    get
};