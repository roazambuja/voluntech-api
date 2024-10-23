import { ObjectId } from "mongoose";

export interface User {
  _id?: ObjectId;
  name: string;
  email: string;
  password: string;
  role: string;
  profilePicture?: {
    filePath: string;
    publicId: string;
  };
}

export interface Organization extends User {
  cause: string;
  description: string;
  developmentGoals?: UNDevelopmentGoals[];
}

export enum UNDevelopmentGoals {
  "Erradicação da Pobreza",
  "Fome Zero e Agricultura Sustentável",
  "Saúde e Bem-Estar",
  "Educação de Qualidade",
  "Igualdade de Gênero",
  "Água Potável e Saneamento",
  "Energia Limpa e Acessível",
  "Trabalho Decente e Crescimento Econômico",
  "Indústria, Inovação e Infraestrutura",
  "Redução das Desigualdades",
  "Cidades e Comunidades Sustentáveis",
  "Consumo e Produção Responsáveis",
  "Ação Contra a Mudança Global do Clima",
  "Vida na Água",
  "Vida Terrestre",
  "Paz, Justiça e Instituições Eficazes",
  "Parcerias e Meios de Implementação",
}
