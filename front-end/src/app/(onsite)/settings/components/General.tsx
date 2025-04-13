import { CaretDown, Check } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import InlineInput from "./InlineInput";
import NameInput from "./NameInput";
import UploadInput from "./UploadInput";

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
		<div className="h-full w-full p-4 flex flex-col gap-3 max-w-220 hide-scrollbar overflow-scroll">
			<div>
				<h2 className="text-xl lg:text-2xl mb-1 mt-2 font-semibold">Basics</h2>
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
					className="flex items-center gap-4 bg-main rounded-sm py-2 px-4
										hover:scale-101 transform transition-all duration-300
										hover:cursor-pointer mt-3"
				>
					<Check size={22} />
					<p>Save Changes</p>
				</button>
			</div>
			<div className="mt-5">
				<h2 className="text-xl lg:text-2xl mb-1 mt-2 font-semibold">
					Preferences
				</h2>
				<hr className="border-white/10" />
			</div>
			<div className="flex justify-between items-center gap-20 max-w-200 text-sm lg:text-base">
				<h3 className="flex-1 w-full">Language</h3>
				<button
					ref={buttonRef}
					className="relative bg-card border-2 border-br-card w-full flex-2 h-11 rounded-lg text-left hover:cursor-pointer"
					onClick={(e) => {
						e.preventDefault();
						setDrop((drop) => !drop);
					}}
				>
					<CaretDown
						size={24}
						className={`absolute right-2 bottom-1/2 translate-y-1/2 transition duration-300 ${drop ? "rotate-180" : "rotate-0"}`}
					/>
					<div className="px-4" style={{ whiteSpace: "pre" }}>
						{language}
					</div>

					{drop && (
						<ul
							ref={dropRef}
							className="absolute top-13 *:text-left *:py-1.5 *:px-4 bg-card w-full z-10 backdrop-blur-xs rounded-md border-2 border-br-card py-1 *:hover:bg-white/10 *:w-full *:cursor-pointer"
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
			<div className="mt-5">
				<h2 className="text-xl lg:text-2xl mb-1 mt-2 font-semibold">
					Be Caution
				</h2>
				<hr className="border-white/10" />
			</div>
			<button
				className="flex flex-col hover:bg-white/2 ring-1 ring-white/20 rounded-md py-4 px-5
						hover:cursor-pointer hover:ring-2 hover:ring-white/20 hover:scale-101 transform transition-all duration-300 text-left"
			>
				<h3 className="lg:text-base text-sm font-bold">Delete Account</h3>
				<p className="font-light text-sm lg:text-base text-gray-400">
					This will permanently delete your account and all associated data.
					Action is final.
				</p>
			</button>
			<button
				className="flex flex-col hover:bg-white/2 ring-1 ring-white/20 rounded-md py-4 px-5
						hover:cursor-pointer hover:ring-2 hover:ring-white/20 hover:scale-101 transform transition-all duration-300 text-left"
			>
				<h3 className="lg:text-base text-sm font-bold">
					Anonymizes your personal data
				</h3>
				<p className="font-light text-sm lg:text-base text-gray-400">
					Your personal information will be anonymized to prevent identification
					or tracking.
				</p>
			</button>
		</div>
	);
}

export default General;
