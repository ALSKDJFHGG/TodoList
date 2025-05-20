import { cn } from "@/utils";

import {toast} from "sonner";
import { Input } from "@/components/ui/input.tsx";

import { Button } from "@/components/ui/button.tsx";
import { useAuthStore } from "@/storages/auth.ts";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx";
import { login } from "@/api/user";
import { Lock, UserRound } from "lucide-react";

function LoginForm(){
    const authStore =useAuthStore()
    const navigate =useNavigate()
    const [loading,setLoading] = useState<boolean>(false)
    const formSchema =z.object({
        username:z.string({
            message:"请输入用户名",
        }),
        password:z.string({
            message:"请输入密码"
        })
    })
    const form = useForm<z.infer<typeof formSchema> >({
        resolver:zodResolver(formSchema),
        defaultValues:{
            username:undefined,
            password:undefined
        }
    })

    function  onSubmit(values:z.infer<typeof formSchema>){
        setLoading(true)
        login({
            ...values
        })
            .then((res)=>{
            if(res.code===200){
                const avatar_url = `http://localhost:8080${res.data?.avatarUrl}`;
                authStore.setUser({
                    ...res.data,
                    avatarUrl:avatar_url  /*要和后端的avatarUrl取同一个名字*/
                })
                console.log(res.data)
            toast.success("登录成功",{
                id:"login-success",
                description:`欢迎回来,${res.data?.username}`
                })
                navigate("/")
            }
            if (res.code===1002){
                toast.error(
                    `登录失败,用户名或密码错误`,{
                        id:"login-error",
                        description:res.msg
                    }
                )
            }
        })
            .finally(()=>{
                setLoading(false)
            })
    }
    return(
        <Form {...form}>
            {/* 左边的登录框 */}
        <form
            className={cn(["flex","flex-col","p-2","md:p-4","h-full"])}
            onSubmit={form.handleSubmit(onSubmit)}
        >
            <div className="flex flex-col gap-6">
                <div className={cn("flex","flex-col","items-center","text-center","gap-2")}>
                    <h1 className="text-2xl font-bold">欢迎回来</h1>
                    <p className="text-balance text-muted-foreground">登录你的 Todo-List 账户</p>
                </div>
                <FormField
                control={form.control}
                name={'username'}
                render={({field }) => (
                    <FormItem className={cn(["flex","flex-col","gap-3"])}>
                        <FormLabel className={cn(["font-semibold"])}>用户名</FormLabel>
                        <FormControl>
                            <Input
                                icon={UserRound}
                                placeholder={"Login Name"}
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                    control={form.control}
                    name={"password"}
                    render={({field})=>(
                        <FormItem className={cn(["flex","flex-col","gap-3"])} >
                            <FormLabel className={cn(["font-semibold"])}>密码</FormLabel>
                            <FormControl>
                                <Input
                                placeholder={"password"}
                                icon={Lock}
                                type={"password"}
                                {...field}
                                ></Input>
                            </FormControl>
                        </FormItem>
                    )}
                ></FormField>
                <Button
                    type="submit"
                    className={cn(["w-full",
                        "bg-green-600",
                        "text-white",
                        "text-lg",
                        "hover:bg-green-700",
                        "focus:ring-2"," focus:ring-green-500 ","focus:ring-offset-2"
                    ])}
                    size={"lg"}
                    loading={loading}
                    variant={"solid"}
                    level={"success"}>
                    登录
                </Button>


            </div>
        </form>
        </Form>
    )
}
export {LoginForm}