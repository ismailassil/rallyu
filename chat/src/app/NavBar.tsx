
export default function NavBar() {
        return (
                <nav className=" m-6 flex justify-between">

                        <img src="/logo/rallyu-logo.svg"
                                alt="notification image"
                                width={20} height={20}
                                className=" w-40" />

                        <div className=" flex  justify-end gap-6 px-2">
                                <div className="bg-red-400">

                                        <img src="/icons/command.svg" alt="command image"/>
                                        <img src="/icons/command.svg" alt="command image"/>
                                        <input>
                                        </input>
                                </div>
                                <img src="/icons/notification.svg"
                                        alt="notification image"
                                        width={20} height={20}
                                        className=" " />
                                <img src="/icons/profile.svg"
                                        alt="img"
                                        width={20} height={20}
                                        className="" />
                        </div>
                </nav>
        )
}
