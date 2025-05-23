import {Avatar} from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Label} from "@/components/ui/label";

import React, {useRef, useState} from "react";
import {useAuthStore} from "@/storages/auth.ts";
import {cn} from "@/utils";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form.tsx";

import {useSharedStore} from "@/storages/shared.ts";
import {Input} from "@/components/ui/input.tsx";
import {updateUser, uploadAvatar} from "@/api/user";
import {toast} from "sonner";
import {Link} from "react-router-dom";
import {Textarea} from "@/components/ui/textarea.tsx";
import {Lock, UserRound} from "lucide-react";

function MyProfile() {
    const authStore = useAuthStore();
    const sharedStore = useSharedStore();
    const username = useAuthStore((state) => state.user?.username);
    const userId = useAuthStore((state) => state.user?.id);

    const [loading, setLoading] = useState<boolean>(false);

    const formSchema = z.object({
        username: z.string().optional(),
        password: z.string().optional(),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true);
        if (!userId) {
            toast.error("userId 缺失");
            return;
        }
        updateUser({id: userId, username: values.username, password: values.password})
            .then((res) => {
                if (res.code === 200) {
                    toast.success("用户更新成功");
                    const updatedUser = {
                        ...authStore.user!,
                        username: values.username ?? authStore.user!.username,
                    };
                    authStore.setUser(updatedUser);
                    sharedStore.setRefresh();
                } else {
                    toast.error("用户更新失败");
                }
            })
            .finally(() => setLoading(false));
    }

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const handleClick = () => fileInputRef.current?.click();

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            const res = await uploadAvatar(file);
            if (res.code === 200) {
                toast.success("上传成功");
                authStore.setUser({
                    ...authStore.user!,
                    avatarUrl: `http://localhost:8080${res.data}`,
                });
                sharedStore.setRefresh();
            } else if (res.code === 1006) {
                toast.error("文件为空", {
                    id: "update-error",
                    description: res.msg
                });
            } else if (res.code === 1007) {
                toast.error("非法文件类型", {
                    id: "update-error",
                    description: res.msg
                });
            } else {
                toast.error("上传失败", {
                    id: "update-error",
                    description: res.msg
                });
            }
        } catch (err) {
            toast.error("上传失败", {
                id: "update-error",
                description: "网络或服务器错误"
            });
        }
    };

    return (
        <div
            className={cn(
                "flex",
                "flex-col",
                "lg:flex-row",
                "gap-5",
                "2xl:mx-60",
                "lg:mx-40",
                "mx-10",
                "mt-16"
            )}
        >
            {/* Side Content */}
            <aside
                className={cn(
                    "lg:sticky",         // 在大屏幕固定在视口顶部位置
                    "lg:top-20",         // 离顶部距离 20（配合 sticky）
                    "flex", "flex-col",   // 垂直布局
                    "pt-20",             // 顶部内边距
                    "w-full",            // 宽度撑满容器
                    "h-fit",             // 高度自适应内容
                    "md:basis-1/3",      // 中等屏幕及以上宽度占比 1/3
                    "lg:gap-3"           // 大屏幕下元素间距为 3
                )}
            >
                <div
                    className={cn(
                        "flex", "flex-row",  // 小屏幕横向排列（头像 + 用户名）
                        "lg:flex-col",       // 大屏幕改为垂直排列
                        "mb-3", "lg:mb-0",   // 小屏幕底部间距，大屏去除
                        "mx-3", "lg:mx-0",   // 小屏左右内边距 3，大屏去除
                        "lg:gap-5"           // 大屏下头像与文本垂直间距
                    )}
                >

                    <div className={cn("flex", "justify-center")}> {/* Center avatar */}
                        <Avatar
                            src={authStore.user?.avatarUrl!}
                            fallback="CN"
                            className={cn(
                                "w-[20vw]", "h-[20vw]",  // 小屏幕宽高为视口宽度的 20%
                                "lg:w-75", "lg:h-75",   // 大屏幕下固定宽高
                                "overflow-cover"  //可能用于控制图片铺满容器
                            )}
                        />

                    </div>
                    <div
                        className={cn(
                            "flex",
                            "flex-col",
                            "items-center",
                            "justify-center",
                            "pl-5",
                            "lg:pl-0",
                            "lg:gap-2"
                        )}
                    >
                        <div className={cn("lg:text-2xl", "text-[32px]", "font-medium", "w-75")}>{username}</div>
                        <div
                            className={cn("lg:text-[20px]", "text-[25px]", "font-sans", "text-[#59636e]", "w-75", "italic")}>
                            个人设置
                        </div>
                    </div>
                </div>

                <div className={cn("flex", "mt-3", "px-20", "justify-center", "flex-col", "items-center", "gap-5")}>
                    <input type="file" onChange={handleFileChange} ref={fileInputRef} style={{display: "none"}}/>

                    <Button onClick={handleClick} variant="outline"
                            className={cn("lg:w-75", "w-full", "text-base")}>编辑用户头像</Button>

                    <div className={cn("flex", "justify-start", "w-full")}> {/* Align left */}
                        <Button
                            asChild
                            className={cn(
                                "bg-green-700",
                                "text-white",
                                "text-center",
                                "text-base",
                                "h-9",
                                "hover:bg-green-600",
                                "focus:ring-2",
                                "focus:ring-green-500",
                                "focus:ring-offset-2"
                            )}
                            variant="solid"
                        >
                            <Link to="/">返回主页</Link>
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <Card className={cn("m-3", "flex-1", "p-6", "md:basis-2/3")}>
                <CardHeader>
                    <CardTitle className={cn("text-[32px]")}>个人设置</CardTitle>
                    <hr className={cn("my-1", "border-gray-300")}/>
                </CardHeader>
                <CardContent>
                    <div className="mb-3">
                        <Label htmlFor="name" className={cn("text-[20px]")}>{username}</Label>
                    </div>

                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className={cn(
                                "space-y-4",  // 表单项垂直间距
                                "flex",  // 使用 Flex 布局
                                "gap-3",  // 内部元素横向间距（如图标等）
                                "flex-col"  // 垂直排列（防止默认横向）
                            )}
                        >
                            <FormField
                                control={form.control}
                                name="username"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>用户名</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                icon={UserRound}
                                                placeholder="请输入新用户名"
                                                className={cn("flex", "justify-start", "w-3/4")}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="password"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>新密码</FormLabel>
                                        <FormControl>
                                            <Input
                                                icon={Lock}
                                                type="password"
                                                {...field}
                                                placeholder="请输入新密码"
                                                className={cn("flex", "justify-start", "w-3/4")}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <div className={cn("flex", "flex-col")}>
                                <Label htmlFor="descrip" className="text-[20px]">简介</Label>
                                <hr className={cn("my-1", "border-gray-300")}/>
                                <Textarea
                                    placeholder="介绍自己"
                                    className={cn(
                                        "mt-2",
                                        "mb-2",
                                        "h-100",
                                        "bg-gray-200",
                                        "border",
                                        "border-gray-300",
                                        "focus-visible:ring-2",
                                        "focus-visible:ring-gray-200/25"
                                    )}
                                />
                            </div>

                            <Button
                                type="submit"
                                loading={loading}
                                className={cn(
                                    "w-24",
                                    "bg-green-700",
                                    "text-white",
                                    "text-center",
                                    "text-base",
                                    "h-9",
                                    "hover:bg-green-600",
                                    "focus:ring-2",
                                    "focus:ring-green-500",
                                    "focus:ring-offset-2"
                                )}
                                variant="solid"
                            >
                                更新用户
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}

export default MyProfile;