import { Injectable } from '@angular/core';

import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public signedIn: firebase.User = firebase.auth().currentUser

  constructor() {
  }

  async loginUser (value): Promise<firebase.auth.UserCredential> {
    const log = await firebase.auth().signInWithEmailAndPassword(value.email, value.password);
    this.signedIn = firebase.auth().currentUser
    console.log('signing in...')
    return log;
  }

  signupUser(value): Promise<any> {
    var email = value.email
    var firstName = ''
    var lastName = ''
    var birthDate = ''
    var photo: any = ''
    var cv: any = ''
    var cv_likes: number = 0
    var cv_comments: any = ''
    var employment: any = ''
    var school: any = ''
    var description: any = ''
    return firebase.auth()
    .createUserWithEmailAndPassword(value.email, value.password)
    .then((newUser: firebase.auth.UserCredential) => {
      firebase.firestore().doc(`/userProfile/${newUser.user.uid}`).set({ email, firstName, lastName, birthDate, photo, cv, cv_likes, cv_comments})
      firebase.firestore().doc(`cvProfile/${newUser.user.uid}`).set({employment, school, description})
    })
    .catch((err) => {
      console.error(err)
      throw new Error(err)
    });
  }

  async logoutUser(): Promise<void>{
    this.signedIn = null
    console.log('signing out... now: ' + this.signedIn)
    return await firebase.auth().signOut();
  }

  getCurrentUser() {
    return firebase.auth().currentUser;
  }

  async updatePassword(value): Promise<any>{
    console.log('sending email...')
    return firebase.auth().sendPasswordResetEmail(value.email);
  }
}
