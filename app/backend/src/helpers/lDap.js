const ActiveDirectory = require('activedirectory');

const config = {
    dominios: [
        {
            nome: "redecorp 389",
            endereco: "redecorp.br",
            dc: "dc=gvt,dc=net,dc=br",
            porta: 389
        },
        {
            nome: "redecorp 636",
            endereco: "redecorp.br",
            dc: "dc=gvt,dc=net,dc=br",
            porta: 636
        },
        {
            nome: "gvt 389",
            endereco: "gvt.net.br",
            dc: "dc=gvt,dc=net,dc=br",
            porta: 389
        },

        {
            nome: "gvt 636",
            endereco: "gvt.net.br",
            dc: "dc=gvt,dc=net,dc=br",
            porta: 636
        }
        , {
            nome: "vipredecorp 389",
            endereco: "vipredecorp",
            dc: "dc=gvt,dc=net,dc=br",
            porta: 389
        },
        {
            nome: "vipredecorp 636",
            endereco: "vipredecorp",
            dc: "dc=gvt,dc=net,dc=br",
            porta: 636
        },
        {
            nome: "vipgvt 389",
            endereco: "vipgvt",
            dc: "dc=gvt,dc=net,dc=br",
            porta: 389
        },
        {
            nome: "vipgvt 636",
            endereco: "vipgvt",
            dc: "dc=gvt,dc=net,dc=br",
            porta: 636
        },
    ]
}

class Ldap {
    constructor() {
        const self = this;

        this.autenticar = function (dados) {
            const promessasAutenticacao = config.dominios.map((dominio, index) => {
                return self.autenticarLdap(dados, index);
            });

            return Promise.all(promessasAutenticacao);
        };

        this.autenticarLdap = function (dados, indexDominio) {
            return new Promise((resolve, reject) => {
                const dominio = config.dominios[indexDominio];
                const senha = dados.senha;
                let usuario;

                if (dominio.endereco.includes("redecorp") && dominio.endereco !== "redecorp.br") {
                    usuario = dados.usuario + "@" + "redecorp.br";
                } else if (dominio.endereco.includes("gvt") && dominio.endereco !== "gvt.net.br") {
                    usuario = dados.usuario + "@" + "gvt.net.br";
                } else {
                    usuario = dados.usuario + "@" + dominio.endereco;
                };

                const retorno = {
                    autenticado: false,
                    erro: null,
                    dominio: null,
                    dc: dominio.dc,
                    porta: dominio.porta
                };

                const configuracoesLdap = {
                    url: `ldap://${dominio.endereco}`,
                    baseDN: dominio.dc,
                    maxConnections: 2000,
                    port: dominio.porta
                };

                const ad = new ActiveDirectory(configuracoesLdap);

                ad.authenticate(usuario, senha, function (err, auth) {
                    retorno.erro = err;
                    retorno.autenticado = auth;

                    if (auth) {
                        retorno.dominio = dominio.nome;
                        resolve(retorno);
                    } else {
                        resolve(retorno); // Mesmo que a autenticação tenha falhado, resolve a Promise para continuar com as próximas tentativas.
                    }
                });
            });
        };
    }
}

module.exports = new Ldap();