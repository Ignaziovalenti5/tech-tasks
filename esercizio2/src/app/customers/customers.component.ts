import { Component, OnInit } from '@angular/core';
import { Customer } from '../models/customer';
import { Dossier } from '../models/dossier';
import { ServiceService } from '../service.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {

  customers: Customer[] = []
  customer!: Customer

  dossiers: Dossier[] = []
  dossierForCustomer: Dossier[] = []

  isLoading: boolean = false
  isEditing: boolean = false

  constructor(private service: ServiceService) { }

  ngOnInit(): void {
    this.service.changeStatusAppointmentsObs.subscribe((res: any) => {
      this.getAllCustomers()
      this.getAllDossiers()
    })
    this.getAllCustomers()
    this.getAllDossiers()
  }

  getAllCustomers() {
    this.service.getAllCustomers().subscribe((res: any) => {
      this.customers = res
    })
  }

  getAllDossiers() {
    this.service.getAllDossiers().subscribe((res: any) => {
      this.dossiers = res
    })
  }

  dossiersForCustomerPopulate(id: number) {
    this.dossierForCustomer = this.dossiers.filter((d: Dossier) => d.customer == id)
  }

  convertDossierDate(date: number) {
    return new Date(date).toLocaleDateString('it-IT', {
      dateStyle: 'full'
    })
  }

  newCustomer: Customer = {
    firstName: '',
    lastName: '',
    email: '',
    phone: 0
  }

  postNewCustomer() {
    this.service.postNewCustomer(this.newCustomer).subscribe((res: any) => {
      this.service.changeStatusAppointmentsSbj.next(true)
    })
  }

  newDossier: Dossier = {
    customer: 0,
    date: 0,
    title: '',
    description: ''
  }

  postNewDossier() {
    this.newDossier.date = new Date().getTime()
    this.service.postNewDossier(this.newDossier).subscribe((res: any) => {
      this.service.changeStatusAppointmentsSbj.next(true)
      this.newDossier = {
        customer: 0,
        date: 0,
        title: '',
        description: ''
      }
    })
  }

  ind:number = 0

  editCustomer(id:number, index:number) {    
      this.service.editCustomer(id!, this.customers[index]).subscribe((res: any) => {
        this.service.changeStatusAppointmentsSbj.next(true)
        this.isEditing = false
      })
  }

  deleteCustomer(id: number) {
      this.service.deleteCustomer(id!).subscribe((res: any) => {
        this.service.changeStatusAppointmentsSbj.next(true)
      })
  }

}
