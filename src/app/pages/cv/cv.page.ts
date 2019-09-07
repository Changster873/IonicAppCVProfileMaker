import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, MenuController } from '@ionic/angular';
import { HomePage } from 'src/app/home/home.page';
import { ProfileService } from 'src/app/services/user/profile.service';
import * as firebase from 'firebase';

@Component({
  selector: 'app-cv',
  templateUrl: './cv.page.html',
  styleUrls: ['./cv.page.scss'],
})
export class CvPage implements OnInit {
  
  public user: any
  public cvProfile: any

  constructor(
    private router: Router,
    private loading: LoadingController,
    private profile: ProfileService,
    ) { this.ngOnInit()}

  ngOnInit() {

    //loading screen
    this.loading.create({
      message: 'Loading profile...',
      duration: 1500,
    }).then(res => {
      res.present()
    })

    this.user = this.profile.selected

    var cvDatabase = firebase.firestore().doc(`cvProfile/${this.user.uid}`)
    
    cvDatabase.get()
    .then(res => {
      if (res.data() == undefined){
        console.log('new cv profile: ' + this.user.uid)
        cvDatabase.set({
          employment: '',
          school: '',
          description: ''
        })
        this.ngOnInit() //refresh page
      }
    })

    this.cvProfile = cvDatabase
  }

  navigate(url){
    this.router.navigate([url])
  }

  async updateSchool(){
    if (this.cvProfile.id != this.user.uid){
      console.log('not own profile, cannot edit')
      return
    }
    else {
      console.log('can edit')
    }
  }

}
