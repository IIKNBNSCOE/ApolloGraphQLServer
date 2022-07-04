import { Post } from '@prisma/client'
import {prisma} from '../index'
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken"
import authorizeUser from '../AuthorizeUser'

interface postargs{
    title:string
    content:string    
}

interface postupdateargs{
   input:{
    postid?:number
    title?:string
    content?:string
   }
}

interface postdeleteargs
{
    id:number
}
interface signupargs
{
    input:{
        email:string
        name:string
        password:string
        bio:string
    }
}
interface signinargs
{
    input:{
        email:string
        password:string

    }
}
export const Mutation=
    {
        postCreate:async(parent:any,{title,content}:postargs,context:any)=>{
            const token=context.headers.authorization
            let uid
            try
            {
                const verify=jwt.verify(token,"kjnbjbnhjb")         
                 uid=Number(verify)   
            }
            catch(error)
            {
                return {
                    message:"Login with your credentials",
                    post:null
                 }
            }
           
            if(!title || !content)
            return {
               message:"Title and Content can not be empty",
               post:null
            }

            const post=await prisma.post.create({
               data:{
                   title,
                   content,
                   authorId:uid
               }
           })
           return {
               message:"Post Created Successfully..",
               post
           }
        },
        postUpdate:async(parent:any,{input}:postupdateargs,context:any)=>
        {
           
            const {content,title,postid}=input
            /*Authentication*/
            const token=context.headers.authorization
            let uid
            try
            {
                const verify=jwt.verify(token,"kjnbjbnhjb")         
                 uid=Number(verify)   
            }
            catch(error)
            {
                return {
                    message:"Login with your credentials",
                    post:null
                 }
            }


            if(!title && !content)
            {
                return{
                    message:"Need to have fields to update",
                    post:null
                }
            }
            
            const postdata={
                title,
                content
            }
           
            if(!title)
            {
                delete postdata.title
            }
            if(!content)
            {
                delete postdata.content
            }
            const pid=Number(postid)
            
           const exist=await prisma.post.findUnique({
               where:
               {
                   id:pid
               }
           })
           if(!exist)
           return {
               message:`Post does not exists with postid ${pid}`,
               post:null
           }
             /*Authorization*/
             const bval=await authorizeUser({uid,pid})
            // console.log(bval)
             if(!bval)
             {
             return{
                message:"You are not authorized to update the post...",
                post:null
            }
        }
           const post=await prisma.post.update({
            where:{
                id:pid
            },
              data:{
                  ...postdata
              }
              
          })
          return{
             message:"Record Updated",
             post
         }
        },
        postDelete:async(parent:any,args:postdeleteargs,context:any)=>
        {
             /*Authentication*/
             const token=context.headers.authorization
             let uid
             try
             {
                 const verify=jwt.verify(token,"kjnbjbnhjb")         
                  uid=Number(verify)   
             }
             catch(error)
             {
                 return {
                     message:"Login with your credentials",
                     post:null
                  }
             }

            const exist=await prisma.post.findUnique({
                where:
                {
                    id:Number(args.id)
                }
            })
            if(!exist)
            return {
                message:`Post does not exists with postid ${args.id}`,
                post:null
            }
          /*Authorization*/
          const pid=args.id
            const bval=await authorizeUser({uid,pid})
              // console.log(bval)
             if(!bval)
               {
               return{
                  message:"You are not authorized to update the post...",
                  post:null
              }
          }
            const post=prisma.post.delete({
                where:{
                    id:Number(args.id)
                }
            })
            console.log(post)
            return{
                message:"Record deleted",
                post
            }
            
        },
        signUp:async (parent:any,{input}:signupargs,context:any)=>
        {
            const {email,name,password,bio}=input
            //validating email
            if(!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)))
            return {
                message:"Invalid email",
                token:""
            }
           //Input Password and Submit [6 to 15 characters which contain at least one numeric digit, one uppercase and one lowercase letter]
            if(!(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,15}$/.test(password)))
            return {
                message:"Invalid password... Password must be 6 to 15 characters long  which contain at least one numeric digit, one uppercase and one lowercase letter",
                token:""
            }

            const existuser=await prisma.user.findUnique({
                where:{
                    email
                }
            })
            //console.log(existuser)

            if(existuser)
            {
                return{
                    message:"User with same email already exists.. Use different one",
                    token:""
                }
            }

            const hashpassword=await bcrypt.hash(password,10)
            const user=await prisma.user.create({
                data:{
                    email,
                    name,
                    password:hashpassword
                }
            })

            const profile=await prisma.profile.create({
                data:{
                    bio,
                    userId:user.id
                }
            })
            //console.log(profile)
            
            const tokenn=jwt.sign(user.id.toString(),"kjnbjbnhjb")
            return {
                message:"User is registered successfully..",
                token:tokenn
            }
        },
        signIn:async(parent:any,{input}:signinargs,context:any)=>{
            const {email,password}=input
            const userexists=await prisma.user.findUnique({
                where:{
                    email
                }
            })
            if(!userexists)
            {
                return {
                    message:"Invalid email/password",
                    token:null
                }
            }
            const verify=bcrypt.compare(password,userexists.password)
            if(!verify)
            {
                return {
                    message:"Invalid email/password",
                    token:null
                }

            }
            const tokenn=jwt.sign(userexists.id.toString(),"kjnbjbnhjb")
            return {
                message:"User authenticated",
                token:tokenn
            }
        }

    }