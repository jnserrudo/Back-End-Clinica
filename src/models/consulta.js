import { PrismaClient } from "@prisma/client";

const prisma =new PrismaClient()

export class ConsultaModel{
    static getAll=async()=>{
        const consultas=await prisma.consulta.findMany()
        console.log(consultas)
        return consultas??null
    }

    static getConsultaByDni=async(dni)=>{
        dni=+dni
        const consul=await prisma.consulta.findMany({
            where:{
                pacienteDni:dni
            }
        }) 
        //consigo el nombre y apellido 
        const paciente=await prisma.paciente.findFirst({
            where:{
            dni:dni
        }
        })

        const consulta={
            consultas:consul,
            apen:paciente.nombre.toUpperCase() +', '+paciente.apellido.toUpperCase()
        }
        console.log(consul,paciente)
        return consulta
    }

    static getConsultaById=async(id)=>{
        id=+id
        const consulta=await prisma.consulta.findFirst({
            where:{
                id:id
            }
        }) 
        return consulta
    }

    static updateConsulta=async(id,consultaUpdated)=>{
        const consulta=await prisma.consulta.update({
            where:{
                id:+id
            },
            data:consultaUpdated
        }) 
        return consulta
    }

    
    static addConsulta=async(dataConsulta)=>{
        console.log(dataConsulta)

       
        console.log(dataConsulta)
        const newConsulta=await prisma.consulta.create({
            data:dataConsulta
        })
        
        return newConsulta
    }
}