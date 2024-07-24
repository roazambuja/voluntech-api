import { Request, Response } from "express";
import UserModel from "../models/user";
import bcrypt from "bcrypt";
import OrganizationModel from "../models/organization";
import { uploadToCloudinary } from "../services/cloudinary";
import AddressModel from "../models/address";

class UserController {
  static registerUser = async (req: Request, res: Response) => {
    try {
      const { name, email, password, role, description, cause, cep, city, state } = req.body;

      let findUser = await UserModel.findOne({ email });
      if (findUser) {
        return res.status(400).json({ success: false, message: "E-mail já cadastrado" });
      }

      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(password)) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Sua senha deve ter no mínimo 8 caracteres, uma letra maiúscula, uma letra minúscula, um número e um caractere especial.",
          });
      }

      let data;
      if (req.file) {
        data = await uploadToCloudinary(req.file.path, "profile-pictures");
      }

      let user: any;
      if (role === "Organização") {
        user = new OrganizationModel({
          name,
          email,
          password,
          role,
          description,
          cause,
          profilePicture: {
            filePath: data?.url,
            publicId: data?.public_id,
          },
        });
      } else {
        user = new UserModel({
          name,
          email,
          password,
          role,
          profilePicture: {
            filePath: data?.url,
            publicId: data?.public_id,
          },
        });
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
}

export default UserController;
