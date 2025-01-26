import React, { useContext } from "react"
import { addDays } from "../../Utils/date"
import { DatePickerContext } from "../DatePickerProvider"
import { twMerge } from "tailwind-merge"

interface IDaysProps {
	start: number
}

const Days = ({ start }: IDaysProps) => {
	const { selectedDate, changeSelectedDate, showSelectedDate, getFormattedDate, options } = useContext(DatePickerContext)
	
	const startOfWeek = (new Date(start).getDay() + 6) % 7;
	const weekDays = options.weekDays || [];
	const sortedWeekDays = weekDays.slice(startOfWeek).concat(weekDays.slice(0, startOfWeek));

	return (
		<>
			<div className="grid grid-cols-7 mb-1">
				{sortedWeekDays.map((day, index) => (
					<span key={index} className="h-6 text-sm font-medium leading-6 text-center text-gray-500 dow dark:text-gray-400">
						{day}
					</span>
				))}
			</div>
			<div className="grid w-64 grid-cols-7">
				{[...Array(42)].map((_date, index) => {
					const current = addDays(start, index)
					const day = getFormattedDate(current, { day: "numeric" })
					const month = getFormattedDate(current, { month: "long" })
					const year = getFormattedDate(current, { year: "numeric" })

					const isDisable =  !changeSelectedDate("check-availability", new Date(current));

					if (isDisable){
						return (
							<button
								key={index}
								className={twMerge("hover:bg-gray-100 dark:hover:bg-gray-600 block flex-1 border-0 rounded-lg cursor-pointer text-center dark:text-white font-semibold text-sm leading-9 text-gray-500",options?.theme?.disabledText)}
							>{day}</button>
						)
					}

					const isSelected = showSelectedDate && selectedDate.getTime() > 0 && getFormattedDate(selectedDate) === getFormattedDate(current);
					if (isSelected){
						return (
							<button
								key={index}
								disabled={true}
								onClick={() => {
									changeSelectedDate("date", new Date(current))
								}}
								className={twMerge("hover:bg-gray-100 dark:hover:bg-gray-600 block flex-1 border-0 rounded-lg cursor-pointer text-center dark:text-white font-semibold text-sm text-gray-900 leading-9",options?.theme?.selected)}
							>{day}</button>
						)
					}

					return (
						<button
							onClick={() => {
								changeSelectedDate("date", new Date(current))
							}}
							key={index}
							className={twMerge("hover:bg-gray-100 dark:hover:bg-gray-600 block flex-1 border-0 rounded-lg cursor-pointer text-center dark:text-white font-semibold text-sm text-gray-900 leading-9",options?.theme?.text)}
						>{day}</button>
					)
				})}
			</div>
		</>
	)
}

export default Days
