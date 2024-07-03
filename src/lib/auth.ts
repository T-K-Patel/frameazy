import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcrypt";
import Google from "next-auth/providers/google";
import {PrismaClient} from "@prisma/client";

const db:PrismaClient=new PrismaClient();
export const authOptions={
    providers:[
        CredentialsProvider({
            name:'Credentials',
            credentials:{
                email:{label:"Email",type:"text",placeholder:"sample@mail.com",required:true},
                password:{label:"Password",type:"password",required:true}
            },
            async authorize(credentials:Record<"email"|"password",string>|undefined):Promise<any>{
                if(!credentials?.password)return null;
                const hashedPassword=await bcrypt.hash(credentials.password,10);
                const existingUser=await db.user.findUnique({
                    where:{
                        email:credentials.email
                    }
                });

                if(existingUser?.auth_type==="Credentials"&&existingUser){
                    //@ts-ignore
                    const passwordValidation=await bcrypt.compare(credentials.password,existingUser.password);
                    if (passwordValidation) {
                        return {
                            id: existingUser.id.toString(),
                            name: existingUser.name,
                            email: existingUser.email
                        }
                    }
                    return null;
                }
                try {
                    const user = await db.user.create({
                        data: {
                            email: credentials.email,
                            password: hashedPassword,
                            auth_type:"Credentials"
                        }
                    });
                
                    return {
                        id: user.id.toString(),
                        name: user.name,
                        email: user.email
                    }
                } catch(e) {
                    console.error(e);
                }
            }
        }),
        Google({
            clientId:process.env.GOOGLE_CLIENT_ID || "",
            clientSecret:process.env.GOOGLE_CLIENT_SECRET||""
        })
    ],
    secret:process.env.NEXTAUTH_SECRET||"secret",
    pages:{
        signIn:"/login",
        signUp:"/signup"
    }
}