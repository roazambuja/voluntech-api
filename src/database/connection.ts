import mongoose from 'mongoose';

export default function databaseConnection() {
    mongoose
      .connect(process.env.MONGO_URL!)
      .then(() => console.log(`Conectado ao banco de dados em ${process.env.MONGO_URL}`))
      .catch(() => {
        console.log('Falha de acesso ao banco de dados');
      });
  }