import { prisma } from ".."
interface User{
    id:number
    title:string
    content:string
    published:boolean
    createdAt:string
    updatedAt:string
    authorId:number
}

export const Post={
    user:(parent:User,args:any,context:any)=>
    {
       const userdata=prisma.user.findUnique({
            where:{
                id:parent.authorId
            }
        })
        return userdata
    }
}