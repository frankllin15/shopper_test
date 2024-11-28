import { cn } from "@/lib/utils.ts";

type SpinnerProps = {
  className?: string
}
export const Spinner = ({className}: SpinnerProps) => {
  return (
    <div className={cn("animate-spin duration-500 rounded-full h-6 w-6 border-b-2 border-gray-900", className)}></div>
  )
}