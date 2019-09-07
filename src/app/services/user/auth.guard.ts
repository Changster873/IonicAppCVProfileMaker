import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import * as firebase from 'firebase';
import 'firebase/auth';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor (private router: Router, private auth: AuthService){}

  canActivate(): Promise<boolean> | boolean | Observable<boolean> {
    return new Promise((resolve, reject) => {
      if (this.auth.signedIn){
        console.log("Logged in: " + firebase.auth().currentUser.uid)
        resolve(true)
      }
      else {
        console.log(this.auth.signedIn)
        this.router.navigate(['/login'])
        resolve(false)
      }
    })
  }
}
