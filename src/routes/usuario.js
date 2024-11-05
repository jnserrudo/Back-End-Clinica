import express from "express";
import { UsuarioController } from "../controllers/usuario.js";

export const usuarioRouter=express.Router()

usuarioRouter.get('/', UsuarioController.getAll)



usuarioRouter.get('/:id', UsuarioController.getUsuariobyId)

usuarioRouter.put('/:id', UsuarioController.updateUsuario)


usuarioRouter.put('/blanquear/:email', UsuarioController.blanquearUsuario)


usuarioRouter.put('/password/:id', UsuarioController.updatePassword)

usuarioRouter.post('/jwtToken',UsuarioController.getJwtToken)

