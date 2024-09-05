"use server";

import { Appointment } from "@/types/appwrite.types";
import {
  APPOINTMENT_COLLECTION_ID,
  DATABASE_ID,
  databases,
} from "../appwrite.config";
import { parseStringify } from "../utils";
import { ID, Query } from "node-appwrite";
import { revalidatePath } from "next/cache";

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
export const getAppointment = async (appointmentId: string) => {
  try {
    const appointment = await databases.getDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId
    );
    return parseStringify(appointment);
  } catch (error: any) {
    console.error(error);
    throw new Error(error);
  }
};

export const getRecentAppointmentList = async () => {
  try {
    const appointments = await databases.listDocuments(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      [Query.orderDesc("$createdAt")]
    );
    const initialCount = {
      scheduledCount: 0,
      pendingCount: 0,
      cancelledCount: 0,
    };
    if (!appointments) {
      throw new Error("Appointment not found");
    }

    const counts = (appointments.documents as Appointment[]).reduce(
      (acc, appointment) => {
        if (appointment.status === "scheduled") {
          acc.scheduledCount += 1;
        } else if (appointment.status === "pending") {
          acc.pendingCount += 1;
        } else if (appointment.status === "cancelled") {
          acc.cancelledCount += 1;
        }

        return acc;
      },
      initialCount
    );
    const data = {
      totalCount: appointments.total,
      ...counts,
      documents: appointments.documents,
    };
    return parseStringify(data);
  } catch (error: any) {
    console.error(error);
    throw new Error(error);
  }
};

export const updateAppointment = async ({
  userId,
  appointmentId,
  type,
  appointment,
}: UpdateAppointmentParams) => {
  try {
    const updatedAppointment = await databases.updateDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId,
      appointment
    );
    console.log("[updateAppointment]", updateAppointment);
    if (!updateAppointment) {
      throw new Error("Appointment not found");
    }
    // SMS notification
    revalidatePath("/admin");
    return parseStringify(updatedAppointment);
  } catch (error: any) {
    console.error(error);
    throw new Error(error);
  }
};
