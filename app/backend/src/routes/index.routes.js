const login = require('./login/login.routes');
const authenticator = require('./authenticator/authenticator.routes');
const painelEntrante = require('./dashboard/painelEntrante.routes');
const mapaMovel = require('./movel/mapa.routes');
const evolucaoBacklog = require('./movel/evolucaoBacklog.routes');
const configuracoes = require('./user/configuracoes.routes');
const logs = require('./user/logs.routes');

module.exports = {
    login,
    authenticator,
    painelEntrante,
    mapaMovel,
    evolucaoBacklog,
    configuracoes,
    logs,
};