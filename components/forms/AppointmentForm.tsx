"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form } from "@/components/ui/form";
import { Doctors } from "@/constants";
import { createAppointment } from "@/lib/actions/appointment.actions";
import { getAppointmentSchema } from "@/lib/validation";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import CustomFormField, { FormFieldType } from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { SelectItem } from "../ui/select";
import { useToast } from "../ui/use-toast";

interface AppointmentFormProps {
	userId: string;
	type: "create" | "cancel" | "schedule";
	patientId: string;
}

export function AppointmentForm({
	userId,
	type,
	patientId,
}: AppointmentFormProps) {
	const { toast } = useToast();

	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
	const AppointmentFormValidation = getAppointmentSchema(type);
	const form = useForm<z.infer<typeof AppointmentFormValidation>>({
		resolver: zodResolver(AppointmentFormValidation),
		defaultValues: {
			schedule: new Date(),
			reason: "",
			primaryPhysician: "",
			note: "",
			cancellationReason: "",
		},
	});
	const onSubmit = async (
		values: z.infer<typeof AppointmentFormValidation>
	) => {
		setIsLoading(true);

		let status;
		switch (type) {
			case "schedule":
				status = "scheduled";
				break;
			case "cancel":
				status = "cancelled";
				break;
			default:
				status = "pending";
				break;
		}

		try {
			if (type === "create" && patientId) {
				const appointmentData = {
					userId,
					patient: patientId,
					primaryPhysician: values.primaryPhysician,
					schedule: new Date(values.schedule),
					reason: values.reason!,
					note: values.note,
					status: status as Status,
				};
				const appointment = await createAppointment(appointmentData);
				if (appointment) {
					form.reset();
					router.push(
						`/patients/${userId}/new-appointment/success?appointmentId=${appointment.$id}`
					);
					toast({
						title: "New Appointment",
						description: `You have set new appointment successfully`,
						// action: <ToastAction altText="Try again">Try again</ToastAction>,
					});
				}
			}
		} catch (error: any) {
			console.log(error);
			toast({
				variant: "destructive",
				title: "Validation Error",
				description: `${error.message}`,
				// action: <ToastAction altText="Try again">Try again</ToastAction>,
			});
		}
		setIsLoading(false);
	};
	let buttonLabel;
	switch (type) {
		case "cancel":
			buttonLabel = "Cancel Appointment";
			break;
		case "create":
			buttonLabel = "Create Appointment";
			break;
		case "schedule":
			buttonLabel = "Schedule Appointment";
			break;
		default:
			break;
	}
	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
				<section className="mb-12 space-y-4">
					<h1 className="header">New Appointment</h1>
					<p className="text-dark-700">
						Request a new appointment in 10 seconds{" "}
					</p>
				</section>
				{type !== "cancel" && (
					<>
						<CustomFormField
							fieldType={FormFieldType.SELECT}
							control={form.control}
							name="primaryPhysician"
							label="Doctor"
							placeholder="Select a doctor"
						>
							{Doctors.map((doctor, i) => (
								<SelectItem key={doctor.name + i} value={doctor.name}>
									<div className="flex cursor-pointer items-center gap-2">
										<Image
											src={doctor.image}
											width={32}
											height={32}
											alt="doctor"
											className="rounded-full border border-dark-500"
										/>
										<p>{doctor.name}</p>
									</div>
								</SelectItem>
							))}
						</CustomFormField>
						<CustomFormField
							fieldType={FormFieldType.DATE_PICKER}
							control={form.control}
							name="schedule"
							label="Expected appointment date"
							showTimeSelect
							dateFormat="MM/dd/yyyy - h:mm aa"
						/>
						<div className="flex flex-col gap-6 xl:flex-row">
							<CustomFormField
								fieldType={FormFieldType.TEXTAREA}
								control={form.control}
								name="reason"
								label="Reason for appointment"
								placeholder="Enter reason for appointment,"
							/>
							<CustomFormField
								fieldType={FormFieldType.TEXTAREA}
								control={form.control}
								name="note"
								label="Notes"
								placeholder="Enter notes "
							/>
						</div>{" "}
					</>
				)}
				{type === "cancel" && (
					<CustomFormField
						fieldType={FormFieldType.TEXTAREA}
						control={form.control}
						name="cancellationReason"
						label="Reason for cancellation"
						placeholder="Enter reason for cancellation,"
					/>
				)}
				<SubmitButton
					isLoading={isLoading}
					className={`${
						type === "cancel" ? "shad-danger-btn" : "shad-primary-btn "
					} w-full`}
				>
					{buttonLabel}
				</SubmitButton>
			</form>
		</Form>
	);
}
