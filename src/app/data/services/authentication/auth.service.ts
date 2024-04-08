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

  /**
   * Create a new user with their e-mail address and password. The e-mail confirmation e-mail is then sent and the user's name is updated.
   * 
   * @param {string} name
   * @param {string} email
   * @param {string} password
   * @returns {Promise<UserCredential | null>} Returns the user credentials on success, otherwise null
   */
  async register(name: string, email: string, password: string): Promise<UserCredential | null> {
    try {
      const userCredential: UserCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      await sendEmailVerification(userCredential.user);
      await this.updateUserName(name);

      return userCredential;
    } catch (e) {
      console.log('Error: ', e);
      return null;
    }
  }

  /**
   * @param param0 The email address and password
   * @returns Returns true if the login was successful, otherwise false
   */
  async login({email, password}: any): Promise<UserCredential | null> {
    try {
      return await signInWithEmailAndPassword(this.auth, email, password);
    } catch (e) {
      console.log('Error: ', e);
      return null;
    }
  }

  /**
   * @param param0 The email address
   * @returns Returns true if email reset was successful, otherwise false
   */
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

  /**
   * @param {string} name 
   */
  async updateUserName(name: string): Promise<void> {
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
