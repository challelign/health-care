"use server";

import {
	APPOINTMENT_COLLECTION_ID,
	BUCKET_ID,
	DATABASE_ID,
	databases,
	ENDPOINT,
	PATIENT_COLLECTION_ID,
	PROJECT_ID,
	storage,
	users,
} from "../appwrite.config";
import { parseStringify } from "../utils";
// import { ID, Query } from "node-appwrite";
// import { InputFile } from "node-appwrite/file";
import { ID, InputFile, Query } from "node-appwrite";

export const createUser = async (user: CreateUserParams) => {
	console.log(user);

	try {
		const newUser = await users.create(
			ID.unique(),
			user.email,
			user.phone,
			undefined,
			user.name
		);
		// console.log(newUser);
		return parseStringify(newUser);
	} catch (error: any) {
		console.log(error);
		if (error && error.code === "409") {
			const documents = await users.list([Query.equal("email", [user.email])]);

			return documents?.users[0];
		}
		console.error("An error occurred while creating a new user:", error);
	}
};

export const getUser = async (userId: string) => {
	try {
		const user = await users.get(userId);
		return parseStringify(user);
	} catch (error) {
		console.log(error);
	}
};

/* export const registerPatient = async ({
	identificationDocument,
	...patient
}: RegisterUserParams) => {
	// console.log(patient.gender);
	try {
		let file;
		if (identificationDocument) {
			const inputFile =
				identificationDocument &&
				InputFile.fromBuffer(
					identificationDocument?.get("blobFile") as Blob,
					identificationDocument?.get("fileName") as string
				);

			file = await storage.createFile(BUCKET_ID!, ID.unique(), inputFile);
		}
		// console.log("identificationDocumentId &&&& URL", {
		// 	identificationDocumentId: file?.$id || null,
		// 	identificationDocumentUrl: `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file?.$id}/view??project=${PROJECT_ID}`,
		// });
		const newPatient = await databases.createDocument(
			DATABASE_ID!,
			// PATIENT_COLLECTION_ID!,
			APPOINTMENT_COLLECTION_ID!,
			ID.unique(),
			{
				identificationDocumentId: file?.$id || null,
				identificationDocumentUrl: `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file?.$id}/view??project=${PROJECT_ID}`,
				...patient,
			}
		);

		return parseStringify(newPatient);
	} catch (error) {
		console.log(error);
	}
};
 */

// REGISTER PATIENT
export const registerPatient = async ({
	identificationDocument,
	...patient
}: RegisterUserParams) => {
	try {
		// Upload file ->  // https://appwrite.io/docs/references/cloud/client-web/storage#createFile
		let file;
		if (identificationDocument) {
			const inputFile =
				identificationDocument &&
				InputFile.fromBlob(
					identificationDocument?.get("blobFile") as Blob,
					identificationDocument?.get("fileName") as string
				);

			console.log("inputFile", inputFile);
			file = await storage.createFile(BUCKET_ID!, ID.unique(), inputFile);
		}

		// console.log("identificationDocumentId &&&& URL", {
		// 	identificationDocumentId: file?.$id || null,
		// 	identificationDocumentUrl: `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file?.$id}/view??project=${PROJECT_ID}`,
		// });
		// Create new patient document -> https://appwrite.io/docs/references/cloud/server-nodejs/databases#createDocument
		const newPatient = await databases.createDocument(
			DATABASE_ID!,
			PATIENT_COLLECTION_ID!,
			ID.unique(),
			{
				identificationDocumentId: file?.$id ? file.$id : null,
				identificationDocumentUrl: file?.$id
					? `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file.$id}/view??project=${PROJECT_ID}`
					: null,
				...patient,
			}
		);

		return parseStringify(newPatient);
	} catch (error) {
		console.error("An error occurred while creating a new patient:", error);
	}
};
