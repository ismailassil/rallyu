"use client"
import { useState } from "react"
import Image from "next/image"
import { Check, X } from "@phosphor-icons/react";


function ProfileItems() {
	const ArrowParametres = [{ type: "profile", path: "/icons/profile-btn.svg" }, { type: "setting", path: "/icons/setting-btn.svg" }, { type: "logout", path: "/icons/logout-btn.svg" }];

	return (
		<ul className="absolute top-full right-0 mt-2 backdrop-blur-sm bg-white/10 rounded-m border-gray-400 w-48 ">
			{ArrowParametres.map((item, index) => (
				<li key={index} className="flex gap-4 items-center justify-center p-2 cursor-pointer text-lg hover:bg-white/30">
					<Image width={30} height={30} src={item.path} alt={`${item.type} image`} />
					{item.type}
				</li>
			))}
		</ul>
	);
}

const ProfileButton = () => {
	const [profileIcon, setProfileIcon] = useState(false);

  return (
    <div className="backdrop-blur-sm bg-white/10 flex items-center justify-center size-10 w-14 h-14 border rounded-full border-gray-400 my-auto relative" onClick={() => setProfileIcon((prev) => !prev)}>
    <Image width={24} height={24} src="/icons/profile.svg"
        alt="notification image"
    />
    <div>
        <Image src="/icons/down-arrow.svg" alt="down-arrow image" width={10} height={10}
            className={`absolute top-10 right-0 bg-white rounded-full size-4 transition-transform ${profileIcon ? "rotate-180" : "rotate-0"}`} />
    </div>
    {profileIcon && <ProfileItems />}
</div>
  )
}

export default ProfileButton