import Image from "next/image"
import NotificationButton from "./NotificationButton";
import ProfileButton from "./ProfileButton";
import SearchButton from "./SearchButton";

const NavBar = () => {
	
	return (
		<nav className="p-6 flex justify-between">
			<Image width={138} height={38} src="/logo/rallyu-logo.svg" alt="notification image" />
			<div className="flex justify-end gap-4 hover:cursor-pointer ">

				<SearchButton />
				<NotificationButton />
				<ProfileButton />
			</div>
		</nav>
	)
}

export default  NavBar