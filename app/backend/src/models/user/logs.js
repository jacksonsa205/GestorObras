const execSQLQuery = require('../../database/connection');

const table = async (regional, contrato) => {
  
    const query =`SELECT * FROM [dbo].[VW_4F_Log_Mapeamento] WHERE DATA = CAST(GETDATE() AS DATE)`;

    return await execSQLQuery(query);
};

module.exports = {
    table
};
