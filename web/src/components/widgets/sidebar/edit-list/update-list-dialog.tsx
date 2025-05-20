import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { useSharedStore } from "@/storages/shared.ts"
import { changeTodoListCategory } from "@/api/todolist"
import { cn } from "@/utils"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form.tsx"
import { Input } from "@/components/ui/input.tsx"
import { Button } from "@/components/ui/button.tsx"
import { SaveIcon, SquarePen, Type } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
export function UpdateListDialog
({ listId, category, onClose, }
 : {
    listId: number
    category: string
    onClose: () => void
}) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false)
    const sharedStore = useSharedStore()
    const formSchema = z.object({
        category: z.string().min(1, "名称不能为空"),
    })
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { category },
    })

    // 如果外部 category 变了，更新表单初始值
    useEffect(() => {
        form.reset({ category })
    }, [category])

    const onSubmit = form.handleSubmit(async (values) => {
        setLoading(true)
        try {
            const res = await changeTodoListCategory(listId, values.category)

            if (res.code === 200) {
                sharedStore.setRefresh()
                onClose()
                navigate(`/list/${values.category}`)
            } else {
                toast.error("更新失败：" + res.msg)
            }
        } catch (err) {
            toast.error("更新异常，请重试")
        } finally {
            setLoading(false)
        }
    })

    return (
        <div className={cn(["p-4 space-y-4 w-full"])}>
            <h2 className={cn(["text-lg","font-semibold","flex","flex-row","items-center"])}>
                <SquarePen className={cn(["size-8"])}/>
                编辑列表名称</h2>
            <Form {...form}>
                <form onSubmit={onSubmit} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>列表名称</FormLabel>
                                <FormControl>
                                    <Input {...field} icon={Type} placeholder="请输入新的列表名称" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                        <Button
                            type={"submit"}
                            icon={SaveIcon}
                            loading={loading}
                            className={cn(
                                "w-full",
                                "bg-green-700",
                                "text-white","text-center",
                                "text-base","h-9",
                                "hover:bg-green-600",
                                "focus:ring-2"," focus:ring-green-500 ","focus:ring-offset-2")}
                        >
                            保存
                        </Button>
                </form>
            </Form>
        </div>
    )
}
