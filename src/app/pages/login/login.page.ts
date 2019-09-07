import { Component, OnInit, Pipe } from '@angular/core';
import { NavController, LoadingController, AlertController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import { AuthService } from '../../services/user/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit{

  validations_form: FormGroup;
  errorMessage: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private loading: LoadingController,
    private alertCtrl: AlertController,
  ) {
  }

  ngOnInit(): void {
    //form requires email and password from the user
    this.validations_form = this.formBuilder.group({
      email: new FormControl('',Validators.compose([Validators.required])),
      password: new FormControl('',Validators.compose([Validators.minLength(5), Validators.required]))
    })
  }

  //sign in the user with their details
  async loginUser(value) {

    //create the loading screen
    this.loading.create({
      message: 'Logging in...',
      duration: 1000,
    }).then((load) => load.present())

    //actually log in the user
    await this.authService.loginUser(value).then(res => {
      this.errorMessage = '';
      this.alertCtrl.create({
        message: 'Successful!',
        buttons: [
          {
            text: 'OK',
            handler: data => {
              this.router.navigate(['/profile'])
              this.validations_form.reset();
            }
          }
        ],
      }).then(load => load.present())
    }, (error) => {
      //log an error message if log in fails
      this.alertCtrl.create({
        message: error.message,
        buttons: [
          {
            text: 'OK',
          }
        ],
      }).then(load => load.present())
      this.errorMessage = error.message;
    })
  }

  navigate(url){
    this.router.navigate([url])
  }
}
