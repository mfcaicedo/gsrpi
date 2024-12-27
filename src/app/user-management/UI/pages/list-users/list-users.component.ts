import { Component, OnInit } from '@angular/core';
import { ListUsersUsecase } from '../../../domain/usecase/list-users-usecase';

@Component({
  selector: 'app-list-users',
  imports: [],
  templateUrl: './list-users.component.html',
  styleUrl: './list-users.component.css'
})
export class ListUsersComponent implements OnInit {

  userResponse: [] = [];

  constructor(
    private readonly listUsersUseCase: ListUsersUsecase
  ) { }

  ngOnInit(): void {
    this.listUsersUseCase.getAllUsersPaginated().subscribe({
      next: (response) => {
        console.log("respuesta: ", response);
        this.userResponse = response;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

}
