import FormButton from "@/app/(auth)/components/UI/FormButton";
import { ArrowLeft, Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";

const RoomNotFound = () => {
    const router = useRouter();

    return (
        <div className="h-full w-full flex flex-col gap justify-center items-center">
            <Search
                strokeWidth={0.5}
                className="min-h-[220px] min-w-[220px] opacity-60"
            />
            <span className="font-funnel-display font-bold text-2xl opacity-70">Room Not Found</span>
            <FormButton
                text="Go Back To Lobby"
                icon={<ArrowLeft size={16} />}
                onClick={() => router.push('/game')}
                className="bg-card min-w-[230px] h-[60px] hover:bg-blue-800/40 mt-7"
            />
        </div>
    )
}

export default RoomNotFound
