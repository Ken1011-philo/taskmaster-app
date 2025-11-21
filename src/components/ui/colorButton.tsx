import React from "react";
import { Button } from "./button"; 
import { cn } from "@/lib/utils"; 

// 青いボタン (BlueButton)
function BlueButton({ className, ...props }: React.ComponentProps<typeof Button>) {
  return (
    <Button
      // 元のButtonを呼び出してclassNameでデザインを上書き
      className={cn(
        "bg-[#4285F4] text-white hover:bg-[#4285F4]/80", // 色
        "rounded-full shadow-md shadow-blue-500/30 border-transparent", // 形・影
        "h-12 px-8 text-base font-bold", // サイズ
        className
      )}
      {...props}
    />
  );
}

// 灰色のボタン (GrayButton)
function GrayButton({ className, ...props }: React.ComponentProps<typeof Button>) {
  return (
    <Button
      className={cn(
        "bg-[#F8F9FA] text-[#3C4043] hover:bg-gray-200 border-transparent",
        "rounded-full shadow-sm",
        "h-12 px-8 text-base font-bold",
        className
      )}
      {...props}
    />
  );
}

// ゴーストボタン (GhostButton)
function GhostButton({ className, ...props }: React.ComponentProps<typeof Button>) {
  return (
    <Button
      variant="ghost"
      className={cn(
        "text-[#5F6368] hover:bg-gray-100",
        "rounded-full",
        "h-12 px-8 text-base font-bold",
        className
      )}
      {...props}
    />
  );
}
export { BlueButton, GrayButton, GhostButton };