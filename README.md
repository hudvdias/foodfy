# Desafio Final - Foodfy

## Sobre

Site de Receitas Foodfy.

Projeto do desafio final do bootcamp Launchstore, da Rocketseat.

### Tecnologias

**Front-End**
- [x] HTML
- [x] CSS
- [x] Javascript
- [x] Nunjucks *(Template Engine)*

**Back-End**
- [x] NodeJS
- [x] Postgre *(SQL Server)*
- [x] Express *(Framework)*

## Instalação

### Itens Necessários

- [Node.js](https://nodejs.org/en/)
- [Visual Studio Code](https://code.visualstudio.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Postbird](https://www.electronjs.org/apps/postbird)
- Account on [MailTrap](https://mailtrap.io/)

### Passos

1. Baixar os arquivos do projeto;
1. Abrir pasta do projeto no VSCode;
1. Executar comando ```npm install``` no terminal;
1. Executar as linhas do arquivo **database.sql** no Postbird;
1. Configure o arquivo **db.js** na pasta "*src/config*" com suas informações do Postbird;
1. Configurar o arquivo **mailer.js** na pasta "*src/config*" com suas informações do MailTrap;
1. Executar o comando ```node seed.js``` no terminal;
1. Executar o comando ```npm start``` no terminal.

## Observações

As informações do usuário administrador do sistema, e a senha padrão dos demais usuários, se encontram no arquivo **seed.js**.

As fotos das receitas geradas pelo arquivo **seed.js** são fotos do [lorempixel](http://lorempixel.com/), que pode apresentar problemas de conexão.