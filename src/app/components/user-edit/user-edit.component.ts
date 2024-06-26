import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/services/auth/user';
import { UserService } from 'src/app/services/user/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit{

  user: User = { id: 0, name: '', email: '', pass: '' };
  user1 : any;
  body : any;
  id: any;
  
  userUpdate = this.formBuilder.group({
    id:[''],
    name:['',Validators.required],
    email:['', Validators.required],
    pass:['',Validators.required]
  })

  constructor(private route: ActivatedRoute,private formBuilder:FormBuilder,private userService: UserService, private router: Router, private http:HttpClient) 
  { 
    this.http.get<User[]>(environment.urlApi+"/"+this.route.snapshot.paramMap.get('id')).subscribe(
      {
        next:(response) => {
          this.user1 = response;
          console.log(this.user1);
        }
      }
    );
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.userService.getUser(id).subscribe(data => {
      this.user = data;
    });
  }

  onSubmit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.body = {
      name: this.userUpdate.controls.name.value, email: this.userUpdate.controls.email.value, pass: this.userUpdate.controls.pass.value
    }

    console.log(this.body);

    this.userService.updateUserIn(this.body, this.id).subscribe(() => {
      this.router.navigate(['/']);
    });
  }
}
