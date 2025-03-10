import React, { forwardRef, ReactElement, useContext, useEffect, useRef, ReactNode } from "react"
import { twMerge } from "tailwind-merge"
import { IOptions } from "../Options"
import defaultOptions from "../Options"
import DatePickerPopup from "./DatePickerPopup"
import DatePickerProvider, { DatePickerContext } from "./DatePickerProvider"

export interface IDatePickerProps {
	value?: Date
	children?: ReactElement | ReactNode
	options?: IOptions
	onChange?: (date: Date) => void
	show: boolean
	setShow: (show: boolean) => void
	classNames?: string
	selectedDateState?: [Date, (date: Date) => void]
}

const DatePicker = ({ value, children, options, onChange, classNames, show, setShow, selectedDateState }: IDatePickerProps) => (
	<div className={twMerge("w-full relative", classNames)}>
		<DatePickerProvider options={options} onChange={onChange} show={show} setShow={setShow} selectedDateState={selectedDateState}>
			<DatePickerMain value={value} options={options}>
				{children}
			</DatePickerMain>
		</DatePickerProvider>
	</div>
)

const DatePickerMain = ({ value, options: customOptions, children }: { value?: Date; options?: IOptions; children?: ReactElement }) => {
	const options = { ...defaultOptions, ...customOptions }
	const { setShow, show } = useContext(DatePickerContext)
	const InputRef = useRef<HTMLInputElement>(null)
	const DatePickerRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (!(InputRef?.current && DatePickerRef?.current)) return
			if (!InputRef.current.contains(event.target as Node) && !DatePickerRef.current.contains(event.target as Node)) {
				setShow(false)
			}
		}

		document.addEventListener("mousedown", (event) => handleClickOutside(event))

		return () => {
			document.removeEventListener("mousedown", (event) => handleClickOutside(event))
		}
	}, [DatePickerRef, InputRef, setShow])

	return (
		<>
			{children ? (
				children
			) : (
				<div className="relative">
					<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
						<CalendarIcon />
					</div>
					<Input
						ref={InputRef}
						idProp={options?.inputIdProp}
						valueProp={value}
						nameProp={options?.inputNameProp}
						placeholderProp={options?.inputPlaceholderProp}
						dateFormat={options?.inputDateFormatProp}
					/>
				</div>
			)}
			{show && <DatePickerPopup ref={DatePickerRef} />}
		</>
	)
}

const Input = forwardRef<HTMLInputElement, { idProp?: string; valueProp?: Date; nameProp?: string; placeholderProp?: string; dateFormat?: Intl.DateTimeFormatOptions }>((props, ref) => {
	const { setShow, selectedDate, showSelectedDate, options, getFormattedDate } = useContext(DatePickerContext)

	const nameProp = props.nameProp || "date"
	const idProp = props.idProp || nameProp
	const placeholderProp = props.placeholderProp || "Select Date"
	const valueProp = props.valueProp

	const format = props.dateFormat || null

	return (
		<input
			ref={ref}
			type="text"
			name={nameProp}
			id={idProp}
			className={twMerge(
				"pl-9 pr-2.5 py-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",
				options?.theme?.input
			)}
			placeholder={placeholderProp}
			value={valueProp ? getFormattedDate(valueProp, format) : selectedDate && showSelectedDate ? getFormattedDate(selectedDate, format) : ""}
			onFocus={() => setShow(true)}
			readOnly
		/>
	)
})
Input.displayName = "Input"

const CalendarIcon = () => {
	const { options } = useContext(DatePickerContext)
	return (
		<svg aria-hidden="true" className={twMerge("w-5 h-5 text-gray-500 dark:text-gray-400", options?.theme?.inputIcon)} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
			<path
				fillRule="evenodd"
				d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
				clipRule="evenodd"
			></path>
		</svg>
	)
}

export default DatePicker
