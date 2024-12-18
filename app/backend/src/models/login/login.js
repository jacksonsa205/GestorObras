const supabase = require('../../auth/Supabase');

const verificaCodigoAcesso = async (login) => {
  const { data, error } = await supabase
    .from('VW_4F_Login')
    .select('2FA, TOKEN')
    .eq('RE', login);

  if (error) {
    throw error;
  }

  return data;
};

const verificaLogin = async (login) => {
  const { data, error } = await supabase
    .from('VW_4F_Login')
    .select('*, FORMAT(getdate(), \'yyyyMMddHHmmss\') || ID as SESSAO_ID')
    .eq('RE', login)
    .in('STATUS', [1, 2, 4]);

  if (error) {
    throw error;
  }

  return data;
};

const atualizaIdSessao = async (login, SESSAO_ID) => {
  const { error } = await supabase
    .from('TB_4F_Login')
    .update({ ID_SESSAO: SESSAO_ID })
    .eq('RE', login);

  if (error) {
    throw error;
  }
};

module.exports = { verificaCodigoAcesso, verificaLogin, atualizaIdSessao };
