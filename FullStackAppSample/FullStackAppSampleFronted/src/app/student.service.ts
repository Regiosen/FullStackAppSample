import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { StudentInterface } from './student.interface';
import { Student } from './student';

import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private studentUrl = '';

  constructor(private http: HttpClient) { }

  /** GET students from the server */
  public getStudents(): Observable<StudentInterface[]> {
    this.studentUrl = 'https://localhost:44317/student';
    return this.http.get<StudentInterface[]>(this.studentUrl);
  }

  public deleteStudents(student: StudentInterface): Observable<any> {
    this.studentUrl = 'https://localhost:44317/student/delete';
    return this.http.post(this.studentUrl, student);
  }

  public insertStudents(student: StudentInterface): Observable<any> {
    this.studentUrl = 'https://localhost:44317/student/insert';
    return this.http.post(this.studentUrl, student);
  }
  public modifyStudents(student: StudentInterface): Observable<any> {
    this.studentUrl = 'https://localhost:44317/student/modify';
    return this.http.post(this.studentUrl, student);
  }
}
