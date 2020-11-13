import { Injectable, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { AngularFirestore } from '@angular/fire/firestore';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class FbserviceService {
  user: any;
  fetchedNotes: any;
  pleaseWait = false;
  isuserVerified: boolean;
  constructor(
    public Auth: AngularFireAuth,
    private db: AngularFirestore,
    public route: Router
  ) {
    Auth.onAuthStateChanged((user) => {
      this.user = user;
      if (user) {
        if(user.emailVerified){
          this.isuserVerified = true;
        }
        else{
          this.isuserVerified = true;
        }
        this.route.navigate(['home']);
        this.db
          .collection(user.uid)
          .valueChanges()
          .subscribe((dt) => {
            this.fetchedNotes = dt;
          });
      }
    });
  }
  Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
  });
  LoginWithGooogle: any = async () => {
    Swal.fire({
      title: 'logging you in',
      text: 'Please wait',
      imageUrl: '../../assets/img/Spinner-1s-200px.gif',
      showConfirmButton: false,
      allowOutsideClick: false,
    });
    const provider = new firebase.default.auth.GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    this.Auth.signInWithPopup(provider)
      .then((res) => {
        Swal.close();
        Swal.fire('Good to see you', 'Login Success', 'success');
      })
      .catch((e) => {
        console.error(e);
        Swal.close();
        Swal.fire('Oops...', 'Login Failed', 'error');
      });
  };
  registerWithMailPass = ({ Name, Mail, pass }) => {
    Swal.fire({
      title: 'logging you in',
      text: 'Please wait',
      imageUrl: '../../assets/img/Spinner-1s-200px.gif',
      showConfirmButton: false,
      allowOutsideClick: false,
    });
    this.Auth.createUserWithEmailAndPassword(Mail, pass)
      .then((value) => {
        if(value.user){
          value.user.updateProfile({
            displayName: Name,
          })
        }
        console.log('Success!', value);
        Swal.close();
        Swal.fire('Good to see you', 'Login Success', 'success');
      })
      .catch((err) => {
        console.log('Something went wrong:', err.message);
        Swal.close();
        Swal.fire('Oops...', 'Login Failed', 'error');
      });
  }
  resendVerificationMail =()=>{
    this.Auth.currentUser.then(user=>{
      if(!user.emailVerified){
        user.sendEmailVerification().then(rs=>{
          this.Toast.fire({
            icon: 'success',
            title: 'Signed in successfully'
          });
        });
      }
    })
  }
  LoginWithEmailPass=({Mail,pass})=>{
    this.Auth.signInWithEmailAndPassword(Mail,pass).then(res=>{
      Swal.fire('Good to see you', 'Login Success', 'success');
    })
    .catch(e=>{Swal.fire({
      icon:"error",
      title:"login failed",
      html: e.message
    }); } );
  }
}
