import { useRouter } from "next/navigation";
import Image from "next/image";
import UserMenu from "./UserMenu";

export default function NavBar() {
	const router = useRouter();

	return (
		<>
			<Image
				src="/rallyu-logo.svg"
				alt="Logo"
				width={138}
				height={38}
				onClick={(e) => {
					e.preventDefault();
					router.push("/dashboard");
				}}
				priority={true}
				className="hover:cursor-pointer pl-6 hover:scale-105
					transition-transform duration-200"
			></Image>
			<UserMenu />
		</>
	);
}
