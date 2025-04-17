import { CaretDown, Check } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import InlineInput from "./InlineInput";
import NameInput from "./NameInput";
import UploadInput from "./UploadInput";
import { motion } from "framer-motion";
import BlockedUser from "./BlockedUser";

function General() {
	const [drop, setDrop] = useState(false);
	const [language, setLanguage] = useState("🇬🇧    English");
	const dropRef = useRef<HTMLUListElement>(null);
	const buttonRef = useRef<HTMLButtonElement>(null);
	const [formData, setFormData] = useState({
		firstname: "",
		lastname: "",
		bio: "",
		username: "ismailassil",
		email: "ismailassil@duck.com",
	});

	const originalValues = {
		firstname: "Ismail",
		lastname: "Assil",
		bio: "Step into a World of Classy Gaming",
	};

	const handleInputChange = (field: string, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	// function handleSubmit() {
	// 	if (formData.firstname.trim() === "") {
	// 		setError("First name is required.");
	// 		return;
	// 	}
	// 	if (formData.lastname.trim() === "") {
	// 		setError("Last name is required.");
	// 		return;
	// 	}
	// 	if (formData.username.trim() === "") {
	// 		setError("username is required.");
	// 		return;
	// 	}

	// 	// ADD API
	// }

	useEffect(() => {
		function handleClick(event: MouseEvent) {
			if (
				dropRef.current &&
				buttonRef.current &&
				!dropRef.current.contains(event?.target as Node) &&
				!buttonRef.current.contains(event?.target as Node)
			) {
				setTimeout(() => setDrop(false), 0);
			}
		}

		if (drop) {
			document.addEventListener("mousedown", handleClick);
		} else {
			document.removeEventListener("mousedown", handleClick);
		}

		return () => {
			document.removeEventListener("mousedown", handleClick);
		};
	}, [drop]);

	return (
		<motion.div
			className="max-w-220 hide-scrollbar flex h-full w-full flex-col gap-3 overflow-y-scroll p-4"
			initial={{ opacity: 0, x: -50 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: 50 }}
			transition={{ type: "spring", stiffness: 120 }}
		>
			<div>
				<h2 className="mb-1 mt-2 text-xl font-semibold lg:text-2xl">Basics</h2>
				<hr className="border-white/10" />
			</div>
			<UploadInput />
			<NameInput
				orFirstname={originalValues.firstname}
				orLastname={originalValues.lastname}
				firstname={formData.firstname}
				lastname={formData.lastname}
				handleInputChange={handleInputChange}
			/>
			<InlineInput
				disabled={true}
				label="Username"
				unique="username"
				original_value={formData.username}
				value=""
				type="text"
				icon="/user.svg"
			/>
			<InlineInput
				original_value={formData.email}
				disabled={true}
				label="Email Address"
				unique="email"
				value=""
				type="email"
				icon="/mail.svg"
			/>
			<InlineInput
				original_value={originalValues.bio}
				label="Bio"
				unique="bio"
				value={formData.bio}
				setValue={handleInputChange}
				type="text"
				icon="/note.svg"
			/>
			<div className="flex justify-end">
				<button
					className="bg-main hover:scale-101 mt-3 flex transform items-center gap-4
										rounded-sm px-4 py-2 text-sm
										transition-all duration-300 hover:cursor-pointer lg:text-base"
				>
					<Check size={22} />
					<p>Save Changes</p>
				</button>
			</div>
			<div className="mt-5">
				<h2 className="mb-1 mt-2 text-xl font-semibold lg:text-2xl">Preferences</h2>
				<hr className="border-white/10" />
			</div>
			<div className="max-w-200 flex items-center justify-between gap-20 text-sm lg:text-base">
				<h3 className="w-full flex-1">Language</h3>
				<button
					ref={buttonRef}
					className="bg-card border-br-card flex-2 relative h-11 w-full rounded-lg border-2 text-left hover:cursor-pointer"
					onClick={(e) => {
						e.preventDefault();
						setDrop((drop) => !drop);
					}}
				>
					<CaretDown
						size={24}
						className={`absolute bottom-1/2 right-2 translate-y-1/2 transition duration-300 ${
							drop ? "rotate-180" : "rotate-0"
						}`}
					/>
					<div className="px-4" style={{ whiteSpace: "pre" }}>
						{language}
					</div>

					{drop && (
						<ul
							ref={dropRef}
							className="top-13 *:text-left *:py-1.5 *:px-4 bg-card backdrop-blur-xs border-br-card *:hover:bg-white/10 *:w-full *:cursor-pointer absolute z-10 w-full rounded-md border-2 py-1"
						>
							<li
								onClick={(e) => {
									e.preventDefault();
									setLanguage("🇬🇧    English");
								}}
							>
								🇬🇧 <span className="pl-3">English</span>
							</li>
							<li
								onClick={(e) => {
									e.preventDefault();
									setLanguage("🇪🇸    Spanish");
								}}
							>
								🇪🇸 <span className="pl-3">Spanish</span>
							</li>
							<li
								onClick={(e) => {
									e.preventDefault();
									setLanguage("🇸🇦    العربية");
								}}
							>
								🇸🇦 <span className="pl-3">العربية</span>
							</li>
						</ul>
					)}
				</button>
			</div>
			<div>
				<h2 className="mb-1 mt-5 text-xl font-semibold lg:text-2xl">Blocked Users</h2>
				<hr className="border-white/10" />
			</div>
			<div className="mt-3 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				{Array.from({ length: 11 }).map((_, i) => (
					<BlockedUser key={i} user={{ name: "Salah Moumni", img: "/image_2.jpg" }} />
				))}
			</div>
		</motion.div>
	);
}

export default General;
