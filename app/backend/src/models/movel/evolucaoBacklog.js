const execSQLQuery = require('../../database/connection');

const dadosMovel = async () => {

    const query = `
    SELECT TQA_CODIGO as TA , ALIADA , lat , long , TQA_PRIORIDADE , ERB,FORMAT(TQA_DATA_CRIACAO, 'dd/MM/yyyy HH:mm') as TQA_DATA_CRIACAO
    from [4FIELD].[dbo].[TB_4F_Mapa_Monitoramento_Movel_ERB_Ativa2]
    where AEQ_TECNOLOGIA <> 'GSM'`;

    return await execSQLQuery(query);
};

const tasPrioridadeMovel = async () => {

    const query = `
    SELECT 
    count(distinct(TQA_CODIGO)) as 'TAS',
    TQA_PRIORIDADE,
    CASE WHEN TQA_PRIORIDADE = 1 THEN 'P1' ELSE 'P2' END AS 'FLAG_PRIORIDADE',
    FORMAT(data_foto, 'dd/M HH:mm ddd') as DT_REF
    FROM [4FIELD].[dbo].[TB_4F_Mapa_ERBs_ATIVAS_FOTO]
    WHERE CAST(data_foto AS DATE) = CAST(GETDATE() AS DATE)
        AND AEQ_TECNOLOGIA <> 'GSM'
    GROUP BY 
        TQA_PRIORIDADE,
        FORMAT(data_foto, 'dd/M HH:mm ddd')
    ORDER BY FORMAT(data_foto, 'dd/M HH:mm ddd') ASC;`;

    return await execSQLQuery(query);
};

const dadosMovelTabela = async () => {

    const query = `
    SELECT 
    TQA_CODIGO as TA, 
    ERB,
    FORMAT(TQA_DATA_CRIACAO, 'dd/MM/yyyy HH:mm') as DT_CRIACAO,
    SLA,
    MUNICIPIO,
    CN as DDD,
    AEQ_TECNOLOGIA as TECNOLOGIA,
    ALIADA as CONTRATADA,
    FLI_IMPACTO as IMPACTO,
    CASE 
        WHEN TQA_PRIORIDADE = 1 THEN 'P1'
        WHEN TQA_PRIORIDADE = 2 THEN 'P2'
        ELSE CAST(TQA_PRIORIDADE AS VARCHAR)
    END as PRIORIDADE,
    AGING
FROM [4FIELD].[dbo].[TB_4F_Mapa_Monitoramento_Movel_ERB_Ativa2]
WHERE AEQ_TECNOLOGIA <> 'GSM'
ORDER BY 
    TQA_DATA_CRIACAO DESC`;

    return await execSQLQuery(query);
};

module.exports = {
    dadosMovel,
    tasPrioridadeMovel,
    dadosMovelTabela,
};