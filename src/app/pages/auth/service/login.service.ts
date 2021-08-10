import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { NavController, ToastController } from '@ionic/angular';
import { User } from 'firebase';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  isLoggedIn: Observable<User>;

  constructor(
    private nav: NavController,
    private toast: ToastController,
    public auth: AngularFireAuth
  ) { 
    this.isLoggedIn = auth.authState;
    
  }


  validar(user){
    this.auth.signInWithEmailAndPassword(user.email, user.senha)
    .then(
      () => 
      {
        this.nav.navigateForward('home')
      }
      )
    .catch(() => this.mostrarErro());
  }

  private async mostrarErro(){
    const msg = await this.toast.create({
      message: 'Dados Incorretos',
      duration: 2000
    });

    msg.present();
  }

  createUser(user){
    this.auth.createUserWithEmailAndPassword(user.email, user.senha)
    .then(
      () => 
      {
        this.UpdateProfile(user.nome);
        this.validar(user)
        this.nav.navigateBack('auth');
      }
        
    );
  }

  async UpdateProfile(displayName: string) {
    const profile = {
        displayName: displayName,
    }
    return (await this.auth.currentUser).updateProfile(profile);
  }

  recoverPass(email){
    this.auth.sendPasswordResetEmail(email)
    .then(() => {
      this.nav.navigateBack('auth');
    }).catch(error =>{
      console.log(error);
    });
  }

  logout(){
    this.auth.signOut().then(
      () => {
        this.nav.navigateBack('auth');
      }
    );
  }
}
