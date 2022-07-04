import {prisma} from '../index'
export const Query=
    {
        posts:async(parent:any,args:any,context:any)=>{
           const posts1=await prisma.post.findMany()
           return posts1
        }
    }