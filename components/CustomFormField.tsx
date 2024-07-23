"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Control, useForm } from "react-hook-form";
import "react-phone-number-input/style.css";
import { z } from "zod";
import { E164Number } from "libphonenumber-js/core";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import PhoneInput from "react-phone-number-input";

interface CustomProps {
	control: Control<any>;
	name: string;
	label?: string;
	placeholder?: string;
	iconSrc?: string;
	iconAlt?: string;
	disabled?: boolean;
	dateFormat?: string;
	showTimeSelect?: boolean;
	children?: React.ReactNode;
	renderSkeleton?: (field: any) => React.ReactNode;
	fieldType: FormFieldType;
}

export enum FormFieldType {
	INPUT = "input",
	TEXTAREA = "textarea",
	PHONE_INPUT = "phoneInput",
	CHECKBOX = "checkbox",
	DATE_PICKER = "datePicker",
	SELECT = "select",
	SKELETON = "skeleton",
}
const RenderField = ({ field, props }: { field: any; props: CustomProps }) => {
	const { control, fieldType, name, label, iconSrc, iconAlt, placeholder } =
		props;

	switch (fieldType) {
		case FormFieldType.INPUT:
			return (
				<div className="flex rounded-md border border-dark-500 bg-dark-400">
					{iconSrc && (
						<Image
							height={24}
							width={24}
							src={iconSrc}
							alt={iconAlt || "icon"}
							className="ml-2"
						/>
					)}
					<FormControl>
						<Input
							placeholder={placeholder}
							{...field}
							className="shad-input border-0"
						/>
					</FormControl>
				</div>
			);

		case FormFieldType.PHONE_INPUT:
			return (
				<FormControl>
					<PhoneInput
						defaultCountry="ET"
						placeholder="Enter phone number"
						international
						withCountryCallingCode
						value={field.value as E164Number | undefined}
						onChange={field.onChange}
						className="input-phone shad-input border-0"
					/>
				</FormControl>
			);
	}
	// return <Input type="text" placeholder="John Doe" {...field} />;
};
const CustomFormField = (props: CustomProps) => {
	const { control, fieldType, name, label } = props;
	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem className="flex-1">
					{fieldType !== FormFieldType.CHECKBOX && label && (
						<FormLabel>{label}</FormLabel>
					)}
					<RenderField field={field} props={props} />
					<FormMessage className="shad-error" />
				</FormItem>
			)}
		/>
	);
};

export default CustomFormField;
