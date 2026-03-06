import { Component, computed, inject } from '@angular/core';
import { UsersStore } from '../../data/users.store';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../../../core/services/api.service';
import { DataTable } from '../../../../shared/components/data-table/data-table';
import { NgClass } from '@angular/common';
import { Card } from '../../../../shared/components/card/card';

@Component({
  selector: 'app-user-list-page',
  imports: [RouterModule, DataTable, NgClass, Card],
  templateUrl: './user-list-page.html',
  styleUrl: './user-list-page.scss',
})
export class UserListPage {
  public usersStore = inject(UsersStore);
  public apiService = inject(ApiService);

  users = this.usersStore.users;
  currentPage = this.usersStore.currentPageIndex;
  totalPages = this.usersStore.totalPages;

  // nextPage() {
  //   this.usersStore.nextPage();
  // }

  // prevPage() {
  //   this.usersStore.prevPage();
  // }

  // pageNumbers = computed(() =>
  //   Array.from({ length: this.totalPages() }, (_, i) => i),
  // );

  goToPage(page: number) {
    this.usersStore.goToPage(page);
  }
  deleteUser(id: number) {
    const confirmed = confirm('Are you sure you want to delete this user?');

    if (!confirmed) return;

    this.usersStore.deleteUser(id).subscribe({
      error: (err) => {
        console.error('Delete failed', err);
      },
    });
  }
}
