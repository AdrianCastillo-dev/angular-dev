import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, retry, throwError } from 'rxjs';
import { User } from '../auth/user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http:HttpClient) { }

  getUser(id:number):Observable<User>{
    console.log(id);
    return this.http.get<User>(environment.urlApi+"/"+id).pipe(
      catchError(this.handleError)
    )
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(environment.urlApi).pipe(
      catchError(this.handleError)
    );
  }

  updateUser(userRequest:User):Observable<any>
  {
    let json = JSON.stringify(userRequest);
    let JSOn_p = JSON.parse(json) ;

    let id = JSOn_p.id;
    console.log(json);
    
    let body = { name:JSOn_p.lastname, email: JSOn_p.firstname, password: JSOn_p.country };


    console.log(body);
    return this.http.put(environment.urlApi+"/"+id, body).pipe(
      catchError(this.handleError)
    )
  }

  updateUserIn(body:any, id:any): Observable<any> {
    return this.http.put(environment.urlApi+"/"+id, body).pipe(
      catchError(this.handleError)
    );
  }

  createUser(body:any): Observable<User> {
    return this.http.post<User>(environment.urlApi, body).pipe(
      catchError(this.handleError)
    );
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(environment.urlApi+"/"+id).pipe(
      catchError(this.handleError)
    );
  }
  

  private handleError(error:HttpErrorResponse){
    if(error.status===0){
      console.error('Se ha producio un error ', error.error);
    }
    else{
      console.error('Backend retornó el código de estado ', error.status, error.error);
    }
    return throwError(()=> new Error('Algo falló. Por favor intente nuevamente.'));
  }
}
