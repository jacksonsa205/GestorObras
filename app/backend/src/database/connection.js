require("dotenv").config();
const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

// Função para executar queries no Supabase
async function execSQLQuery(table, action, params = {}) {
  try {
    let result;

    switch (action) {
      case 'select':
        result = await supabase.from(table).select(params.columns || '*');
        break;

      case 'insert':
        result = await supabase.from(table).insert(params.data);
        break;

      case 'update':
        result = await supabase.from(table).update(params.data).match(params.match);
        break;

      case 'delete':
        result = await supabase.from(table).delete().match(params.match);
        break;

      default:
        throw new Error('Ação não reconhecida na query.');
    }

    if (result.error) throw result.error;

    return result.data;
  } catch (err) {
    console.error('Erro na query:', err.message);
    throw err;
  }
}

module.exports = execSQLQuery;
