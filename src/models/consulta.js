import { PrismaClient } from "@prisma/client";

const prisma =new PrismaClient()

export class ConsultaModel{
    static getAll=async()=>{
        try {
            
            const consultas=await prisma.consulta.findMany()
            console.log(consultas)
            return consultas??null
        } catch (error) {
            return {
                err:error
            }
        }
    }

    static getConsultaByDni=async(dni)=>{
        try {

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
        } catch (error) {
            return {
                err:error
            }
        }
    }

    static getConsultaById=async(id)=>{
        try {
            
            id=+id
            const consulta=await prisma.consulta.findFirst({
                where:{
                    id:id
                }
            }) 
            return consulta
        } catch (error) {
            return {
                err:error
            }
        }
    }

    static updateConsulta=async(id,consultaUpdated)=>{

        try {
            const consulta=await prisma.consulta.update({
                where:{
                    id:+id
                },
                data:consultaUpdated
            }) 
            return consulta
            
        } catch (error) {
            return {
                err:error
            }
        }
    }

    
    static addConsulta=async(dataConsulta)=>{
        try {
            
            console.log(dataConsulta)
            const newConsulta=await prisma.consulta.create({
                data:dataConsulta
            })
            
            return newConsulta
        } catch (error) {
            return {
                err:error
            }
        }       
    }
}