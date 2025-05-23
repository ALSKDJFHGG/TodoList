import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { createTodoList } from "@/api/todolist";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button.tsx";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form.tsx";
import { Input } from "@/components/ui/input.tsx";
import { cn } from "@/utils";
import { CheckIcon, Plus, ScrollText, Type } from "lucide-react";

function AddList({onAddSuccess}:{onAddSuccess:()=>void}){
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const formSchema = z.object({
        category:z.string({message:"请填写列表类型"})
    })
    const form = useForm<z.infer<typeof formSchema>>({
        resolver:zodResolver(formSchema)
    })
    const [open,setOpen] =useState(false)
    function onSubmit(values:z.infer<typeof formSchema>){
        setLoading(true);
        createTodoList(values.category)
            .then(
                (res) => {
                    if (res.code === 200) {
                        toast.success("列表添加成功", {
                            id: "add-success",
                            description: "finish"
                        })
                        navigate(`/list/${values.category}`)
                        setOpen(false)
                        onAddSuccess()
                    }
                    else if (res.code ===3001) {
                        toast.error("已存在类别", {
                            id: "add-error",
                            description: res.msg
                        })
                    }
                    else {
                        toast.error("列表添加失败", {
                            id: "add-error",
                            description: res.msg
                        })
                    }
                })
            .finally(()=>{
                setLoading(false)
            })
    }

    return(
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    className={cn(["w-full","flex","justify-start","gap-3"])}
                >
                    <Plus/>
                    新建列表
                </Button>
            </DialogTrigger>

            <DialogContent className={cn(["p-4"])}>
                <DialogHeader>
                    <DialogTitle className={cn(["flex","flex-row","items-center","gap-3"])}> <ScrollText/>添加列表</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div>
                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem className={cn(["flex","gap-4","flex-col"])}>
                                        <FormLabel>列表名称</FormLabel>
                                        <FormControl>
                                            <Input placeholder=" " {...field} icon={Type} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <div className={cn(["mt-4","flex","justify-end"])}>
                                <Button type={"submit"}
                                        variant={"solid"}
                                        icon={CheckIcon}
                                        disabled={loading}
                                        className={cn([
                                            "w-full",
                                            "bg-green-700",
                                            "text-white","text-center",
                                            "text-base","h-9",
                                            "hover:bg-green-600",
                                            "focus:ring-2"," focus:ring-green-500 ","focus:ring-offset-2"
                                        ])} >
                                    {loading ? "添加中..." : "添加"}
                                </Button>
                            </div>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
export {AddList}