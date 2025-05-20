import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/storages/auth.ts";
import { useEffect, useState } from "react";
import SplitText from "@/components/ui/splitText.tsx";
import { cn } from "@/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card.tsx";
import { Button } from "@/components/ui/button.tsx";
import { getAllTodoLists } from "@/api/todolist";

export default function Home() {
    const navigate = useNavigate();
    const user = useAuthStore().user; // 或 useAuth().user
    const [loading, setLoading] = useState(true);


    const handleAnimationComplete = () => {
        console.log('All letters have animated!');
    };
    useEffect(() => {
        if (!user) {
            navigate("/account/login");
        }

        getAllTodoLists().then(res => {
            if (res.code === 200) {
                const fetchedLists = res.data || [];
                if (fetchedLists.length > 0) {
                    navigate(`/list/${fetchedLists[0].category}`);
                } else {
                    setLoading(false);
                }
            } else {
                console.error("获取列表失败:", res.msg);
                setLoading(false);
            }
        });
    }, [user, navigate]);

    return (
        <div className={cn(["flex","justify-end"])}>
            {/* 登录用户可见内容 */}
            {!loading && (
                <div className={cn(["flex","flex-col","w-4/5","justify-center","items-center"])}>
                    <div className={cn(["flex","flex-col","w-4/5","justify-center","items-center"])}>
                        <Card className={cn([
                            "bg-black/30",              // 半透明白色背景
                            "backdrop-blur-md",         // 模糊背景
                            "rounded-xl",               // 圆角
                            "shadow-lg",                // 阴影
                            "border",                   // 边框
                            "border-white/20"           // 半透明白边框
                        ])}>
                            <CardHeader className={cn(["flex","flex-col","items-start"])}>
                                <div className={"flex"}>
                                    <SplitText
                                        text={"欢迎"}
                                        className={cn(["text-2xl"," font-semibold","text-center","text-white"])}
                                        delay={150}
                                        animationFrom={{ opacity: 0, transform: 'translate3d(0,50px,0)' }}
                                        animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
                                        threshold={0.2}
                                        rootMargin="-50px"
                                        onLetterAnimationComplete={handleAnimationComplete}
                                    />
                                    <div className={cn(["text-2xl","ml-2"])}>
                                        👋
                                    </div>
                                </div>
                                <SplitText
                                    text={`你好,${user?.username}`}
                                    className={cn(["text-2xl"," font-semibold","text-center","text-white"])}
                                    delay={150}
                                    animationFrom={{ opacity: 0, transform: 'translate3d(0,50px,0)' }}
                                    animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
                                    threshold={0.2}
                                    rootMargin="-50px"
                                    onLetterAnimationComplete={handleAnimationComplete}
                                />
                            </CardHeader>
                            <CardContent className={cn(["flex","gap-3","flex-col"])}>
                                <p className={cn(["text-white/90","text-center"])}>
                                    你现在还没有任何列表
                                </p>
                                <Button variant={"ghost"} className={"bg-white/50"}>
                                    <p className={cn(["text-center","text-base","text-black/90"])}>
                                        开始新建列表,完成任务吧😊
                                    </p>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
}