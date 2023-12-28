import {Injectable} from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  UserCredential,
  User,
  sendEmailVerification,
  updateProfile,
} from "@angular/fire/auth";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private auth: Auth
  ) {
  }

  async register(name: string, email: string, password: string): Promise<UserCredential | null> {
    console.log("register");
    try {
      console.log("createUserWithEmailAndPassword");
      const userCredential: UserCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      console.log("sendEmailVerification");
      await sendEmailVerification(userCredential.user);
      await this.updateUserName(name);
      console.log(userCredential);
      return userCredential;
    } catch (e) {
      console.log('Error: ', e);
      return null;
    }
  }

  async login({email, password}: any): Promise<UserCredential | null> {
    try {
      return await signInWithEmailAndPassword(this.auth, email, password);
    } catch (e) {
      console.log('Error: ', e);
      return null;
    }
  }

  async resetPassword({email}: any): Promise<boolean> {
    try {
      await sendPasswordResetEmail(this.auth, email);
      return true;
    } catch (e) {
      console.log('Error: ', e);
      return false;
    }
  }

  async logout(): Promise<void> {
    try {
      return await signOut(this.auth);
    } catch (e) {
      console.log('Error: ', e);
    }
  }

  async updateUserName(name: string): Promise<void> {
    console.log("updateUserName");
    try {
      const currentUser: User | null = this.getCurrentUser();
      if (currentUser) {
        await updateProfile(currentUser, {displayName: name.trim()}).catch(
          (err) => console.log(err)
        );
      }
    } catch (e) {
      console.log('Error: ', e);
    }
  }

  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  getCurrentUserId(): string | undefined {
    return this.auth.currentUser?.uid;
  }
}
