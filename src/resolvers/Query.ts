import {prisma} from '../index'
import jwt from "jsonwebtoken"
export const Query=
    {
        posts:async(parent:any,args:any,context:any)=>{
           const posts1=await prisma.post.findMany()   
          // console.log(posts1)        
           return posts1
        },
        me:async(parent:any,args:any,context:any)=>
        {
            const token=context.headers.authorization
            console.log(token)
            let uid
            try
            {
                const verify=jwt.verify(token,"kjnbjbnhjb")         
                 uid=Number(verify)   
                console.log("in try"+uid)
            }
            catch(error)
            {
                console.log("in catch")
                return null
            }
            console.log("at begin")
            const userd=await prisma.user.findUnique({
                where:{
                    id:uid
                }
            })
            console.log("at end")
            return userd
        }
    }