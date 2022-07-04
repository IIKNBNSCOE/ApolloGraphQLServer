import {gql} from "apollo-server"
/*Schema*/
export const typeDefs=gql`
type Query{
   posts:[Post]
   me:User 
}

type ErrorMessage{
    message:String
}
union updatetype= Post | ErrorMessage
type Mutation{
    postCreate(title:String,content:String):PostResponse
    postUpdate(input:postUpdateInput):PostResponse
    postDelete(id:ID!):PostResponse
    signUp(input:signUpInput):SignUpResponse
    signIn(input:signInInput):SignInResponse
}

type User{
    id:ID!
    name:String!
    email:String!
    posts:[Post!]!    
}
type Post{
    id:ID!
    title:String!
    content:String!
    createdAt:String!
    published:Boolean
    user:User!

}
type Profile{
    id:ID!
    bio:String
    user:User!
}
type PostResponse{
    message:String!
    post:Post!
}
type SignUpResponse{
    message:String
    token:String
}
type SignInResponse{
    message:String
    token:String
}
input postUpdateInput{
    postid:ID!
    title:String
    content:String
}
input signUpInput{
    email:String!
    name:String!
    password:String!
    bio:String!
}
input signInInput{
    email:String!
    password:String!

}
`