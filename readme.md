# Configurações de git básicas do projeto
- ```bash git remote -v ``` Verifica os repositórios remotos
- ```bash git remote rename origin o``` Renomeia o repositório remoto origin para o
- ```bash yarn add standard -D``` Modulo similar ao eslint porem vem com uma configuração padrão para formatação de código
- Instale o plugin *standard* no vscode e ative-o no workspace para que ele aplique as regras de formatação
- ```bash npx standard --fix``` Aplica as regras de formatação
- ```bash npx standard``` Verifica se o código está de acordo com as regras de formatação
- ```bash yarn add lint-staged -D``` Modulo que permite executar scripts de checagem e formatação (standard) nos arquivos que estão na stage do git.
- ```bash yarn add husky -D``` Modulo executa scripts hooks antes de um commit, neste caso ele ira executar o lint-staged e impedir o commit de acontecer caso o código não esteja de acordo com as regras de formatação
  - O pode dar problemas no mac, para resolver isso, execute o comando ```bash yarn remove husky```,  ```bash yarn add -D husky```,  ```bash yarn husky install```,  ```bash yarn husky add .husky/pre-commit "lint-staged"``` e ```bash chmod a+x .husky/pre-commit```