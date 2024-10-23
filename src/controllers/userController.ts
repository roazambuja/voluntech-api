import { Request, Response } from "express";
import UserModel from "../models/user";
import bcrypt from "bcrypt";
import OrganizationModel from "../models/organization";
import { uploadToCloudinary } from "../services/cloudinary";
import AddressModel from "../models/address";
import { AuthenticatedRequest } from "../middlewares/token";

class UserController {
  static registerUser = async (req: Request, res: Response) => {
    try {
      const { name, email, password, role, description, cause, cep, city, state } = req.body;

      let findUser = await UserModel.findOne({ email });
      if (findUser) {
        return res.status(400).json({ success: false, message: "E-mail já cadastrado" });
      }

      const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*]).{8,}$/;
      if (!passwordRegex.test(password)) {
        return res.status(400).json({
          success: false,
          message:
            "Sua senha deve ter no mínimo 8 caracteres, uma letra maiúscula, uma letra minúscula, um número e um caractere especial.",
        });
      }

      let data;
      if (req.file) {
        data = await uploadToCloudinary(req.file.path, "profile-pictures");
      }

      const causeToGoalsMap: { [key: string]: string[] } = {
        "Apoio a Pessoas com Deficiência": ["Redução das Desigualdades"],
        "Combate à pobreza": ["Erradicação da Pobreza"],
        "Comunidade LGBTQIA+": ["Redução das Desigualdades"],
        "Defesa dos animais": ["Vida Terrestre"],
        "Direitos das Crianças e Adolescentes": [
          "Paz, Justiça e Instituições Eficazes",
          "Educação de Qualidade",
        ],
        "Direitos dos idosos": ["Redução das Desigualdades", "Saúde e Bem-Estar"],
        Educação: ["Educação de Qualidade"],
        "Igualdade de Gênero": ["Igualdade de Gênero"],
        "Promoção da Cultura": ["Cidades e Comunidades Sustentáveis"],
        "Proteção Ambiental": [
          "Ação Contra a Mudança Global do Clima",
          "Vida na Água",
          "Vida Terrestre",
        ],
        Saúde: ["Saúde e Bem-Estar"],
        "Segurança Alimentar": ["Fome Zero e Agricultura Sustentável"],
      };

      let user: any;
      user = {
        name,
        email,
        password,
        role,
        profilePicture: {
          filePath: data?.url,
          publicId: data?.public_id,
        },
      };

      if (role === "Organização") {
        const developmentGoals = causeToGoalsMap[cause] || [];
        user = new OrganizationModel({
          ...user,
          cause,
          description,
          developmentGoals,
        });
      } else {
        user = new UserModel({ ...user });
      }

      user.password = await bcrypt.hash(password, 10);
      const newUser = await user.save();

      const newAddress = new AddressModel({ cep, city, state, user: newUser.id });
      const savedAddress = await newAddress.save();

      return res.status(201).json({
        success: true,
        message: "Seu cadastro foi finalizado com sucesso!",
        data: newUser,
        address: savedAddress,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  static getUser = async (req: Request, res: Response) => {
    const id = req.params.id;
    const user = await UserModel.findById(id, "-password");

    if (!user) {
      return res.status(400).json({ success: false, message: "Usuário não encontrado" });
    }
    return res.status(200).json({
      success: true,
      data: user,
    });
  };

  static getLoggedUser = async (req: AuthenticatedRequest, res: Response) => {
    const user = req.loggedUser;

    if (!user) {
      return res.status(400).json({ success: false, message: "Usuário não encontrado" });
    }
    return res.status(200).json({
      success: true,
      user,
    });
  };
}

export default UserController;
