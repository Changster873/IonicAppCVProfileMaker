import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/user/auth.service';
import { MenuController, AlertController, IonRefresherContent, LoadingController, PickerController } from '@ionic/angular';
import { ProfileService } from 'src/app/services/user/profile.service';
import { Plugins, CameraResultType, CameraSource } from '@capacitor/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import * as firebase from 'firebase';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  public userProfile: any;
  photo: SafeResourceUrl;

  constructor(
    private router: Router,
    private auth: AuthService,
    private menu: MenuController,
    private alertCtrl: AlertController,
    private profile: ProfileService,
    private loading: LoadingController,
    private sanitizer: DomSanitizer,
    private picker: PickerController,
    ) {
     }

  ngOnInit() {
    this.userProfile = this.auth.signedIn
    this.profile.getUserProfile()
    .get()
    .then( user => {
      this.userProfile = user.data()
    })
    //create the loading screen
    this.loading.create({
      message: 'Loading information...',
      duration: 3000,
    }).then((load) => load.present())
    //if laptop, load laptop's camera
    defineCustomElements(window);
  }

  navigate(url){
    if (url === '/cv') this.profile.selected = this.auth.signedIn
    this.router.navigate([url]);
  }

  logout(){
    this.auth.logoutUser();
    this.router.navigateByUrl('/login')
  }

  openFirst() {
    this.menu.enable(true, 'first');
    this.menu.open('first');
  }

  openEnd() {
    this.menu.open('end');
  }

  openCustom() {
    this.menu.enable(true, 'custom');
    this.menu.open('custom');
  }

  async updateName(): Promise<void> {
    console.log('update name for: ' + this.auth.signedIn.uid)
    this.userProfile = this.auth.signedIn
    this.ngOnInit() //re-render
    const alert = await this.alertCtrl.create({
      subHeader: 'Your first and last name',
      inputs: [
        {
          type: 'text',
          name: 'firstName',
          placeholder: 'Your first name',
          value: this.userProfile.firstName,
        },
        {
          type: 'text',
          name: 'lastName',
          placeholder: 'Your last name',
          value: this.userProfile.lastName,
        },
      ],
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Save',
          handler: data => {
            this.profile.updateName(data.firstName, data.lastName)
            console.log('Name changed!')
            //create the loading screen
            this.loading.create({
              message: 'Updating name...',
              duration: 1500,
            }).then((load) => load.present())
            this.alertCtrl.create({
              message: 'Name Changed!',
              buttons: [
                {
                  text: 'OK',
                }
              ],
            }).then(load => load.present())
            this.ngOnInit() //re-render
          }
        },
      ]
    })
    await alert.present();
  }

  updateDOB(birthDate: string): void {
    console.log('update dob for: ' + this.auth.signedIn.uid)
    if (birthDate === undefined) {
      return;
    }
    //create the loading screen
    this.loading.create({
      message: 'Updating DoB...',
      duration: 1500,
    }).then((load) => load.present())
    console.log('DOB Changed!')
    this.alertCtrl.create({
      message: 'DoB Changed!',
      buttons: [
        {
          text: 'OK',
        }
      ],
    }).then(load => load.present())
    this.profile.updateDOB(birthDate);
  }

  async updateEmail(): Promise<void>{
    console.log('update email for: ' + this.auth.signedIn.uid)
    const alert = await this.alertCtrl.create({
      subHeader: "Change Email Here",
      inputs: [
        {
          type: 'text',
          name: 'nemail',
          placeholder: 'Your new email'
        },
        {
          name: 'password',
          placeholder: 'Your password',
          type: 'password'
        },
      ],
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Save',
          handler: data => {
            this.profile.updateEmail(data.nemail, data.password)
            .then(() => {
              console.log('Email Changed!')
              //create the loading screen
              this.loading.create({
                message: 'Updating email...',
                duration: 1500,
              }).then((load) => load.present())
              this.alertCtrl.create({
                message: 'Email Changed!',
                buttons: [
                  {
                    text: 'OK',
                    handler: data => {
                      this.ngOnInit()
                    }
                  }
                ],
              }).then(load => load.present())
            })
            .catch(error => {
              console.error(error.message)
            })
          }
        }
      ],
    })
    await alert.present()
  }

  async updatePassword(): Promise<void> {
    console.log('update password for: ' + this.auth.signedIn.uid)
    const alert = await this.alertCtrl.create({
      subHeader: 'Change password',
      inputs: [
        {
          name: 'newPass',
          placeholder: 'New password',
          type: 'password' 
        },
        {
          name: 'oldPass',
          placeholder: 'Old password',
          type: 'password'
        },
      ],
      buttons: [
        { text: 'Cancel' },
        {
          text: 'Save',
          handler: data => {
            this.profile.updatePassword(
              data.newPass,
              data.oldPass
            ).then(() => {
              console.log('Password Changed!')
              //create the loading screen
              this.loading.create({
                message: 'Updating password...',
                duration: 1500,
              }).then((load) => load.present())
              this.alertCtrl.create({
                message: 'Password Changed!',
                buttons: [
                  {
                    text: 'OK',
                  }
                ],
              }).then(load => load.present())
              this.ngOnInit()
            }).catch(err => {
              console.error(err.message)
            })
          },
        },
      ],
    });
    await alert.present();
  }

  async takePicture() {
    const image = await Plugins.Camera.getPhoto({
      quality: 100,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera
    });

    if (image == null || image == undefined){
      return
    }

    this.profile.updateImage(image)

    this.photo = this.sanitizer.bypassSecurityTrustResourceUrl(image && (image.dataUrl));
    this.ngOnInit()
  }
}
