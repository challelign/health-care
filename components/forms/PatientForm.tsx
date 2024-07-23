"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form } from "@/components/ui/form";
import { UserFormValidation } from "@/lib/validation";
import { useState } from "react";
import CustomFormField, { FormFieldType } from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { useRouter } from "next/navigation";
import { stringify } from "querystring";

export function PatientForm() {
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
	// 1. Define your form.
	const form = useForm<z.infer<typeof UserFormValidation>>({
		resolver: zodResolver(UserFormValidation),
		defaultValues: {
			name: "",
			email: "",
			phone: "",
		},
	});

	// 2. Define a submit handler.
	const onSubmit = async (values: z.infer<typeof UserFormValidation>) => {
		setIsLoading(true);

		try {
			const userData = {
				name: values.name,
				email: values.email,
				phone: values.phone,
			};

			alert(stringify(userData));
			// const user = await createUser(userData);
			// if (user) {
			// 	router.push(`/patients/${user.$id}/register`);
			// }
		} catch (error) {
			console.log(error);
		}
		setIsLoading(false);
	};
	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
				<section className="mb-12 space-y-4">
					<h1 className="header">Hi there 👋</h1>
					<p className="text-dark-700">Schedule your first appointment</p>
				</section>

				<CustomFormField
					fieldType={FormFieldType.INPUT}
					control={form.control}
					name="name"
					label="Full Name"
					placeholder="John Doe"
					iconSrc="/assets/icons/user.svg"
					iconAlt="user"
				/>

				<CustomFormField
					fieldType={FormFieldType.INPUT}
					control={form.control}
					name="email"
					label="Email"
					placeholder="johndoe@cha.pro"
					iconSrc="/assets/icons/email.svg"
					iconAlt="email"
				/>
				<CustomFormField
					fieldType={FormFieldType.PHONE_INPUT}
					control={form.control}
					name="phone"
					label="Phone number"
					placeholder="(251) 915-2735"
				/>

				<SubmitButton isLoading={isLoading}> Get Started </SubmitButton>
			</form>
		</Form>
	);
}
