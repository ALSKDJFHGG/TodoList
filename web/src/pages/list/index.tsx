import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAllTodoLists, fetchByListId } from "@/api/todolist";
import { toast } from "sonner";
import { CreateTask } from "@/pages/list/create-task.tsx";
import { Columns, TaskRow } from "@/pages/list/columns.tsx";
import { createTask, getTask } from "@/api/task";
import { cn } from "@/utils";
import { Input } from "@/components/ui/input.tsx";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem} from "@/components/ui/form.tsx";

export default function ListDetailPage() {
    const { category } = useParams<{ category: string }>();
    const [loading, setLoading] = useState(true);
    const [tasks, setTasks] = useState<TaskRow[]>([]);
    /*
    * 将任务拆分为两个数组(完成:未完成)，并渲染两个 Columns
    * */
    const unfinishedTasks = tasks.filter(task => !task.status);
    const finishedTasks = tasks.filter(task => task.status);


    // 更新任务列表
    const fetchTasks = async () => {
        if (!category) return; // 如果没有 category，不执行后续操作
        setLoading(true); // 开始加载

        try {
            const res = await getAllTodoLists();
            const allLists = res.data || [];
            const matched = allLists.find((list) => list.category === category);
            if (!matched) {
                toast.error("找不到该分类");
                return;
            }
            const res2 = await fetchByListId(matched.id);
            const todoList = res2.data;
            if (!todoList?.tasks || todoList.tasks.length === 0) {
                setTasks([]); // 如果没有任务，清空任务列表
                return;
            }

            const taskList = await Promise.all(
                todoList.tasks.map(async (id) => {
                    const taskRes = await getTask(id);
                    if (taskRes.code === 200 && taskRes.data?.name) {
                        return {
                            id,
                            name: taskRes.data.name,
                            status: taskRes.data.status ?? false,
                            category: category,
                            deadline: taskRes.data.deadline,
                        };
                    }
                    return null;
                })
            );
            setTasks(taskList.filter((task) => task !== null) as TaskRow[]);
        } catch (error) {
            toast.error("获取任务列表失败");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchTasks(); // 当 `category` 变化时重新调用 fetchTasks
    }, [category]);


    const formSchema = z.object({
        name: z.string({ message: "请写任务名称" }),
    });
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });
    return (
        /*item-end */
        <div className={cn(["flex","w-full","h-full","justify-end"])}>
            <div className={cn([
                "flex", "flex-col",
                "h-full","w-4/5"
            ])} >
                <div className={cn(["w-full","items-start","h-fit","px-8"])}>
                    <p className="lg:text-2xl font-bold mb-4">{category}</p>
                </div>

                <div className={cn(["flex","w-full","flex-col" ,"h-full"])} >

                    <div className={cn([ "flex","px-8","h-full","flex-col"])}>
                        <Columns tasks={unfinishedTasks} loading={loading} onUpdated={fetchTasks} />

                        <p className="text-lg font-semibold mt-6 mb-2">已完成</p>
                        <Columns tasks={finishedTasks} loading={loading} onUpdated={fetchTasks} />
                    </div>

                    <div className={cn(["flex","h-fit","items-end","justify-center","w-full","space-x-2","px-8"])}>
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit((values) => {
                                    if (!category) {
                                        toast.error("缺少任务分类信息");
                                        return;
                                    }
                                    setLoading(true);
                                    createTask({
                                        ...values,
                                        deadline: Math.floor(new Date().setHours(23, 59, 59, 999) / 1000), //默认为今天
                                        status: false,
                                        category,
                                    })
                                        .then((res) => {
                                            if (res.code === 200) {
                                                toast.success("任务添加成功", {
                                                    id: "add-success",
                                                    description: "finish",
                                                });
                                                form.reset({name: ""}); // 清空输入框，不能是" "，而是""
                                                fetchTasks(); // 重新获取任务列表
                                            } else {
                                                toast.error("任务添加失败", {
                                                    id: "add-error",
                                                    description: res.msg,
                                                });
                                            }
                                        })
                                        .finally(() => setLoading(false));
                                })}
                                className="flex w-full space-x-2"
                            >
                                <FormField control={form.control} name={"name"}
                                           render={({ field }) => (
                                               <FormItem className={cn("w-full")}>
                                                   <FormControl>
                                                       <Input
                                                           className={cn(["w-full","text-base"])}
                                                           icon={Plus}
                                                           {...field}
                                                           placeholder={"请添加任务名称"}
                                                       />

                                                   </FormControl>
                                               </FormItem>
                                           )}
                                />
                                <div className={cn(["flex","items-center"])}>
                                    <Button variant={"outline"} className={cn(["h-12","text-base","px-6"])}
                                            type={"submit"}
                                            disabled={loading}
                                    >{loading ? "添加中..." : "添加"}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                        {/*<CreateTask/> */}
                    </div>
                </div>

            </div>
        </div>
    );
}
