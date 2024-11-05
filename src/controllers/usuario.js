import { UsuarioModel } from "../models/usuario.js";

export class UsuarioController {
  static getAll = async (req, res) => {
    console.log("usuario router");

    const usuarios = await UsuarioModel.getAll();
    console.log("resultado de usuarios del controller: ", usuarios);
    if (!usuarios?.err) {
      res.json(usuarios);
    } else {
      res
        .json({
          message: "No se pudo traer los Usuarios",
          error: usuarios?.err,
        })
        .status(404);
    }
  };
 

  static getUsuariobyId = async (req, res) => {
    let id = req.params.id;
    const usuario = await UsuarioModel.getUsuariobyId(id);
    if (!usuario?.err) {
      res.json(usuario);
    } else {
      res.json({ message: "Usuario no encontrado" }).status(404);
    }
  };

  static updateUsuario = async (req, res) => {
    let id = req.params.id;
    const usuario = await UsuarioModel.updateUsuario(id, req.body);
    console.log(usuario)
    if (!usuario?.err) {
      res.json(usuario);
    } else {
      res.json({ message: "Usuario no encontrado" }).status(404);
    }
  };

  static blanquearUsuario = async (req, res) => {
    let email = req.params.email;
    const usuario = await UsuarioModel.blanquearUsuario(email);
    console.log("CONTROLLER blanquearUsuario: ",usuario)
    if (!usuario?.err) {
      res.json(usuario);
    } else {
      res.json({ err:{message: "Error al blanquear al usuario"} }).status(404);
    }
  };

  static updatePassword = async (req, res) => {
    let id = req.params.id;
    let { newPassword } = req.body; // Obtener la nueva contraseña del cuerpo de la solicitud

    if (!newPassword) {
      return res.status(400).json({ message: "Nueva contraseña es requerida" });
    }

    const usuario = await UsuarioModel.updatePassword(id, newPassword);
    if (!usuario?.err) {
      res.json(usuario);
    } else {
      res.status(404).json({ message: "Usuario no encontrado" });
    }
  };

 

  static getJwtToken = async (req, res) => {
    const { usuario, password } = req.body;
    console.log("controller jwt");
    const jwtToken = await UsuarioModel.getJwtToken(usuario, password);
    if (!jwtToken?.err) {
      console.log("resultado de jwt token:", jwtToken);
      res.json(jwtToken);
    } else {
      res.json({ error: "No se pudo obtener el jwt token" }).status(404);
    }
  };

 

}
