"use server";

import {
	APPOINTMENT_COLLECTION_ID,
	DATABASE_ID,
	databases,
} from "../appwrite.config";
import { parseStringify } from "../utils";
import { ID } from "node-appwrite";

export const createAppointment = async (
	appointment: CreateAppointmentParams
) => {
	try {
		const newAppointment = await databases.createDocument(
			DATABASE_ID!,
			APPOINTMENT_COLLECTION_ID!,
			ID.unique(),
			appointment
		);

		return parseStringify(newAppointment);
	} catch (error) {
		console.error("An error occurred while creating a new appointment:", error);
	}
};
