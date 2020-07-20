# Foodfy

<img src="https://github.com/hudvdias/foodfy/blob/master/public/images/chef.png" height=100 alt="Chef do Foodfy"/> <img src="https://github.com/hudvdias/foodfy/blob/master/public/images/logo.png" alt="Foodfy" />

#### Projeto de avaliação do bootcamp Launchbase, da Rocketseat.

#### [Sobre](#-objetivo) — [Funcionalidades](#-funcionalidades) — [Demonstração](#-demonstração) — [Tecnologias](#-tecnologias) — [Utilização](#-utilização) — [Licença](#-licença) — [Autor](#-autor)

#### Status: Concluído ✅

## 💡 Objetivo

O objetivo do projeto é criar um site de receitas que segue os padrões MVC, com sistema de login, validação de dados e sistema de administração.

## 🛠 Funcionalidades

- [x] Conexão ao banco de dados;
- [x] Busca de receitas por nome;
- [x] Área administrativa;
- [x] Criação de usuários;
- [x] Envio de senha por e-mail;
- [x] Sistema de Login/Logout;
- [x] Alteração de dados do usuário;
- [x] Alteração e remoção de dados de todos os usuários pelo administrador;
- [x] Criação, edição e remoção de chefs pelo administrador;
- [x] Criação, edição e remoção de todas as receitas pelo administrador;
- [x] Criação, edição e remoção de receitas pelos usuários;
- [x] Upload de múltiplas imagens com visualizador nas receitas;
- [x] Filtragem de receitas por chefs e por usuários na área administrativa.

## 🎨 Demonstração

Em breve.

## 💻 Principais Tecnologias

- [x] HTML
- [x] CSS
- [x] Javascript
- [x] Node Js
- [x] Nunjucks
- [x] Express
- [x] PostgreSQL

*Para visualizar todos as tecnologias e pacotes utilizados no projeto, acesse o arquivo package.json.*

## 🚀 Utilização

```bash
# Faça um clone do diretório ou download dos arquivos
$ git clone https://github.com/hudvdias/foodfy.git
```

#### 🗄 Banco de dados

*Para utilizar o banco de dados, você deve ter o [PostgreSQL](https://www.postgresql.org/) e o [Postbird](https://www.electronjs.org/apps/postbird) instalados na sua máquina.*

```bash
# Edite o arquivo "db.js" na pasta config para inserir suas credenciais do Postbird

# Crie o banco de dados com o nome "foodfy" através do Postbird

# Execute os comandos do arquivo "database.sql"

# Execute as seeds pelo terminal na pasta raiz do projeto
$ node seed.js
```

#### 🖥 Aplicação

*Para utilizar o serviço de email do projeto, é necessario criar uma conta no [Mailtrap](https://mailtrap.io/).*

```bash
# Instale as dependências na pasta raiz do projeto
$ npm install

# Inicie o servidor
$ npm start

# Altere o arquivo "mailer.js" na pasta config para inserir suas credenciais do Mailtrap
```

#### ⚠ Observações

As informações do usuário administrador do sistema, e a senha padrão dos demais usuários, se encontram no arquivo **seed.js**.

As fotos das receitas geradas pelo arquivo **seed.js** são fotos do [lorempixel](http://lorempixel.com/), que pode apresentar problemas de conexão.

## 📃 Licença

Este repositório está sob licença MIT. Para mais informações, leia o arquivo [LICENSE](https://github.com/hudvdias/foodfy/blob/master/LICENSE).

## 🧑 Autor

Feito por **Hudson Dias**. [Entre em contato!](https://www.linkedin.com/in/hudvdias/)

Idealizado por [**Rocketseat**](https://rocketseat.com.br/).
