import { Component, OnInit } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../service/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  email;
  senha;

  constructor(
    private nav: NavController,
    private toast: ToastController,
    private builder : FormBuilder,
    private service : LoginService
    ) { 

  }

  ngOnInit() {
    this.isUserLoggedIn();
    this.loginForm = this.builder.group({
      email: ['', [Validators.email, Validators.required]],
      senha: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  isUserLoggedIn(){
    this.service.isLoggedIn.subscribe(
      user => {
        if(user){
          this.nav.navigateForward('home');
          
        }
      }
    );
  }

  validar(){
    const user = this.loginForm.value;
    this.service.validar(user);
  }

  
}
