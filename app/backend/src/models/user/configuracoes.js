const execSQLQuery = require('../../database/connection');


const verificaDadosUser = async (idUser) => {

  const query = `SELECT TOP 1 *, CONCAT(FORMAT(getdate(), 'yyyyMMddHHmmss'), ID) AS SESSAO
  FROM [4FIELD].[dbo].[VW_4F_Login] 
  WHERE ID = '${idUser}' 
  `;

  const result = await execSQLQuery(query);
  return result;
};

const atualizaDadosUser = async (ID, CELULAR, RE) => {

  const query = `UPDATE [4FIELD].[dbo].[VW_4F_Login]
  SET
      [CELULAR] = '${CELULAR}'
      ,[RE] = '${RE}'
      
  WHERE
      [ID] = '${ID}' 
  `;

  const result = await execSQLQuery(query);
  return result;
};





module.exports = { verificaDadosUser, atualizaDadosUser };
