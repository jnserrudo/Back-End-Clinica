import { PrismaClient } from "@prisma/client";

const prisma =new PrismaClient()
export class PacienteModel{

    static getAll=async()=>{
         try {
            const pacientes=await prisma.paciente.findMany()
            /* console.log(data)
            const pacientes=await data.json()
            NO ES NECESARIO CONVERTIR A JSON
            */return pacientes
            
         } catch (error) {
            return {
                err:error
            }
         }
    }

    static getPacientebyDni=async(dni)=>{
        try {
    
            dni=+dni
            const paciente=await prisma.paciente.findFirst({
                where:{
                    dni:dni
                }
        }) 
        console.log(paciente)

        return paciente
        } catch (error) {
            return {
                err:error
            }
        }
        
    }

    static updatePaciente=async(dni,pacienteUpdated)=>{
        try {
            const paciente=await prisma.paciente.update({
                where:{
                    dni:+dni
                },
                data:pacienteUpdated
            }) 
            return paciente
        } catch (error) {
            return {
                err:error
            }
        }
        
    }

    static addPaciente=async(dataPaciente)=>{
        try {
            const newPaciente=await prisma.paciente.create({
                data:dataPaciente
            })
            
            return newPaciente

        } catch (error) {
            return {
                err:error
            }
        }
        
    }

}