# Configurações de git básicas do projeto
- ```bash git remote -v ``` Verifica os repositórios remotos
- ```bash git remote rename origin o``` Renomeia o repositório remoto origin para o
- ```bash yarn add standard -D``` Modulo similar ao eslint porem vem com uma configuração padrão para formatação de código
- Instale o plugin *standard* no vscode e ative-o no workspace para que ele aplique as regras de formatação
- ```bash npx standard --fix``` Aplica as regras de formatação
- ```bash npx standard``` Verifica se o código está de acordo com as regras de formatação
- ```bash yarn add lint-staged -D``` Modulo que permite executar scripts de checagem e formatação (standard) nos arquivos que estão na stage do git.
- ```bash yarn add husky -D``` Modulo executa scripts hooks antes de um commit, neste caso ele ira executar o lint-staged e impedir o commit de acontecer caso o código não esteja de acordo com as regras de formatação
  - O pode dar problemas no mac, para resolver isso, execute o comando ```bash yarn remove husky```,  ```bash yarn add -D husky```,  ```bash yarn husky install```,  ```bash yarn husky add .husky/pre-commit "lint-staged"``` e ```bash chmod a+x .husky/pre-commit``` após isso, o husky irá funcionar normalmente mas ele pode não estar executando o lint-staged, para resolver isso, abra o arquivo .husky/pre-commit e substitua **lint-staged** por **node_modules/.bin/lint-staged**
  - Adicione o código de configuração do husky/lint-staged/standard no package.json
  - ```javascript {
    "lint-staged": {
        "*.js": [
            "standard --fix",
            "git add"
        ]
    },
    "husky": {
        "hooks": {
            "pre-commit": "npx lint-staged"
        }
    }
```
- Adicione ao **standard** as variáveis de ambiente do **jest** para não ficar dando erro de variável não definida
- ```javascript {
    "env": {
        "jest": true
    }
}
```

# Jest
- S.U.T. System Under Test, é o sistema que está sendo testado, no caso se tiver várias variáveis no sistema, o S.U.T. é a variável que está sendo testada
- ```bash jest --passWithNoTests``` Retorna verdadeiro quando da um teste sem testes no staged do git
- ```jest --findRelatedTests``` é parecido com o **--watch**, porém ele executa apenas os testes relacionados ao arquivo que foi alterado
- ```bash jest --watch``` Roda os testes em todos os arquivos alterados e fica observando para executar novamente quando houver alteração
- ```bash jest --silent``` Não apresenta a mensagem de teste passando ou falhando e nem os **console.***
- ```bash jest --silent --verbose``` Apresenta a mensagem de teste passando ou falhando porem não apresenta os **console.***
- ```bash jest --noStackTrace``` Apresenta apenas a falha do teste e não a pilha de execução

# Status
| Código | Descrição                                             |
| ------ | ----------------------------------------------------- |
| 400    | Falha                                                 |
| 401    | Não reconheço o usuário                               |
| 403    | Reconheço o usuário, porem o mesmo não tem permissão. |
| 500    | ?                                                     |
