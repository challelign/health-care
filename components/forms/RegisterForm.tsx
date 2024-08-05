"use client";

import { Form, FormControl } from "@/components/ui/form";
import { SelectItem } from "@/components/ui/select";
import {
	Doctors,
	GenderOptions,
	IdentificationTypes,
	PatientFormDefaultValues,
} from "@/constants";
import { createUser, registerPatient } from "@/lib/actions/patient.actions";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import CustomFormField, { FormFieldType } from "../CustomFormField";
import { FileUploader } from "../FileUploader";
import SubmitButton from "../SubmitButton";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { PatientFormValidation } from "@/lib/validation";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

export function RegisterForm({ user }: { user: User }) {
	const { toast } = useToast();

	// if (!user) return;
	const [isLoading, setIsLoading] = useState(false);
	const [isError, setIsError] = useState("");
	const router = useRouter();
	// 1. Define your form.
	const form = useForm<z.infer<typeof PatientFormValidation>>({
		resolver: zodResolver(PatientFormValidation),
		defaultValues: {
			...PatientFormDefaultValues,
			name: user.name!,
			email: user.email!,
			phone: user.phone!,
		},
	});

	// 2. Define a submit handler.
	const onSubmit = async (values: z.infer<typeof PatientFormValidation>) => {
		setIsLoading(true);

		// Store file info in form data as
		let formData;
		if (
			values.identificationDocument &&
			values.identificationDocument?.length > 0
		) {
			const blobFile = new Blob([values.identificationDocument[0]], {
				type: values.identificationDocument[0].type,
			});

			formData = new FormData();
			formData.append("blobFile", blobFile);
			formData.append("fileName", values.identificationDocument[0].name);
		}
		try {
			const patientData = {
				...values,
				userId: user.$id!,
				birthDate: new Date(values.birthDate)!,
				identificationDocument: values.identificationDocument
					? formData
					: undefined,
			};

			const patient = await registerPatient(patientData as RegisterUserParams);
			if (patient) {
				router.push(`/patients/${user.$id}/new-appointment`);
				toast({
					className: cn("bg-dark-700 text-dark-200"),
					title: "Personal Information",
					description:
						"You have register your personal information successfully",
					// action: <ToastAction altText="Try again">Try again</ToastAction>,
				});
			}
			// console.log("patient=>", patient);
		} catch (error: any) {
			if (error && error.message) {
				const errorMessage = error.message;
				toast({
					className: cn("bg-red-700"),
					variant: "destructive",
					title: "Validation Error",
					description: `${errorMessage}`,
					// action: <ToastAction altText="Try again">Try again</ToastAction>,
				});
				setIsError(errorMessage);
			} else {
				toast({
					className: cn("bg-red-700"),
					variant: "destructive",
					title: "Error creating patient",
					description: `Something went wrong`,
				});
				setIsError("Error creating patient");
			}
		}
		setIsLoading(false);
	};
	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-6">
				<section className="space-y-4">
					<h1 className="header">Welcome 👋</h1>
					<p className="text-dark-700">Let us know more about yourself.</p>
				</section>

				<section className="space-y-6">
					<div className="mb-9 space-y-1">
						<h2 className="sub-header">Personal Information</h2>
					</div>
				</section>

				<CustomFormField
					fieldType={FormFieldType.INPUT}
					control={form.control}
					name="name"
					label="Full Name"
					placeholder="Cha T"
					iconSrc="/assets/icons/user.svg"
					iconAlt="user"
				/>
				<div className="flex flex-col gap-6 xl:flex-row">
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
						placeholder="(251) 918-2735-70"
					/>
				</div>

				<div className="flex flex-col gap-6 xl:flex-row">
					<CustomFormField
						fieldType={FormFieldType.DATE_PICKER}
						control={form.control}
						name="birthDate"
						label="Date of Birth"
					/>
					<CustomFormField
						fieldType={FormFieldType.SKELETON}
						control={form.control}
						name="gender"
						label="Gender"
						renderSkeleton={(field) => (
							<FormControl>
								<RadioGroup
									className="flex h-11 gap-6 xl:justify-between"
									onValueChange={field.onChange}
									defaultValue={field.value}
								>
									{GenderOptions.map((option, i) => (
										<div key={option + i} className="radio-group">
											<RadioGroupItem value={option} id={option} />
											<Label htmlFor={option} className="cursor-pointer">
												{option}
											</Label>
										</div>
									))}
								</RadioGroup>
							</FormControl>
						)}
					/>
				</div>

				<div className="flex flex-col gap-6 xl:flex-row">
					<CustomFormField
						fieldType={FormFieldType.INPUT}
						control={form.control}
						name="address"
						label="Address"
						placeholder="14th Street Menelik  Road"
					/>
					<CustomFormField
						fieldType={FormFieldType.INPUT}
						control={form.control}
						name="occupation"
						label="Occupation"
						placeholder="Software Engineer"
					/>
				</div>
				<div className="flex flex-col gap-6 xl:flex-row">
					<CustomFormField
						fieldType={FormFieldType.INPUT}
						control={form.control}
						name="emergencyContactName"
						label="Emergency contact name"
						placeholder="Guardian`s name"
					/>
					<CustomFormField
						fieldType={FormFieldType.PHONE_INPUT}
						control={form.control}
						name="emergencyContactNumber"
						label="Emergency contact number"
						placeholder="(251) 912-452"
					/>
				</div>
				<section className="space-y-6">
					<div className="mb-9 space-y-1">
						<h2 className="sub-header">Medical Information</h2>
					</div>
				</section>
				<CustomFormField
					fieldType={FormFieldType.SELECT}
					control={form.control}
					name="primaryPhysician"
					label="Primary physician"
					placeholder="Select a physician"
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

				<div className="flex flex-col gap-6 xl:flex-row">
					<CustomFormField
						fieldType={FormFieldType.INPUT}
						control={form.control}
						name="insuranceProvider"
						label="Insurance provider"
						placeholder="Ethiopian Insurance Corporation"
					/>
					<CustomFormField
						fieldType={FormFieldType.INPUT}
						control={form.control}
						name="insurancePolicyNumber"
						label="Insurance policy number"
						placeholder="EFG45555"
					/>
				</div>

				<div className="flex flex-col gap-6 xl:flex-row">
					<CustomFormField
						fieldType={FormFieldType.TEXTAREA}
						control={form.control}
						name="allergies"
						label="Allergies"
						placeholder="Peanuts, penicillin, bee venom,"
					/>
					<CustomFormField
						fieldType={FormFieldType.TEXTAREA}
						control={form.control}
						name="currentMedication"
						label="Current medication (if any)"
						placeholder="Diclofenac 200mg, Paracetamol 500mg "
					/>
				</div>

				<div className="flex flex-col gap-6 xl:flex-row">
					<CustomFormField
						fieldType={FormFieldType.TEXTAREA}
						control={form.control}
						name="familyMedicalHistory"
						label="Family medical history"
						placeholder="bad brain cancer, heart disease"
					/>
					<CustomFormField
						fieldType={FormFieldType.TEXTAREA}
						control={form.control}
						name="pastMedicalHistory"
						label="Past medical history"
						placeholder="Appendectomy, Tonsillectomy"
					/>
				</div>
				<section className="space-y-6">
					<div className="mb-9 space-y-1">
						<h2 className="sub-header">Identification and Verification</h2>
					</div>
				</section>
				<CustomFormField
					fieldType={FormFieldType.SELECT}
					control={form.control}
					name="identificationType"
					label="Identification Type"
					placeholder="Select a Identification type"
				>
					{IdentificationTypes.map((type) => (
						<SelectItem key={type} value={type}>
							{type}
						</SelectItem>
					))}
				</CustomFormField>
				<CustomFormField
					fieldType={FormFieldType.INPUT}
					control={form.control}
					name="identificationNumber"
					label="Identification number"
					placeholder="1234567895"
				/>
				<CustomFormField
					fieldType={FormFieldType.SKELETON}
					control={form.control}
					name="identificationDocument"
					label="Scanned copy of identification document"
					renderSkeleton={(field) => (
						<FormControl>
							<FileUploader files={field.value} onChange={field.onChange} />
						</FormControl>
					)}
				/>
				<section className="space-y-6">
					<div className="mb-9 space-y-1">
						<h2 className="sub-header">Consent and Privacy</h2>
					</div>
				</section>
				<CustomFormField
					fieldType={FormFieldType.CHECKBOX}
					control={form.control}
					name="treatmentConsent"
					label="I consent to receive treatment for my health condition."
				/>

				<CustomFormField
					fieldType={FormFieldType.CHECKBOX}
					control={form.control}
					name="disclosureConsent"
					label="I consent to the use and disclosure of my health information for treatment purposes."
				/>

				<CustomFormField
					fieldType={FormFieldType.CHECKBOX}
					control={form.control}
					name="privacyConsent"
					label="I acknowledge that I have reviewed and agree to the privacy policy"
				/>
				{isError && (
					<section className="space-y-3">
						<div className="mb-9 space-y-1    border-b pb-2">
							<h2 className=" text-red-700">{isError}</h2>
						</div>
					</section>
				)}
				<SubmitButton isLoading={isLoading}> Get Started </SubmitButton>
			</form>
		</Form>
	);
}
