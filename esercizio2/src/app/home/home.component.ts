import { Component, OnInit } from '@angular/core';
import { Appointment } from '../models/appointment';
import { Customer } from '../models/customer';
import { ServiceService } from '../service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private service: ServiceService) { }

  appointments: Appointment[] = []
  customers: Customer[] = []

  newCustomer: Customer = {
    firstName: '',
    lastName: '',
    email: '',
    phone: 0
  }

  newAppointment: Appointment = {
    customer:0,
    date:0,
    note:''
  }

  isLoading: boolean = false

  ngOnInit(): void {

    this.getAppointments()
    this.getCustomers()

    this.service.changeStatusAppointmentsObs.subscribe(res => {
      this.getAppointments()
    })

  }

  getAppointments() {
    this.isLoading = true
    this.service.getAllAppointments().subscribe((res: any) => {
      this.appointments = res.sort((a:Appointment, b:Appointment) => (a.date > b.date) ? 1 : -1);
      this.isLoading = false
    })
  }

  getCustomers() {
    this.service.getAllCustomers().subscribe((res: any) => {
      this.customers = res
    })
  }

  createAppointment(){
    this.newAppointment.date = new Date(this.newAppointment.date).getTime();
    
    this.service.postNewAppointment(this.newAppointment).subscribe((res:any) => {
      this.service.changeStatusAppointmentsSbj.next(true)
      this.newAppointment = {
        customer:0,
        date:0,
        note:''
      }
    })
    
  }
}
