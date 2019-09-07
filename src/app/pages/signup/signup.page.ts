import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/user/auth.service';
import { LoadingController } from '@ionic/angular';
import { ProfileService } from 'src/app/services/user/profile.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  validations_form: FormGroup
  errorMessage: string = ''

  constructor(
    private router: Router,
    private auth: AuthService,
    private formBuilder: FormBuilder,
    private loading: LoadingController,
    private profile: ProfileService,
      ) { 
  }

  ngOnInit(): void {
    this.validations_form = this.formBuilder.group({
      email: new FormControl('', Validators.compose([Validators.required])),
      password: new FormControl('', Validators.compose([Validators.required])),
      confirm_password: new FormControl('', Validators.compose([Validators.required]))
    })
  }

  async create(value){
    if (value.confirm_password !== value.password){
      this.errorMessage = 'Password must match...'
      return
    }

    //create loading screen
    this.loading.create({
      message: 'Creating account...',
      duration: 1000,
    }).then((load) => load.present())

    //actually sign up user
    await this.auth.signupUser(value).then((res) => {
      this.errorMessage = ''
      this.router.navigate(['/home'])
      this.validations_form.reset();
    }, (error) => {
      this.errorMessage = error.message
    })
  }

  navigate(url){
    this.router.navigate([url])
  }

}
