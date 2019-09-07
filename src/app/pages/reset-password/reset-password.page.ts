import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/user/auth.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import * as firebase from 'firebase/app';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {

  validations_form: FormGroup
  errorMessage: string = ''

  constructor(
    private router: Router,
    private auth: AuthService,
    private formBuilder: FormBuilder,
    private loading: LoadingController,
    ) { 
  }

  ngOnInit(): void {
    this.validations_form = this.formBuilder.group({
      email: new FormControl('', Validators.compose([Validators.required])),
    })
  }

  async reset(value){

    //creates the loading screen
    this.loading.create({
      message: 'Sending link to email...',
      duration: 1000,
    }).then((load) => load.present())

    //send the email to the user to reset password
    await this.auth.updatePassword(value).then((res) => {
      this.errorMessage = ''
      this.router.navigate(['/login'])
      this.validations_form.reset()
    }, (error) => {
      this.errorMessage = error.message
    })
  }

  navigate(url){
    this.router.navigate([url])
  }

}
