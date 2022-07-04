import { prisma } from "."

interface AuthouserType
{
    uid:Number
    pid:Number
}
const authorizeUser=async ({uid,pid}:AuthouserType)=>
{
    //console.log("in authorizeUser")
   const postf:any=await prisma.post.findUnique({
        where:{
            id:Number(pid)
        }
    })
   // console.log(postf)
   const {authorId}=postf
   if(authorId===uid)
   {
    // console.log(true)
   return true
   }
   else
   {
   // console.log(false)
   return false
   }
}
export default authorizeUser