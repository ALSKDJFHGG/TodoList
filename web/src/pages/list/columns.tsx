import { useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { updateTask } from "@/api/task";
import { toast } from "sonner";
import { ArrowDown, ArrowUp, ArrowUpDown, EditIcon, TrashIcon } from "lucide-react";
import { cn } from "@/utils";
import { Button } from "@/components/ui/button.tsx";
import { Dialog, DialogContent } from "@/components/ui/dialog.tsx";
import { UpdateTaskDialog } from "@/pages/list/list_id/update-task-dialog.tsx";
import { DeleteTaskDialog } from "@/pages/list/list_id/delete-task-dialog.tsx";
import { Checkbox } from "@/components/ui/checkbox.tsx";

// 删除不需要的状态声明，直接使用 props 传递过来的值
export interface TaskRow{
    id: number;        // 任务 ID
    name: string;      // 任务名称
    status: boolean;   // 任务状态，可能是完成或未完成
    deadline:number,
    category: string;  // 任务所属分类
}
interface ColumnProps {
    tasks: TaskRow[];  // 添加 tasks 属性
    loading: boolean;  // 添加 loading 属性
    onUpdated?:()=>void;
}
export function Columns({ tasks, loading,onUpdated }: ColumnProps) {
    const columns: ColumnDef<TaskRow>[] = useMemo(() => [
        {
            accessorKey:"status",
            id:"status",
            header:()=><div className={"justify-self-center"}>状态</div>,
            cell:({row})=>{
                const  status = row.getValue<boolean>("status")
                const name =row.getValue<string>("name")

                const [checked,setChecked] = useState(status)
                function handleTaskChange(){
                    const newValue = !checked;
                    setChecked(newValue);

                    /* 调用之前封装好的跟新Task接口*/
                    updateTask({
                        id:row.original.id,
                        status: newValue,
                    }).then((res) => {
                        if (res.code === 200) {
                            toast.success(
                                `更新任务 ${name} 的完成度: ${newValue ? "完成" : "未完成"}`,
                                {
                                    id: "is_finished",
                                }
                            );
                            onUpdated?.();
                        }
                    })
                }
                return(

                    <div className={cn(["flex","items-center","justify-center"])}>
                        <Checkbox
                            checked={checked}
                            onCheckedChange={handleTaskChange}
                            aria-label={"开关"}
                        />
                    </div>
                )
            }
        },
        {
            accessorKey: "name",
            header: ()=><div className={"justify-self-center"}>任务名称</div>,
            cell: ({ row }) => {
                const name = row.getValue("name") as string
                const status = row.getValue("status") as boolean; /*如果true显示删除字体*/
                return(
                    <div className={cn([
                        "flex","justify-center",
                        status&&"line-through"
                    ])}>
                        {name? `${name}`:"-"}
                    </div>
                )

                /*name || "-"*/
            }
        },
        {
            accessorKey:"deadline",
            id:"deadline",
            header:({column})=>{
                const Icon = useMemo(() => {
                    switch (column.getIsSorted()) {
                        case "asc":
                            return ArrowUp;
                        case "desc":
                            return ArrowDown;
                        case false:
                        default:
                            return ArrowUpDown;
                    }
                },[column.getIsSorted()])
                return(
                    <div className={cn(["flex", "gap-1", "justify-self-center","items-center"])}>
                        截止于
                        <Button
                            icon={Icon}
                            square
                            size={"sm"}
                            onClick={()=>column.toggleSorting()}
                        />
                    </div>
                )
            },
            cell:({row})=>{
                const deadline=new Date(
                    row.getValue<number>("deadline")*1000
                ).toLocaleDateString()
                return(
                        <div className="flex justify-center">
                            {deadline}
                        </div>
                    )

            }
        },
        {
            id:"action",
            header:()=><div className={cn(["justify-self-center"])}>操作</div>,
            cell:({row})=>{
                const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
                const [updateDialogOpen, setUpdateDialogOpen] = useState<boolean>(false);
                return(
                    <div
                        className={cn([
                            "flex",
                            "items-center",
                            "justify-center",
                            "gap-2",
                        ])}
                    >
                        <Button
                            variant={"ghost"}
                            size={"sm"}
                            square
                            icon={EditIcon}
                            onClick={()=>setUpdateDialogOpen(true)}
                        />
                        <Dialog
                            open={updateDialogOpen}
                            onOpenChange={setUpdateDialogOpen}
                        >
                            <DialogContent className={cn("")}>
                                <UpdateTaskDialog
                                    taskId={row.original.id}
                                    onSuccess={onUpdated}
                                    onClose={()=>setUpdateDialogOpen(false)}
                                ></UpdateTaskDialog>
                            </DialogContent>
                        </Dialog>

                        <Button
                            level={"error"}
                            variant={"ghost"}
                            size={"sm"}
                            square
                            icon={TrashIcon}
                            onClick={() => setDeleteDialogOpen(true)}
                        />
                        <Dialog
                            open={deleteDialogOpen}
                            onOpenChange={setDeleteDialogOpen}
                        >
                            <DialogContent>
                                <DeleteTaskDialog
                                    taskId={row.original.id}
                                    taskName={row.original.name}
                                    onClose={()=>setDeleteDialogOpen(false)}
                                    onDelete={onUpdated}
                                ></DeleteTaskDialog>
                            </DialogContent>
                        </Dialog>
                    </div>
                )
            }
        }
    ], [onUpdated]);

    if (loading) return <div className="p-4">加载中...</div>;

    return (
        <div className="container mx-auto py-4">
            <DataTable columns={columns} data={tasks} />
        </div>
    );
}
