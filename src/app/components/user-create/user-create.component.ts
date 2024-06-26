import { HttpClient } from '@angular/common/http';
import { COMPILER_OPTIONS, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/services/auth/user';
import { UserService } from 'src/app/services/user/user.service';


@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.css']
})
export class UserCreateComponent implements OnInit{
  constructor(
    private route: ActivatedRoute,
    private formBuilder:FormBuilder,
    private userService: UserService, 
    private router: Router, 
    private http:HttpClient
  ){}

  user: User = { id: 0, name: '', email: '', pass: '' };
  body : any;
  userNew = this.formBuilder.group({
    id:[''],
    name:['',Validators.required],
    email:['', Validators.required],
    pass:['',Validators.required]
  })


  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.userService.getUser(id).subscribe(data => {
      this.user = data;
    });
  }

  onSubmit(): void {
    this.body = [{
      name: this.userNew.controls.name.value, pass: this.userNew.controls.pass.value , email: this.userNew.controls.email.value
    }];
    console.log(this.body);
   
    this.userService.createUser(this.body).subscribe(() => {
      this.router.navigate(['/']);
    });

  }

}
