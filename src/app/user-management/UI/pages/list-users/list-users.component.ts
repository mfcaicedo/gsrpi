import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list-users',
  imports: [CommonModule],
  templateUrl: './list-users.component.html',
  styleUrl: './list-users.component.css'
})
export class ListUsersComponent implements OnInit {

  userResponse: [] = [];

  constructor(
  ) { }

  ngOnInit(): void {
  }

}
