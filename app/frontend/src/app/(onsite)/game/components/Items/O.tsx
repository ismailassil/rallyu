import { APIClient } from "@/app/(api)/APIClient";
import { useAuth } from "@/app/(onsite)/contexts/AuthContext";

const X = () => {
    const { apiClient } = useAuth()

    const debug = async () => {
        try {
            const res1 = await apiClient.instance.get('/v1/matchmaking/pingpong/queue')
            console.log('res1',res1.data);
            const res2 = await apiClient.instance.get('/v1/matchmaking/tictactoe/queue')
            console.log('res2',res2.data);
        } catch (err) {
            console.log(err);
        }
    }
    return (
        <div
            className="absolute inset-0 rounded-xl transition-all duration-150 hover:bg-gray-300/[6%] bg-card hover:scale-[101%] active:scale-[99%] cursor-pointer [clip-path:polygon(55%_0,100%_0,100%_100%,45%_100%)]"
            onClick={debug}
        >
						
		</div>
    )
}

export default X;