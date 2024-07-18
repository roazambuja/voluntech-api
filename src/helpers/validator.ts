import { check } from "express-validator";

const registerValidator = [
  check("name", "O campo nome é obrigatório").not().isEmpty(),
  check("email", "O campo email deve ser válido").isEmail().normalizeEmail({
    gmail_remove_dots: true,
  }),
  check("password", "O campo senha é obrigatório").not().isEmpty(),
  check("password", "O campo usuário é obrigatório").not().isEmpty(),
];

export default registerValidator;
