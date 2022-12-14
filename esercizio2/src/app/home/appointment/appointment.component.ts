import { Component, Input, OnInit } from '@angular/core';
import { Appointment } from 'src/app/models/appointment';
import { Customer } from 'src/app/models/customer';
import { ServiceService } from 'src/app/service.service';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.scss']
})
export class AppointmentComponent implements OnInit {

  @Input() appointment!: Appointment

  customer!: Customer
  appointmentDate: string = ''
  appointmentTime: string = ''

  isEditingDate: boolean = false
  isEditingNote: boolean = false
  isLoading: boolean = false

  constructor(private service: ServiceService) { }

  ngOnInit(): void {
    this.isLoading = true
    this.service.getSingleCustomer(this.appointment.customer).subscribe((res: any) => {
      this.customer = res
      this.isLoading = false
    })
    this.appointmentDate = new Date(this.appointment.date).toLocaleDateString('it-IT', {
      dateStyle: 'full'
    })
    this.appointmentTime = String(new Date(this.appointment.date).getHours()) + ':' + String(new Date(this.appointment.date).getMinutes())
  }

  deleteAppointment() {
    if (this.appointment.id)
      this.service.deleteAppointment(this.appointment.id).subscribe(res => {
        this.service.changeStatusAppointmentsSbj.next(true)
      })

  }

  editedAppointmentDate:string = ''

  editAppointmentDate() {
    let date = new Date(this.editedAppointmentDate).getTime()
    
    if (this.appointment.id)
      this.service.editAppointments(this.appointment.id, {date: date}).subscribe((res:any) => {
        this.service.changeStatusAppointmentsSbj.next(true)
        this.isEditingDate = false
      })
  }

  editAppointmentNote() {
    if (this.appointment.id)
      this.service.editAppointments(this.appointment.id, { note: this.appointment.note }).subscribe((res:any) => {
        this.service.changeStatusAppointmentsSbj.next(true)
        this.isEditingNote = false
      })
  }


}
