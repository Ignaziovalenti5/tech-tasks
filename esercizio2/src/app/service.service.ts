import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Appointment } from './models/appointment';
import { Customer } from './models/customer';
import { Dossier } from './models/dossier';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  urlCustomers: string = 'http://localhost:3000/customers/'
  urlAppointments: string = 'http://localhost:3000/appointments/'
  urlDossiers: string = 'http://localhost:3000/dossiers/'

  changeStatusAppointmentsSbj = new BehaviorSubject<boolean>(false)
  changeStatusAppointmentsObs = this.changeStatusAppointmentsSbj.asObservable()

  constructor(private http: HttpClient) { }

  getAllCustomers() {
    return this.http.get(this.urlCustomers)
  }

  getSingleCustomer(id: number) {
    return this.http.get(this.urlCustomers + id)
  }

  postNewCustomer(customer: Customer) {
    return this.http.post(this.urlCustomers, customer)
  }

  editCustomer(id: number, customer: Customer) {
    return this.http.patch(this.urlCustomers + id, customer)
  }

  deleteCustomer(id: number) {
    return this.http.delete(this.urlCustomers + id)
  }

  getAllAppointments() {
    return this.http.get(this.urlAppointments)
  }

  postNewAppointment(appointment: Appointment) {
    return this.http.post(this.urlAppointments, appointment)
  }

  editAppointments(id: number, appointment: Partial<Appointment>) {
    return this.http.patch(this.urlAppointments + id, appointment)
  }

  deleteAppointment(id: number) {
    return this.http.delete(this.urlAppointments + id)
  }

  getAllDossiers(){
    return this.http.get(this.urlDossiers)
  }

  postNewDossier(dossier: Dossier){
    return this.http.post(this.urlDossiers, dossier)
  }

}
