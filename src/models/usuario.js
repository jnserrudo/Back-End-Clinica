import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { sendPasswordResetEmail } from "../../procesoEmail.js";

const prisma = new PrismaClient();
export class UsuarioModel {
  static getAll = async () => {
    try {
      console.log("model usuario");
      const usuarios = await prisma.usuario.findMany({
        where: {
          habilitado: 1,
        },
      });
      console.log("resultado de usuario en el modelo: ", usuarios);
      /* console.log(data)
        const usuarios=await data.json()
        NO ES NECESARIO CONVERTIR A JSON
         */ return usuarios;
    } catch (error) {
      return {
        err: error,
      };
    }
  };

  static getUsuariobyId = async (id) => {
    try {
      id = +id;
      const usuario = await prisma.usuario.findFirst({
        where: {
          id: id,
        },
      });
      return usuario;
    } catch (error) {
      return {
        err: error,
      };
    }
  };

  static updateUsuario = async (id, usuarioUpdated) => {
    try {
      const usuario = await prisma.usuario.update({
        where: {
          id: +id,
        },
        data: usuarioUpdated,
      });
      return usuario;
    } catch (error) {
      return {
        err: error,
      };
    }
  };

  // Función para actualizar la contraseña
  static updatePassword = async (id, newPassword) => {
    try {
      // Encriptar la nueva contraseña
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Actualizar el usuario con la nueva contraseña y cambiar el estado de blanqueado
      const usuario = await prisma.usuario.update({
        where: {
          id: +id,
        },
        data: {
          password: hashedPassword,
          blanqueado: 1,
        },
      });

      return usuario;
    } catch (error) {
      return {
        err: error.message,
      };
    }
  };

  static blanquearUsuario = async (email) => {
    try {
      // Iniciar una transacción
      const result = await prisma.$transaction(async (prisma) => {
        // Generar una nueva contraseña temporal
        const nuevaContrasena = crypto.randomBytes(3).toString("hex"); // Genera una contraseña corta

        console.log("Nueva contraseña temporal: ", nuevaContrasena);

        // Encriptar la nueva contraseña
        const salt = await bcrypt.genSalt(10);
        const hashContrasena = await bcrypt.hash(nuevaContrasena, salt);

        const usuario = await prisma.usuario.findFirst({
          where: { email: email.trim() },
        });
        if (!usuario) {
          throw new Error("Error al enviar el correo");
        }

        const usuarioActualizado = await prisma.usuario.update({
          where: { id: usuario.id },
          data: { password: hashContrasena, blanqueado: 0 },
        });
        // Actualizar el usuario con la nueva contraseña y establecer 'blanqueado' a 1

        if (usuarioActualizado) {
          // Enviar el correo con la nueva contraseña
          const emailResponse = await sendPasswordResetEmail(
            usuarioActualizado.email,
            nuevaContrasena
          );
          console.log(
            "emailResponse,emailResponse.statusCode: ",
            emailResponse,
            emailResponse.statusCode
          );
          // Verificar si el envío del correo fue exitoso
          if (emailResponse.err) {
            throw new Error("Error al enviar el correo");
          }
        }

        return usuarioActualizado;
      }, {
        timeout: 10000, // aumentar el tiempo de espera a 10 segundos
      } );

      return result;
    } catch (error) {
      console.log("Catch del error: ", error.message);
      return { err: error.message };
    }
  };

  static getJwtToken = async (usuario, password) => {
    try {
      let usuarioValidated = await this.validateUsuario(usuario, password);
      console.log("usuarioValidated: ", usuarioValidated, usuarioValidated.id);
      if (usuarioValidated?.id > 0) {
        //usuario validado, devolver token
        let token = jwt.sign({ usuario }, "ozuna", {
          expiresIn: "30m",
        });

        let values = {
          token,
          id: usuarioValidated.id,
          blanqueado: usuarioValidated.blanqueado,
        };
        console.log("values: ", values);

        return values;
      } else {
        //usuario no validado
        console.log("Usuario no valido");
        return {
          err: "Usuario no valido",
        };
      }
    } catch (error) {
      return {
        err: error,
      };
    }
  };

  static validateUsuario = async (usuario, password) => {
    console.log("validate usuario: ", usuario, password);

    try {
      const result = await prisma.usuario.findFirst({
        where: {
          usuario: usuario,
        },
      });

      if (!result) {
        return false; // Usuario no encontrado
      }

      // Si el usuario está blanqueado (contraseña no encriptada)
      if (result.blanqueado === 0 ) {
        // Comparar la contraseña directamente, ya que no está encriptada
        if (password === result.password ||await bcrypt.compare(password, result.password)) {
          return {
            id: result.id,
            blanqueado: result.blanqueado,
          };
        }
      } else {
        // Si el usuario no está blanqueado, comparar con la contraseña encriptada
        if (   password === result.password ||await bcrypt.compare(password, result.password)) {
          return {
            id: result.id,
            blanqueado: result.blanqueado,
          };
        }
      }

      // Si no se cumple ninguna de las condiciones, devolver false
      return false;
    } catch (error) {
      return {
        err: error,
      };
    }
  };
}
