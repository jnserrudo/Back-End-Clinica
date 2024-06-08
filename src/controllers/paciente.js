import { PacienteModel } from "../models/paciente.js"

export class PacienteController{
    static getAll=async(req,res)=>{

        const pacientes=await PacienteModel.getAll()
        if(!pacientes?.err){
            res.json(pacientes)
        }else{
            res.json({message:"Paciente no encontrado"}).status(404)
        }
    }

    static getPacientebyDni=async(req,res)=>{
        let dni=req.params.dni
        const paciente=await PacienteModel.getPacientebyDni(dni)
        if(!paciente?.error){
            res.json(paciente)
        }else{
            res.json({message:"Paciente no encontrado"}).status(404)
        }
    }

    static updatePaciente=async(req,res)=>{
        let dni=req.params.dni
        const paciente=await PacienteModel.updatePaciente(dni,req.body)
        if(!paciente?.error){
            res.json(paciente)
        }else{
            res.json({message:"Paciente no encontrado"}).status(404)
        }
    }

    static addPaciente=async(req,res)=>{
        const newPaciente=await PacienteModel.addPaciente(req.body)
        if(!newPaciente?.error){
            res.json(newPaciente)
        }else{
            res.json({message:"El Paciente no se pudo agregar"}).status(404)

        }
    }
}