import express from "express";
import { pacienteRouter } from "./pacientes.js";
import { consultaRouter } from "./consulta.js";
import { usuarioRouter } from "./usuario.js";


export const router = express.Router();

router.use('/pacientes',pacienteRouter)

router.use('/consultas',consultaRouter)

router.use('/usuarios',usuarioRouter)
