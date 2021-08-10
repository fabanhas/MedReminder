import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { NavController, ToastController } from '@ionic/angular';
import { User } from 'firebase';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RemedioService {

collection : AngularFirestoreCollection;

  isLoggedIn: Observable<User>;

  constructor(
    private db : AngularFirestore
  ) { }


  registrarMed(med){
    med.id = this.db.createId();
    this.collection = this.db.collection('meds');
    return this.collection.doc(med.id).set(med);
  }

  lista(tipo, email){
    if(tipo == 'ativo'){
      this.collection = this.db.collection('meds', ref => 
      ref.where('ativo', '==', 'S').where('email', '==', email)
      );
    }else{
      this.collection = this.db.collection('meds', ref => 
      ref.where('ativo', '==', 'N').where('email', '==', email)
      );
    }
    return this.collection.valueChanges();
  }
  remove(med){
    this.collection = this.db.collection('meds');
    this.collection.doc(med.id).delete();
  }
  arq(med){
    this.collection = this.db.collection('meds');
    this.collection.doc(med.id).update({ativo: 'N'});
  }

  ativar(med){
    this.collection = this.db.collection('meds');
    this.collection.doc(med.id).update({ativo: 'S'});
  }

}
