import { useState } from "react";
import { useSharedStore } from "@/storages/shared.ts";

import { deleteByListId, getAllTodoLists } from "@/api/todolist";
/*import { Card } from "@/components/ui/card.tsx";*/
import { cn } from "@/utils";
import { TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { useNavigate } from "react-router-dom";

function DeleteListDialog(
    {listId, category,onClose}:{
        listId:number;
        category:string;
        onClose:() => void}
)
{
    const [loading, setLoading] = useState<boolean>(false);
    const sharedStore = useSharedStore();
    const navigate = useNavigate();

    const handleDelete=async ()=>{
        if (!listId) return
        setLoading(true)
        try {
            const res = await deleteByListId(listId);
            if (res.code === 200) {
                console.log("删除成功");

                // 重新获取所有列表
                const listRes = await getAllTodoLists();
                const newLists = listRes.data || [];

                if (newLists.length > 0) {
                    const first = newLists[0];
                    navigate(`/list/${first.category}`);
                } else {
                    navigate("/"); // 没有任何列表，回到首页
                }

                sharedStore.setRefresh(); // 通知刷新
                onClose(); // 关闭弹窗
            } else {
                console.log("删除失败");
            }
        } finally {
            setLoading(false);
        }
    }
    return(
        <>
            <form
                className={cn([
                    "p-0",
                    "flex",
                    "flex-col",
                    "p-5","m-1",
                    "min-h-32",
                    "w-full",
                    "gap-10",
                ])}>
                <h2
                    className={cn([
                        "flex",
                        "gap-2",
                        "items-center",
                        "font-bold"
                    ])}
                >
                    <TrashIcon className={cn(["size-8"])} />
                    删除列表
                </h2>
                {/*"opacity-50"*/}
                <p className={cn(["text-lg","font-medium","text-center"])}>
                    你确定要删除列表 {category} 吗？
                </p>
                <div className={cn(["flex","justify-end"])}>
                    <Button
                        level={"error"}
                        variant={"tonal"}
                        size={"sm"}
                        onClick={()=>handleDelete()}
                        className={cn(["w-full"])}
                    >
                        {loading ? "删除中..." : "确定"}
                    </Button>
                </div>
            </form>

        </>
    )
}
export {DeleteListDialog}