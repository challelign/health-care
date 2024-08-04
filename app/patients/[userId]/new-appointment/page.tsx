import { AppointmentForm } from "@/components/forms/AppointmentForm";
import { getPatient } from "@/lib/actions/patient.actions";
import Image from "next/image";

export default async function NewAppointment({
	params: { userId },
}: SearchParamProps) {
	const patient = await getPatient(userId as string);
	return (
		<div className="flex h-screen max-h-screen">
			<section className="remove-scrollbar container">
				<div className="sub-container max-w-[850px] flex-1 justify-between">
					<Image
						src="/assets/icons/logo-full.svg"
						height={1000}
						width={1000}
						alt="patient"
						className="mb-12 h-10 w-fit"
					/>
					<AppointmentForm
						userId={userId}
						type="create"
						patientId={patient.$id}
					/>
					<p className="copyright mt-10 py-12">© 2024 Healthcare</p>
				</div>
			</section>
			<Image
				src="/assets/images/appointment-img.png"
				height={1000}
				width={1000}
				alt="patient"
				className="side-img max-w-[390px] bg-bottom "
			/>
		</div>
	);
}
