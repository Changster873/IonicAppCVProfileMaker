import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonInfiniteScroll, LoadingController, MenuController } from '@ionic/angular';
import * as firebase from 'firebase';
import { AuthService } from '../services/user/auth.service';
import { CvPage } from '../pages/cv/cv.page';
import { ProfileService } from '../services/user/profile.service';
import { MenuChangeEventDetail } from '@ionic/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit{

  data: any[] = []
  img: any[] = []
  user: any
  currentUser: firebase.User

  ngOnInit() {
    this.currentUser = this.auth.signedIn
    //loading screen
    this.loading.create({
      message: 'Please wait, loading feed...',
      duration: 3000,
    }).then(view => view.present())

    //retrieve data
    let index: number = 0
    firebase.firestore().collection('userProfile').get()
    .then(result => result.forEach(doc => {
      this.data[index] = doc.data()
      index += 1
      console.log('done for ' + doc.id)
    }))
  }

  constructor(
    private router: Router,
    private loading: LoadingController,
    private auth: AuthService,
    private profile: ProfileService,
    private menu: MenuController,
    ) {
    }

  navigate(url){
    if (url === '/cv') this.profile.selected = this.auth.signedIn
    this.router.navigate([url]);
  }

  set(data){
    this.profile.selected = data
    console.log('set selected to ' + data.email)
    this.router.navigate(['/cv'])
  }

}
