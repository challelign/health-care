import * as sdk from "node-appwrite";
export const {
  NEXT_PUBLIC_ENDPOINT: ENDPOINT,
  PROJECT_ID,
  API_KEY,
  DATABASE_ID,
  PATIENT_COLLECTION_ID,
  DOCTOR_COLLECTION_ID,
  APPOINTMENT_COLLECTION_ID,
  NEXT_PUBLIC_BUCKET_ID: BUCKET_ID,
} = process.env;

// Function to check required environment variables
const checkEnvVariables = () => {
  const requiredVars = [
    { name: "ENDPOINT", value: ENDPOINT },
    { name: "PROJECT_ID", value: PROJECT_ID },
    { name: "API_KEY", value: API_KEY },
    { name: "DATABASE_ID", value: DATABASE_ID },
    { name: "PATIENT_COLLECTION_ID", value: PATIENT_COLLECTION_ID },
    { name: "DOCTOR_COLLECTION_ID", value: DOCTOR_COLLECTION_ID },
    { name: "APPOINTMENT_COLLECTION_ID", value: APPOINTMENT_COLLECTION_ID },
    { name: "BUCKET_ID", value: BUCKET_ID },
  ];

  requiredVars.forEach(({ name, value }) => {
    if (!value) {
      throw new Error(`Missing environment variable: ${name}`);
    }
  });
};
// Check environment variables
checkEnvVariables();
const client = new sdk.Client();

client.setEndpoint(ENDPOINT!).setProject(PROJECT_ID!).setKey(API_KEY!);

export const databases = new sdk.Databases(client);
export const users = new sdk.Users(client);
export const messaging = new sdk.Messaging(client);
export const storage = new sdk.Storage(client);
