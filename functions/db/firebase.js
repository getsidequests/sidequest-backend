import admin from "firebase-admin";

/* Init once */
if (!admin.apps.length) {
  admin.initializeApp();
}

/* Firestore */
const db = admin.firestore();

/* Export */
export { admin, db };