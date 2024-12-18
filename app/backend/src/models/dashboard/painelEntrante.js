const execSQLQuery = require('../../database/connection');

const gaugeChart = async () => {

    const query = `
    SELECT 
    CASE 
        WHEN [CLUSTER] IN ('ARACATUBA', 'BAURU', 'RIBEIRAO_PRETO', 'SAO_JOSE_DO_RIO_PRETO') THEN 'INTERIOR'
        WHEN [CLUSTER] IN ('PIRACICABA', 'SOROCABA') THEN 'PC_SC'
        ELSE [CLUSTER]
    END AS [CLUSTER],
    SUM(COALESCE([BDS], 0)) AS ENTRANTE,
    SUM(COALESCE([MEDIA_BDS], 0)) AS MEDIA,
	CASE WHEN CAST(SUM(KPI_DESVIO) AS decimal(10,2)) < = 10.00 THEN CAST(SUM(KPI_DESVIO) AS decimal(10,2)) ELSE
	10.00 END AS KPI_DESVIO
	
    FROM 
        [4FIELD].[dbo].[TB_4F_Mapa_Painel_Entrantes]
    WHERE 
        CAST([DATA_RECLAMACAO] AS DATE) = CAST(GETDATE() AS DATE)
    GROUP BY 
        CASE 
            WHEN [CLUSTER] IN ('ARACATUBA', 'BAURU', 'RIBEIRAO_PRETO', 'SAO_JOSE_DO_RIO_PRETO') THEN 'INTERIOR'
            WHEN [CLUSTER] IN ('PIRACICABA', 'SOROCABA') THEN 'PC_SC'
            ELSE [CLUSTER]
        END;`;

    return await execSQLQuery(query);
};

const entranteHxH = async () => {

    const query = `
    SELECT 
    [HORA],
    SUM(COALESCE([BDS], 0)) AS ENTRANTE,
    SUM(COALESCE([MEDIA_BDS], 0)) AS MEDIA,
    CASE WHEN CAST(SUM(KPI_DESVIO) AS decimal(10,2)) < = 10.00 THEN CAST(SUM(KPI_DESVIO) AS decimal(10,2)) ELSE
	10.00 END AS KPI_DESVIO
    
    FROM 
        [4FIELD].[dbo].[TB_4F_Mapa_Painel_Entrantes]
    WHERE 
        CAST([DATA_RECLAMACAO] AS DATE) = CAST(GETDATE() AS DATE)
    GROUP BY 
        [HORA];`;

    return await execSQLQuery(query);
};

const desvioHxH = async () => {

    const query = `
    SELECT 
    [HORA],
    FORMAT(AVG(COALESCE([PERCENT_DESVIO], 0)), 'N2') AS DESVIO
    FROM 
        [4FIELD].[dbo].[TB_4F_Mapa_Painel_Entrantes]
    WHERE 
        CAST([DATA_RECLAMACAO] AS DATE) = CAST(GETDATE() AS DATE)
    GROUP BY 
        [HORA];`;

    return await execSQLQuery(query);
};



module.exports = {
    gaugeChart,
    entranteHxH,
    desvioHxH,
};