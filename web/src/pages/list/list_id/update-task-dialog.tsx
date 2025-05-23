import { useSharedStore } from "@/storages/shared.ts";
import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getTask, updateTask } from "@/api/task";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover.tsx";
import { Button } from "@/components/ui/button.tsx";
import { cn } from "@/utils";
import { CalendarIcon, SaveIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar.tsx";
import { zhCN } from "date-fns/locale";

function UpdateTaskDialog({ taskId, onSuccess, onClose }: { taskId: number; onSuccess?: () => void; onClose: () => void }) {
    const sharedStore = useSharedStore();
    const [loading, setLoading] = useState<boolean>(false);
    const [task, setTask] = useState<any>(null); //  当前任务数据

    const formSchema = z.object({
        name: z.string({ message: "请编辑任务名称" }),
        description: z.string({ message: "请编辑任务描述" }).optional(),
        deadline: z.date({ message: "请编辑任务截止时间" }).optional(),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name:"",
            description:"",
            deadline: undefined,
        },
    });

    // 🚀 教学点：获取任务详情
    useEffect(() => {
        if (!taskId) return;

        setLoading(true);
        getTask(taskId)
            .then((res) => {
                console.log("接口返回任务：", res); // ✅ 调试：接口返回的数据
                if (res.code === 200 && res.data) {
                    const taskData = res.data;
                    setTask(taskData);

                    form.reset({
                        name: taskData.name || "",
                        description: taskData.description || "",
                        deadline: taskData.deadline ? new Date(taskData.deadline * 1000) : new Date(),
                    });
                } else {
                    toast.error("获取任务失败");
                }
            })
            .catch((err) => {
                console.error("获取任务接口异常", err);
            })
            .finally(() => setLoading(false));
    }, [taskId, form]);

    function onSubmit(values: z.infer<typeof formSchema>) {
        if (!task) return;

        console.log("提交的任务内容:", values); // ✅ 调试：打印提交值

        setLoading(true);

        updateTask({
            id: taskId,
            name: values.name,
            description: values.description,
            deadline: values.deadline
                ? Math.floor(values.deadline.getTime() / 1000)
                : Math.floor(Date.now() / 1000),
            status: task.status,
            category: task.category,
        })
            .then((res) => {
                console.log("更新接口返回:", values); // ✅ 调试：接口返回内容

                if (res.code === 200) {
                    toast.success(`任务${values.name}更新成功`);
                    sharedStore.setRefresh(); // 🚨 注意：是否触发了刷新？
                    onSuccess?.();
                    onClose(); // 成功后关闭弹窗
                }
                else if (res.code==2001) {
                    toast.error("非法时间",{
                        id:"update-list-time-error",
                        description:res.msg
                    });
                }
                else if (res.code==2003) {
                    toast.error("不是将来时",{
                        id:"update-list-time-error",
                        description:res.msg
                    });
                }
            })
            .catch((err) => {
                console.error("更新任务失败", err);
                toast.error("更新异常，请检查接口或输入");
            })
            .finally(() => setLoading(false));
    }

    return (
        <div className={cn(["p-2", "space-y-4"])}>
            <h2 className={cn(["text-lg font-semibold"])}>编辑任务</h2>

            {task ? (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        {/* 名称 */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>任务名称</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="请输入任务名称" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* 描述 */}
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>任务描述</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="请输入任务描述" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* 截止时间 */}
                        <FormField
                            control={form.control}
                            name="deadline"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>截止时间</FormLabel>
                                    <Popover>
                                        <PopoverTrigger className="flex">
                                            <Button
                                                variant="outline"
                                                className={cn("justify-center","w-1/2","text-left font-normal", !field.value && "text-muted-foreground")}
                                            >
                                                <CalendarIcon className={cn(["mr-2 h-4 w-4"])} />
                                                {field.value ? format(field.value, "yyyy-MM-dd") : "选择日期"}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent align="start" className={cn(["w-auto p-0"])}>
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                locale={zhCN}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            icon={SaveIcon}
                            loading={loading}
                            className={cn(["w-full"])}
                        >
                            保存修改
                        </Button>
                    </form>
                </Form>
            ) : (
                <div>加载任务数据...</div>
            )}
        </div>
    );
}
export { UpdateTaskDialog };
