import {ApolloServer,gql} from "apollo-server"
import {typeDefs} from "./Schema"
import {Query,Mutation} from './resolvers'
import {PrismaClient} from '@prisma/client'
import {Post} from './resolvers/Post'

const resolvers={Query,Mutation,Post}
export const prisma=new PrismaClient()

const server=new ApolloServer({
    typeDefs,resolvers,context: (ctx) => ({
        headers: ctx.req.headers })
})

server.listen().then(({url})=>{
console.log("server staeted at "+url)
})