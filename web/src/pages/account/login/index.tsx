import { cn } from "@/utils";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { LoginForm } from "@/pages/account/login/login-form.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Link } from "react-router-dom";
import { UserRoundPlus } from "lucide-react";
import { Separator } from "@/components/ui/separator.tsx";

export default function(){
    return(
        <div
        className={cn("flex flex-1" ,
            "items-center justify-center")}>
            <Card className={cn("p-4","w-[40rem]")}>
                <CardContent className={cn(["grid"," md:grid-cols-[1fr_auto_1fr]","px-0"])}>
                    {/*
                        两列的 grid
                        <LoginForm /> 是第一列，右边的 div 是第二列
                    */}
                    <div className={cn(["flex-1/2", "flex", "flex-col"])}>
                        <LoginForm/>
                    </div>
                    <Separator
                        orientation={"vertical"}
                        className={cn(["h-81", "my-auto"])}
                    />
                    <div className={cn(["flex","flex-col","p-2","md:p-4","h-full"
                    ])}
                    >
                        <div className={cn(["flex"," justify-center","items-center","flex-1"])}>
                            <img
                                alt="logo"
                                decoding={"async"}
                                src={"https://avatars.githubusercontent.com/u/149759599?v=4"}
                                draggable={false}
                                className={cn(["w-50 h-50 rounded-full mx-auto"
                                ])}
                            />

                        </div>
                        <div className={cn(["flex justify-center"])}>
                            <Button
                                asChild
                                className={cn("w-full","font-semibold")}
                                size={"lg"}
                                variant={"tonal"}
                                icon={UserRoundPlus}
                            >
                                {/*还没有账号？注册！*/}
                                <Link to={"/account/register"}>还没有账号？注册！</Link>
                            </Button>
                        </div>

                    </div>

                </CardContent>
            </Card>
        </div>
        )
}