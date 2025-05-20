import { Avatar} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"


import React, { useRef, useState } from "react";
import { useAuthStore } from "@/storages/auth.ts";
import { cn } from "@/utils";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx";

import { useSharedStore } from "@/storages/shared.ts";
import { Input } from "@/components/ui/input.tsx";
import { updateUser, uploadAvatar } from "@/api/user";
import { toast } from "sonner";
import { User } from "@/models/user.ts";
import { Link } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea.tsx";
import { Lock, UserRound } from "lucide-react";


function MyProfile() {
    const authStore =useAuthStore()
    const [loading, setLoading] = useState<boolean>(false);
    const sharedStore = useSharedStore();
    const username = useAuthStore((state)=>state.user?.username)
    const userId = useAuthStore((state)=>state.user?.id)
    const formSchema = z.object({
        username: z.string().optional(),
        password: z.string().optional(),
    });
    const form = useForm<z.infer<typeof formSchema>>({
        resolver:zodResolver(formSchema),
        defaultValues: {
            username: authStore.user?.username ?? undefined,
            password: undefined,
        }

    })
    function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true);
        console.log("onSubmit")//
        console.log(userId)//
        if (!userId) {
            toast.error("userId 缺失");
            return
        }
        updateUser({id:userId,username:values.username,password:values.password})
            .then((res)=>{
            if (res.code === 200){
                console.log(res.data)//
                toast.success(`用户更新成功`)
                authStore.setUser(res.data as User)
                sharedStore.setRefresh()
            }else {
                toast.error("用户更新失败")
            }
        })
            .finally(()=>setLoading(false))
    }


    const fileInputRef = useRef<HTMLInputElement | null>(null)
    const handleClick = () => {
        fileInputRef.current?.click()
    }
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            const res = await uploadAvatar(file);
            console.log("头像地址", authStore.user?.avatarUrl);
            if (res.code === 200) {
                toast.success("上传成功");
                authStore.setUser({
                    ...authStore.user!,
                    avatarUrl: `http://localhost:8080${res.data}`, // 这是图片 URL
                });
                sharedStore.setRefresh();
            } else {
                toast.error("上传失败", {
                    description: res.msg,
                });
            }
        } catch (err) {
            toast.error("上传失败", {
                description: "网络或服务器错误",
            });
        }
    }


    return(
        <div className={cn("flex","flex-col","lg:flex-row ","gap-5","2xl:mx-60","lg:mx-40 ","mx-10","mt-16 ")}>
            {/*
        flex-col md:flex-row
        中等及大屏幕：横向布局。
        小屏幕：头像会居中显示，信息会排成纵向排列。
        mx-60( margin-x轴 左右 )
        mx-auto (auto 代表 自动计算外边距，它会使左右的外边距相等，从而实现居中效果)
      */}
            <aside className={cn("lg:sticky"," lg:top-20 ","flex flex-col","pt-20 ","w-full","h-fit","md:basis-1/3","lg:gap-3")}>
                {/*
        lg:top-20 是关键，保证往下拉，左侧始终与顶栏差20
        md:mr-5 md:w-75
        当达到中等屏幕以上，侧边栏宽度为父元素的1/4右间距为5 ，
        在小屏幕下默认100%取消右间距
        sticky是对的！
        h-fit 是对的！
      */}
                <div className={cn(["flex","flex-row"," lg:flex-col","mb-3","lg:mb-0","mx-3","lg:mx-0","lg:gap-5"])}>
                    <div className={cn(["flex","justify-center"])}>{/*justify-center*/}
                        <Avatar src={authStore.user?.avatarUrl!} fallback={"CN"}
                                className={cn(["w-[20vw]","h-[20vw]","lg:w-75","lg:h-75","overflow-cover"])}
                        />
                    </div>
                    <div className={cn(["flex","flex-col","items-center","justify-center","pl-5","lg:pl-0","lg:gap-2"])}> {/* items-center不能删*/}
                        <div className={cn(["lg:text-2xl", "text-[32px]", "font-medium"," w-75"])}>{username}</div>
                        <div className={cn(["lg:text-[20px]","text-[25px]","font-sans","text-[#59636e]","w-75","italic"])}>个人设置</div>
                    </div>
                </div>
                <div className={cn([
                    "flex","mt-3","px-20",
                    "justify-center","flex-col","items-center",
                    "gap-5"
                ])}> {/*justify-center*/}
                    <input
                        type="file"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                        style={{ display: "none" }} /* 隐藏原生文件选择框 */
                    />

                    <Button onClick={handleClick} variant={"outline"} className={cn(["lg:w-75 w-full","text-base"])}>
                        编辑用户头像
                    </Button>

                    <div className={cn(["flex","justify-start","w-full"])}>
                        <Button
                            asChild
                            className={cn([
                                "bg-green-700",
                                "text-white","text-center",
                                "text-base","h-9",
                                "hover:bg-green-600",
                                "focus:ring-2"," focus:ring-green-500 ","focus:ring-offset-2"])}
                            variant={"solid"}
                        >
                            <Link to={"/"}>返回主页</Link>
                        </Button>
                    </div>
                </div>
            </aside>


            <Card className={cn(["m-3","flex-1","p-6","md:basis-2/3"])}>
                <CardHeader>
                    <CardTitle className={cn(["text-[32px] "])}>Public profile</CardTitle>
                    <hr className={cn(["my-1"," border-gray-300"])}/>
                </CardHeader>
                <CardContent>
                    <div className="mb-3">
                        <Label htmlFor="name" className={cn(["text-[20px]"])}>{username}</Label>



                    </div>
                    {/*<Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className={cn(["flex","flex-col"])}>
                                <Label htmlFor="descrip" className={"text-[20px]"}>Introduce</Label>
                                <hr className={cn(["my-1 border-gray-300"])}/>
                                <Textarea placeholder="Introduce youself here"
                                          className={
                                              cn(["mt-2 mb-2 h-100"," bg-gray-200 border"," border-gray-300" ,
                                              "focus-visible:ring-2"," focus-visible:ring-gray-200/25"])
                                          }/>
                                <div className={cn(["flex"," justify-end"])}>
                                    <Button type="submit"> SAVE</Button>
                                </div>
                            </div>

                        </form>
                    </Form>*/}
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className={cn(["space-y-4","flex","gap-3","flex-col"])}>
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>用户名</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                icon={UserRound}
                                                placeholder="请输入新用户名"
                                                className={cn(["flex","justify-start","w-3/4"])}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>新密码</FormLabel>
                                        <FormControl>
                                            <Input
                                                icon={Lock}
                                                type="password"
                                                {...field}
                                                placeholder="请输入新密码"
                                                className={cn([
                                                    "flex","justify-start","w-3/4",
                                                ])}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className={cn(["flex","flex-col"])}>
                                <Label htmlFor="descrip" className={"text-[20px]"}>简介</Label>
                                <hr className={cn(["my-1 border-gray-300"])}/>
                                <Textarea placeholder="介绍自己"
                                          className={
                                              cn(["mt-2 mb-2 h-100"," bg-gray-200","border"," border-gray-300" ,
                                                  "focus-visible:ring-2"," focus-visible:ring-gray-200/25"])
                                          }/>
                            </div>
                            <Button
                                type="submit"
                                loading={loading}
                                className={cn([
                                    "w-24",
                                    "bg-green-700",
                                    "text-white","text-center",
                                    "text-base","h-9",
                                    "hover:bg-green-600",
                                    "focus:ring-2"," focus:ring-green-500 ","focus:ring-offset-2"
                                ])}
                                variant={"solid"}
                            >

                                更新用户
                            </Button>
                        </form>
                    </Form>

                </CardContent>
            </Card>


        </div>
    )
}

export  default MyProfile
