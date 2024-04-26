//utilizamos require porque por ahora estamos usando commonjs
import express, { json } from 'express' //require -->commonJS


import { validateMovie, validatePartialMovie } from './src/schemas/movies.js'
import zod from 'zod'

//express tiene una biblioteca nativa , que ademas es parte de la plataforma web
//que  ya te pérmite crear ids unicas
import { randomUUID } from 'node:crypto'
import { error } from 'node:console'
import { moviesRouter } from './src/routes/movies.js'

export const getRandomInt=(max)=> {
    return Math.floor(Math.random() * max);
  }
  
const app=express()

app.disable('x-powered-by')
app.use((req,res,next)=>{
    console.log("app.json: "+app.json)
    next()
})
app.use(json())//con este middleware podemos acceder a los body de los request

console.log("desde app.js"+process.env.API_URL)
/* 
app.get( '/',(req,res)=>{
    let obj={
        message:'Hola mundo'
    }
    res.json(obj)
})
 */

export const ACCEPTED_ORIGINS=[
    'http://localhost:8080',
    'http://localhost:1234',
    'http://localhost:5173',
    'http://moviesdea.com',
    'http://jnsix.com'

]

//Todos los recursos que sean MOVIES  se identifican con /movies
// se tiene una url que identifica a este recurso


//AHORA LO QUE ESTAMOS HACIENDO ES SEPARAR TODAS LAS RUTAS QUE TIENEN QUE VER CON /movies
//entonces lo que hara la aplicacion de express es: cuando se detecte que hay un /movies
//me voy al moviesRouter
app.use('/movies',moviesRouter)

const PORT= process.env.PORT??1234

app.listen(PORT,()=>{
    console.log('servidor escuchando en el puerto  http://localhost:1234')
})