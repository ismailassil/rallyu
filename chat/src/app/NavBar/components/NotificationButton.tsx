"use client"
import { useState } from "react"
import Image from "next/image"
import { Check, X } from "@phosphor-icons/react";

function NotificationItems() {
	const [numberOfNotification, setNumberOfNotification] = useState(0)
	const Notification = [
		{ userImage: "/profile/image_1.jpg", userName: "ismail assil", NotificationMessage: "🎮 Ready to play?" },
		{ userImage: "/profile/image_1.jpg", userName: "ismail assil", NotificationMessage: "🎮 Ready to play?" },
		{ userImage: "/profile/image_1.jpg", userName: "ismail assil", NotificationMessage: "🎮 Ready to play?" },
		{ userImage: "/profile/image_1.jpg", userName: "ismail assil", NotificationMessage: "🎮 Ready to play?" },
		{ userImage: "/profile/image_1.jpg", userName: "ismail assil", NotificationMessage: "🎮 Ready to play?" },
		{ userImage: "/profile/image_1.jpg", userName: "ismail assil", NotificationMessage: "🎮 Ready to play?" },
		{ userImage: "/profile/image_1.jpg", userName: "ismail assil", NotificationMessage: "🎮 Ready to play?" }
	]

	return (
		<div className="absolute top-full mt-2 right-0 rounded-md border-white w-64 backdrop-blur-sm bg-white/10">
			<div className="flex justify-between px-4 py-2">
				<h3>Notification</h3>
				<span>0</span>
			</div>
			<ul className=" h-64 overflow-auto">
				{Notification.map((item, index) => (
					<li key={index} className=" flex py-4 px-1 gap-2 items-center backdrop-blur-sm bg-white/10">
						<Image width={40} height={40} src={item.userImage} alt={`${item.userName} image`} className="rounded-full w-8 h-8" />
						<div className="flex text-sm flex-col">
							<span className="font-medium">{item.userName}</span>
							<span className="text-xs">{item.NotificationMessage}</span>
						</div>
						<div className=" ml-auto flex justify-end gap-2">
							<Check width={20} height={20} className="bg-violet-600 rounded-xs size-6 hover:cursor-pointer" />
							<X width={20} height={20} className="bg-red-700 rounded-xs size-6 hover:cursor-pointer" />
						</div>
					</li>
				))}
			</ul>
		</div>
	)
}

const NotificationButton = () => {
	const [notificationIcon, setNotificationIcon] = useState(false);

    return (
        <div className="backdrop-blur-sm bg-white/10 flex items-center justify-center size-10 w-14 h-14 border rounded-full border-gray-400 my-auto" onClick={() => setNotificationIcon((prev) => !prev)}>
            <Image width={24} height={24} src="/icons/notification.svg"
                alt="notification image" />
		    {notificationIcon && <NotificationItems />}
        </div>

    )
}

export default NotificationButton