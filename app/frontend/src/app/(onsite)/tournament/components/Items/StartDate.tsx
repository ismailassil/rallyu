import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

const getDateByHour = function (added = 1) {
	const now: Date = new Date();
	now.setHours(now.getHours() + added);
	return now;
};

const formatDate = (date: Date) => {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
};

const formatTime = (date: Date) => {
	const hours = String(date.getHours()).padStart(2, "0");
	const minutes = String(date.getMinutes()).padStart(2, "0");
	return `${hours}:${minutes}`;
};

const StartDate = function ({
	setDate,
	error,
	setError,
}: {
	date: string;
	setDate: (value: string) => void;
	error: {status: boolean, message: string};
	setError: ({ status, message }: { status: boolean, message: string }) => void;
}) {
	const [minDate, setMinDate] = useState<Date>(getDateByHour());
	const [dateInput, setDateInput] = useState(formatDate(minDate));
	const [timeInput, setTimeInput] = useState(formatTime(minDate));
	const inputDate = useRef<HTMLInputElement | null>(null);
	const [isOpen, setIsOpen] = useState(false);
	const translate = useTranslations("tournament");

	useEffect(() => {
		const timer = setInterval(() => {
			const minutesLeft = (minDate.getTime() - Date.now()) / (1000 * 60);
			if (Number(minutesLeft) <= 30) setMinDate(getDateByHour(2));
		}, 1000 * 2);

		return () => clearInterval(timer);
	}, [minDate]);

	const openCalendar = function () {
		setIsOpen(!isOpen);
		if (!isOpen) inputDate.current?.showPicker();
		else inputDate.current?.blur();
	};

	const blurDateHandler = () => setIsOpen(false);

	const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		console.log(e.target.value)
		setDateInput(e.target.value);
		setError({status: false, message: ""});
		updateFullDate(e.target.value, timeInput);
	};

	const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setTimeInput(e.target.value);
		setError({status: false, message: ""});
		updateFullDate(dateInput, e.target.value);
	};

	const updateFullDate = (dateStr: string, timeStr: string) => {
		const [year, month, day] = dateStr.split("-").map(Number);
		const [hours, minutes] = timeStr.split(":").map(Number);
		
		setDate(`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`);
	};

	return (
		<motion.div
			initial={{ opacity: 0, x: -100 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ duration: 0.2, delay: 0.1 }}
			className="mb-5 flex min-h-11 flex-col items-center justify-between gap-2 text-sm md:mb-0 md:flex-row lg:gap-20 lg:text-base"
		>
			<label className="w-full flex-1" htmlFor="picture">
				{translate("panel.new-tournament.t-date")}
			</label>
			<div className="w-full flex-2">
				{error.status && (
					<p className="mb-1 text-red-500">
						{ error.message }
					</p>
				)}
				<div
					className={`flex gap-2 *:rounded-md *:border-2 ${error.status ? "*:border-red-700" : "*:border-white/10"} *:transform *:cursor-pointer *:p-2 *:transition-all *:duration-200 *:hover:scale-101`}
				>
					<input
						ref={inputDate}
						type="date"
						name="start-date"
						id="start-date"
						min={formatDate(minDate)}
						value={dateInput}
						onChange={handleDateChange}
						onBlur={blurDateHandler}
						className="[&::-webkit-calendar-picker-indicator] w-full outline-0"
						onClick={openCalendar}
					/>
					<input
						type="time"
						name="start-time"
						id="start-time"
						min={formatTime(minDate)}
						value={timeInput}
						onChange={handleTimeChange}
						className="w-full outline-0 [&::-webkit-calendar-picker-indicator]:hidden"
					/>
				</div>
			</div>
		</motion.div>
	);
};

export default StartDate;
