import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, ToastController } from '@ionic/angular';
import { LoginService } from '../auth/service/login.service';
import { RemedioService } from './service/remedio.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit  {
  listaMeds;
  listaMedsArq;
  medForm: FormGroup;
  value = 'S';
  ishidden = true;
  email = '';
  nome = '';

  constructor(
    private builder : FormBuilder,
    private service : LoginService,
    private nav: NavController,
    private serviceMed : RemedioService,
    private toast : ToastController,
  ) {}
  

  ngOnInit() {
    this.isUserLoggedIn();
    this.initForm();
  }

  isUserLoggedIn(){
    this.service.isLoggedIn.subscribe(
      user => {
        if(user){
          this.email = user.email;
          this.nome = user.displayName;
          this.atualizar();
        }
      }
    );
  }

  atualizar(){
    this.serviceMed.lista("ativo", this.email).subscribe(x => this.listaMeds = x);
    this.serviceMed.lista("desativado", this.email).subscribe(x => this.listaMedsArq = x);
  }


  openForm(){
    if(this.ishidden == true){
      this.ishidden = false
    }else{
      this.ishidden = true
    }
  }
  

  logout(){
      this.service.logout();
  }

  remove(med){
    this.serviceMed.remove(med);
    this.atualizar();
  }

  arquivar(med){
    this.serviceMed.arq(med);
    this.atualizar();
  }

  ativar(med){
    this.serviceMed.ativar(med);
    this.atualizar();
  }

  private initForm(){
    this.medForm = this.builder.group({
      nome : ['', [Validators.min(0.01), Validators.required]],
      qtd : ['', [Validators.required]],
      horario : ['', [Validators.required, Validators.minLength(4)]],
      acada: ['', [Validators.required, Validators.minLength(3)]],
      ativo : ['',[Validators.required]],
      email: ['',[Validators.required]],
    });
  }

  limparForm(){
    this.medForm.reset();
  }

  registrarMed(){
    const med = this.medForm.value;
    this.serviceMed.registrarMed(med)
    .then(() => this.presentToast());
    this.atualizar();
    this.openForm();
  }

  async presentToast() {
    const toast = await this.toast.create({
      message: 'medicação salva.',
        duration: 2000
    });
    toast.present();
  }
}
