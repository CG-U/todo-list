import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  updatePassword,
} from "firebase/auth";

export const authCreateUserWithEmailAndPassword = async (
  email: string,
  password: string
) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const authSignInWithEmailAndPassword = async (
  email: string,
  password: string
) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const authSignInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  //   result.user;

  return result;
};

export const authSignOut = async () => {
  return auth.signOut();
};

export const authForgotPassword = async (email: string) => {
  return sendPasswordResetEmail(auth, email);
};

export const authPasswordUpdate = async (password: string) => {
  if (auth.currentUser === null) {
    throw { code: 403, message: "No user logged in" };
  }

  return updatePassword(auth.currentUser, password);
};

export const authSendEmailVerification = async () => {
  if (auth.currentUser === null) {
    throw { code: 403, message: "No user logged in" };
  }

  return sendEmailVerification(auth.currentUser, {
    url: `${window.location.origin}/home`,
  });
};
