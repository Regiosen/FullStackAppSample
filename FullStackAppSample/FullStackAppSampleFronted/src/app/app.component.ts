import { Component } from '@angular/core';
import { StudentService } from './student.service';
import { StudentInterface } from './student.interface';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Full Stack App Sample';
  frameworkComponents: any;
  a: StudentInterface[] = [];
  badUsername: boolean = false;
  badAge: boolean = false;
  emptyUsername: boolean = false;
  emptyFirstName: boolean = false;
  emptyLastName: boolean = false;
  emptyAge: boolean = false;
  emptyCareer: boolean = false;
  originalUsernameToModify: string = "";

  model : StudentInterface = {
    id: -1,
    username: "",
    firstName: "",
    lastName: "",
    age: "",
    career: ""
  };
  studentSelected : boolean = false;
  constructor(private studentService: StudentService) {
  }
  ngOnInit() {
    this.getRows();
  }
  getRows()
  {
    this.studentService.getStudents().subscribe(
      (data:StudentInterface[]) => this.a = data,
      (err: any) => console.log(err),
      () => console.log(this.a)
    );
  }
  deleteRow(student: StudentInterface) {
    this.studentService.deleteStudents(student).subscribe(
      (data) => this.getRows(),
      (err: any) => console.log(err),
      () => console.log(this.a)
    );
    
  }
  insertRow() {
    this.checkValidForm();  
    if (this.badUsername || this.badAge || this.emptyUsername ||
        this.emptyFirstName || this.emptyLastName || this.emptyAge || this.emptyCareer)
    {
      return;
    }
    this.studentService.insertStudents(this.model).subscribe(
      (data) => this.getRows(),
      (err: any) => console.log(err),
      () => console.log(this.a)
    );
  }
  modifyRow(student: StudentInterface) {
    this.resetValidFormWarnings();  
    this.originalUsernameToModify = student.username;
    this.studentSelected = true;
    this.model.id = student.id;
    this.model.username = student.username;
    this.model.firstName = student.firstName;
    this.model.lastName = student.lastName;
    this.model.age = student.age.toString();
    this.model.career = student.career;
  }
  deselectRow(form: NgForm) {
    this.studentSelected = false;
    this.model.id = -1;
    form.resetForm();
  }
  confirmChanges(){
    this.checkValidForm(true);  
    if (this.badUsername || this.badAge || this.emptyUsername ||
        this.emptyFirstName || this.emptyLastName || this.emptyAge || this.emptyCareer)
    {
      return;
    }
    this.studentService.modifyStudents(this.model).subscribe(
      (data) => this.getRows(),
      (err: any) => console.log(err),
      () => console.log(this.a)
    );
  }
  checkValidForm(modifying:boolean = false)
  {
    if (this.model.username == null)
    {
      this.badUsername = false
    }
    else
    {
      if (!((modifying) && (this.originalUsernameToModify == this.model.username)))
      {
        var uniqueUsername = !this.a.some(student=> student.username === this.model.username);
        (!uniqueUsername) ? this.badUsername = true :  this.badUsername = false;

      }
      else
      {
        this.badUsername = false
      }
    }
    if (this.model.age == null)
    {
      this.badAge = false;
    }
    else
    {
      ((isNaN(+this.model.age))||(+this.model.age < 0)) ? this.badAge = true :  this.badAge = false;
    }
    ((this.model.username == null)||(this.model.username.length <= 0)) ? this.emptyUsername = true :  this.emptyUsername = false;
    ((this.model.firstName == null)||(this.model.firstName.length <= 0)) ? this.emptyFirstName = true :  this.emptyFirstName = false;
    ((this.model.lastName == null)||(this.model.lastName.length <= 0)) ? this.emptyLastName = true :  this.emptyLastName = false;
    ((this.model.age == null)||(this.model.age.length <= 0)) ? this.emptyAge = true :  this.emptyAge = false;
    ((this.model.career == null)||(this.model.career.length <= 0)) ? this.emptyCareer = true :  this.emptyCareer = false;
  }
  resetValidFormWarnings()
  {
    this.badUsername = false;
    this.badAge = false;
    this.emptyUsername = false;
    this.emptyFirstName = false;
    this.emptyLastName = false;
    this.emptyAge = false;
    this.emptyCareer = false;
  
  }
  columnDefs = [
      { field: 'username', sortable: true, filter: true },
      { field: 'firstName', sortable: true, filter: true },
      { field: 'lastName', sortable: true, filter: true },
      { field: 'age', sortable: true, filter: true },
      { field: 'career', sortable: true, filter: true },
      {
        field: 'actions',
        cellRenderer: 'btnCellRenderer',
        cellRendererParams: {
          clicked: function(field: any) {
            alert(`${field} was clicked`);
          }
        },
        minWidth: 150,
      }
  ];

}
