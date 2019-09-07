import { Component } from '@angular/core';
import { Plugins } from '@capacitor/core';
import * as firebase from 'firebase/app';
import { firebaseConfig } from './credentials';

const { SplashScreen, StatusBar } = Plugins;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  constructor(
  ) {
    firebase.initializeApp(firebaseConfig);
    this.initializeApp();
  }

  initializeApp() {
    SplashScreen.hide().catch((err) => {
      console.error(err);
    })

    StatusBar.hide().catch((err) => {
      console.error(err);
    })
  }
}
