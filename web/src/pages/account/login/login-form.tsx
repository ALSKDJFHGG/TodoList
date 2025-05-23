import { cn } from "@/utils";
import { toast } from "sonner";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useAuthStore } from "@/storages/auth.ts";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form.tsx";
import { login } from "@/api/user";
import { Lock, UserRound } from "lucide-react";

function LoginForm() {
    const authStore = useAuthStore();
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);

    const formSchema = z.object({
        username: z.string({
            message: "请输入用户名",
        }),
        password: z.string({
            message: "请输入密码"
        })
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {

            username: "",
            password: ""
        }
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log("正在提交登录信息：", values); // 打印用户输入
        setLoading(true);
        login({ ...values })
            .then((res) => {
                console.log("登录接口返回：", res); // 打印接口返回值
                if (res.code === 200) {
                    const avatar_url = `http://localhost:8080${res.data?.avatarUrl}`;
                    authStore.setUser({
                        ...res.data,

                        avatarUrl: avatar_url // 保持与后端字段一致
                    });
                    toast.success("登录成功", {
                        id: "login-success",
                        description: `欢迎回来, ${res.data?.username}`
                    });

                    navigate("/"); // 跳转首页
                }

                if (res.code === 1001){
                    toast.error("非法用户名", {
                        id: "login-error",
                        description: res.msg
                    });
                }

                else if (res.code === 1002) {
                    toast.error("登录失败，用户名或密码错误", {
                        id: "login-error",
                        description: res.msg
                    });
                }

                else if (res.code === 1005) {
                    toast.error("没找到用户,请先注册", {
                        id: "login-error",
                        description: res.msg
                    });
                }
            })
            .catch((err) => {
                console.error("登录请求出错：", err); // 捕获异常
                toast.error("系统错误，请稍后再试");

            })
            .finally(() => {
                setLoading(false);
            });
    }
    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className={cn(
                    "flex",
                    "flex-col",
                    "p-2",
                    "lg:p-4",        // 大屏幕以上增加 padding
                    "h-full"
                )}
            >
                <div className={cn("flex", "flex-col", "gap-6")}>
                    <div
                        className={cn(
                            "flex",
                            "flex-col",
                            "items-center",
                            "text-center",
                            "gap-2"
                        )}
                    >
                        <h1 className={cn("text-2xl", "font-bold")}>欢迎回来</h1>
                        <p className={cn("text-balance", "text-muted-foreground")}>
                            登录你的 Todo-List 账户
                        </p>
                    </div>

                    {/* 用户名输入 */}
                    <FormField
                        control={form.control}
                        name={"username"}
                        render={({ field }) => (
                            <FormItem className={cn("flex", "flex-col", "gap-3")}>
                                <FormLabel className={cn("font-semibold")}>用户名</FormLabel>
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

                    {/* 密码输入 */}
                    <FormField
                        control={form.control}
                        name={"password"}
                        render={({ field }) => (
                            <FormItem className={cn("flex", "flex-col", "gap-3")}>
                                <FormLabel className={cn("font-semibold")}>密码</FormLabel>
                                <FormControl>
                                    <Input
                                        icon={Lock}
                                        placeholder={"password"}
                                        type={"password"}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* 登录按钮 */}
                    <Button
                        type="submit"
                        className={cn(
                            "w-full",              // 按钮宽度占满
                            "bg-green-600",        // 按钮背景色
                            "text-white",
                            "text-lg",
                            "hover:bg-green-700",  // hover 变深
                            "focus:ring-2",        // 聚焦时有外圈
                            "focus:ring-green-500",
                            "focus:ring-offset-2"  // 聚焦时与背景隔开
                        )}
                        size={"lg"}
                        loading={loading}
                        variant={"solid"}
                        level={"success"}
                    >
                        登录
                    </Button>
                </div>
            </form>
        </Form>
    );
}
export { LoginForm };