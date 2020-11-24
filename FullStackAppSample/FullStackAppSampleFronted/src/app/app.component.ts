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
  a: any;
  model : StudentInterface = {
    id: -1,
    username: "",
    firstName: "",
    lastName: "",
    age: 0,
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
    this.studentService.insertStudents(this.model).subscribe(
      (data) => this.getRows(),
      (err: any) => console.log(err),
      () => console.log(this.a)
    );
  }
  modifyRow(student: StudentInterface) {
    this.studentSelected = true;
    this.model.id = student.id;
    this.model.username = student.username;
    this.model.firstName = student.firstName;
    this.model.lastName = student.lastName;
    this.model.age = student.age;
    this.model.career = student.career;
  }
  deselectRow(form: NgForm) {
    this.studentSelected = false;
    this.model.id = -1;
    form.resetForm();
  }
  confirmChanges(){
    this.studentService.modifyStudents(this.model).subscribe(
      (data) => this.getRows(),
      (err: any) => console.log(err),
      () => console.log(this.a)
    );
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
