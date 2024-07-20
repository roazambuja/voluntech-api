import { Request, Response } from "express";
import { validationResult } from "express-validator";
import UserModel from "../models/user";
import bcrypt from "bcrypt";
import OrganizationModel from "../models/organization";
import { uploadToCloudinary } from "../services/cloudinary";

const registerUser = async (req: Request, res: Response) => {
  try {
    // const errors = validationResult(req);

    // if (!errors.isEmpty()) {
    //   return res.status(400).json({
    //     success: false,
    //     msg: "Os dados são inválidos!",
    //     errors: errors.array(),
    //   });
    // }

    const { name, email, password, role, description, cause } = req.body;

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
    const userData = await user.save();

    return res.status(201).json({
      success: true,
      message: "Cadastrado com sucesso",
      data: userData,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export { registerUser };
