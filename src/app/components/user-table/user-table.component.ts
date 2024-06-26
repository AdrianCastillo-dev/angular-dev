import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/services/auth/user';
import { UserService } from 'src/app/services/user/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.css']
})
export class UserTableComponent implements OnInit{
  users: User[] = [];

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe(data => {
      this.users = data;
    });
  }


  editUser(id: number): void {
    console.log("edite");
    this.router.navigate(['/edit', id]);
  }

  deleteUser(id: number): void {
    this.userService.deleteUser(id).subscribe(() => {
      this.users = this.users.filter(user => user.id !== id);
    });
  }

  createUser(): void {
    this.router.navigate(['/create']);
  }

}
