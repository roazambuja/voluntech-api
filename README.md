<h1 align="center">voluntech-api</h1>
<p align="center" >
  <img src="http://img.shields.io/static/v1?label=STATUS&message=EM%20DESENVOLVIMENTO&color=GREEN&style=for-the-badge"/>
</p>
 
## :handshake: Sobre o projeto
O projeto consiste no back-end, em forma de API Rest, de uma aplicação Web que tem como objetivo conectar ONGs e voluntários, visando maior divulgação de projetos sociais e aumento no número de apoiadores. Por meio do trabalho proposto, as ONGs poderão divulgar seus projetos e definir o tipo de ajuda voluntária que necessitam, e os colaboradores poderão encontrar com mais facilidade causas e projetos para contribuir, podendo auxiliar com a prestação de serviços voluntários.

A aplicação Voluntech é um projeto desenvolvido como Trabalho de Conclusão de Curso, requisito para obtenção do título de Tecnólogo em Sistemas para Internet no IFSul Campus Charqueadas.

## :gear: Como executar

### 1. Clonar o repositório

```
git clone https://github.com/roazambuja/voluntech-api.git
```

### 2. Instalar as dependências

Rodar o comando `npm install` no diretório do projeto.

### 2. Criar o arquivo .env

Crie na raiz do projeto um arquivo chamado `.env` e configure as variáveis de ambiente definidas no arquivo `.env.sample`. Não esqueça de alterar os dados para as suas informações, principalmente a URL do banco de dados. Também é necessário criar uma conta no [Cloudinary](https://cloudinary.com/) para preencher os dados da API.

### 3. Iniciar o servidor

Rodar o comando `npm run dev`.

## :hammer_and_wrench: Tecnologias utilizadas

- [NodeJS](https://nodejs.org/en)
- [TypeScript](https://www.typescriptlang.org/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Cloudinary](https://cloudinary.com/)

## :open_file_folder: Links úteis

- [Repositório Front-end](https://github.com/roazambuja/voluntech)
