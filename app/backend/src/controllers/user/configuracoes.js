const Model = require('../../models/user/configuracoes');

// Função de tratamento de erros centralizada
const handleDatabaseError = (res, error) => {
    console.error('Erro no banco de dados:', error);
    return res.status(500).send('Erro ao executar as queries no banco de dados');
};



const get = async (req, res) => {
    try {
        // Aqui você deve recuperar os dados do corpo da requisição usando req.query
        const { idUser} = req.query;

        // Chamar a função correspondente do model para obter os dados, passando o contrato como parâmetro
        const verificaDadosUser = await Model.verificaDadosUser(idUser);
        

        const responseObj = {
            verificaDadosUser:verificaDadosUser,
        };
        
        
        return res.json(responseObj);
    } catch (error) {
        handleDatabaseError(res, error);
    }
};

const put = async (req, res) => {
    try {
        const { ID, CELULAR,RE } = req.query;

        if (!ID || !CELULAR || !RE) {
            return res.status(400).json({ error: 'Falta de parâmetros necessários' });
        }
        

        // Atualiza o operador com o novo socketId
        const atualizaDadosUser = await Model.atualizaDadosUser(ID, CELULAR, RE);
        console.log(atualizaDadosUser);
        console.log(ID, CELULAR, RE);
        const responseObj = {
            atualizaDadosUser:atualizaDadosUser
        };

        
        return res.json(responseObj);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Erro ao executar as queries no banco de dados');
    }
};



module.exports = {
    get, put
};