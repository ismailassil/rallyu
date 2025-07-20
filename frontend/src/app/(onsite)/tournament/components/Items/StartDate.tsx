import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const getDateByHour = function (added = 1) {
	const now: Date = new Date();

	now.setTime(now.getTime() + 1000 * 60 * 60 * added);
	return now;
};

const StartDate = function ({
	date,
	setDate,
	error,
	setError,
}: {
	date: string;
	setDate: (value: string) => void;
	error: boolean;
	setError: (value: boolean) => void;
}) {
	const [minDate, setMinDate] = useState<Date>(getDateByHour());
	const inputDate = useRef(null);
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		const timer = setInterval(() => {
			const timeDiffrence: string = (
				(minDate.getTime() - new Date().getTime()) /
				(1000 * 60)
			).toFixed(0);
			if (Number(timeDiffrence) <= 30) setMinDate(getDateByHour(2));
		}, 1000 * 2);

		return () => {
			clearInterval(timer);
		};
	}, [minDate]);

	const dateHandler = function (e) {
		e.preventDefault();
		setDate(e.target.value);
        setError(false);
	};

	const openCalendar = function (e) {
		setIsOpen(!isOpen);
		if (!isOpen) inputDate.current.showPicker();
		else inputDate.current.blur();
	};

	const blurDateHandler = function (e) {
		setIsOpen(false);
	};

	return (
		<motion.div
			initial={{ opacity: 0, x: -100 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ duration: 0.2, delay: 0.1 }}
			className="min-h-11 flex flex-col items-center justify-between gap-2 text-sm md:flex-row lg:gap-20 lg:text-base"
		>
			<label className="w-full flex-1" htmlFor="picture">
				Start Date
			</label>
			<div className="flex-2 w-full">
				{error && <p className="text-red-500 mb-1">Invalid date provided. The minimum allowed date is one hour from now.</p>}
				<div
					className={`*:flex *:justify-center *:items-center *:px-1
                                *:py-1 *:rounded-sm *:gap-2 *:hover:scale-101 *:transform *:transition-all *:duration-200 *:cursor-pointer flex gap-2
                                rounded-md border-2 ${error ? "border-red-700" : "border-white/10"} px-1 py-1`}
					onClick={openCalendar}
				>
					<input
						ref={inputDate}
						type="datetime-local"
						name="start-date"
						id="start-date"
						min={minDate.toISOString().slice(0, 16)}
						value={date}
						onChange={dateHandler}
                        onBlur={blurDateHandler}
						className="w-full outline-0 [&::-webkit-calendar-picker-indicator]:hidden"
					/>
				</div>
			</div>
		</motion.div>
	);
};

export default StartDate;
