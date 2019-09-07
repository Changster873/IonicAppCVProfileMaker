import { Injectable } from '@angular/core';

import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  public userProfile: firebase.firestore.DocumentReference;
  public cvProfile: firebase.firestore.DocumentReference
  public currentUser: firebase.User;
  public selected: any

  constructor(private auth: AuthService) {
  }

  reloadProfile(){
    this.currentUser = this.auth.signedIn

    if (this.currentUser != undefined){
      console.log('get for: ' + this.currentUser.uid)
      this.userProfile = firebase.firestore().doc(`userProfile/${ this.currentUser.uid}`)
      
      this.userProfile.get().then(user => {
        if (user.data() == undefined){
          console.log('new for: ' + this.currentUser.uid)
          this.userProfile.set({
            firstName:'',
            lastName:'',
            birthDate:'',
            email:this.currentUser.email,
            photo:'',
            cv: '',
            cv_likes: '',
            cv_comments: '',
          })
        }
      })

      this.cvProfile = firebase.firestore().doc(`cvProfile/${ this.currentUser.uid}`)

      this.cvProfile.get().then(d => {
        if (d.data() == undefined){
          console.log('new cv profile for ' + this.currentUser.uid)
          this.cvProfile.set({
            employment: '',
            school: '',
            description:'',
          })
        }
      })
    }
  }

  getUserProfile(): firebase.firestore.DocumentReference {
    this.reloadProfile()
    return this.userProfile;
  }

  updateName(firstName: string, lastName: string): Promise<any> {
    return this.userProfile.update({ firstName, lastName });
  }

  updateDOB(birthDate: string): Promise<any> {
    return this.userProfile.update ({ birthDate })
  }

  updateDes(description: string): Promise<any> {
    return this.cvProfile.update ({description })
  }

  updateSchool(school: string): Promise<any>{
    return this.cvProfile.update ({ school })
  }

  updateWork(work: string): Promise<any> {
    return this.cvProfile.update ({ work })
  }

  updateImage(photo: any): Promise<any> {
    return this.userProfile.update ({ photo })
  }

  updateEmail(nemail: string, password: string): Promise<any> {
    const cred: firebase.auth.AuthCredential = firebase.auth.EmailAuthProvider.credential(
      this.currentUser.email,
      password
    )

    return this.currentUser.reauthenticateWithCredential(cred)
    .then(() => {
      this.currentUser.updateEmail(nemail).then(() => {
        this.userProfile.update({ email: nemail})
      })
    }).catch(error => {
      console.error(error)
    })
  }

  updatePassword(newPass: string, oldPass: string): Promise<any> {
    const cred: firebase.auth.AuthCredential = firebase.auth.EmailAuthProvider.credential(
      this.currentUser.email,
      oldPass
    )

    return this.currentUser.reauthenticateWithCredential(cred)
    .then(() => {
      this.currentUser.updatePassword(newPass).then(() => {
        console.log('Password Changed')
      })
    }).catch((err) => {
      console.error(err)
    })
  }
}
