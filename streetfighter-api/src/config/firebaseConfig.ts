import { initializeApp, cert, getApps, AppOptions, App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import fs from "fs";
import path from "path";
import type { ServiceAccount } from "firebase-admin";

type SA = ServiceAccount & { project_id?: string; projectId?: string };

function loadServiceAccountFromFile(): SA | null {
  const envPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
  if (envPath) {
    const p = path.resolve(envPath);
    if (fs.existsSync(p)) {
      return JSON.parse(fs.readFileSync(p, "utf8"));
    }
  }

  const fallback = path.resolve(__dirname, "../../bed-capstone-project-52df4-firebase-adminsdk-fbsvc-baaa1fbb95.json");
  if (fs.existsSync(fallback)) {
    return JSON.parse(fs.readFileSync(fallback, "utf8"));
  }

  return null;
}

const fileSA = loadServiceAccountFromFile();

const getFirebaseConfig = (): AppOptions => {
  if (fileSA) {
    const projectId = fileSA.project_id || fileSA.projectId || process.env.FIREBASE_PROJECT_ID;
    return {
      credential: cert(fileSA as ServiceAccount),
      projectId,
    };
  }

  const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } = process.env;
  if (!FIREBASE_PROJECT_ID || !FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY) {
    throw new Error(
      "Missing Firebase configuration. Provide a JSON via GOOGLE_APPLICATION_CREDENTIALS/FIREBASE_SERVICE_ACCOUNT_PATH or set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY in env."
    );
  }

  const serviceAccount: ServiceAccount = {
    projectId: FIREBASE_PROJECT_ID,
    clientEmail: FIREBASE_CLIENT_EMAIL,
    privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  };

  return {
    credential: cert(serviceAccount),
    projectId: FIREBASE_PROJECT_ID,
  };
};

const app: App = getApps().length > 0 ? getApps()[0] : initializeApp(getFirebaseConfig());

export const auth = getAuth(app);
export const db = getFirestore(app);
