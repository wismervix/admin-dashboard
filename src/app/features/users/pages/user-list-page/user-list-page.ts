import { Component, computed, inject } from '@angular/core';
import { UsersStore } from '../../services/users.store';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../../../core/services/api.service';

@Component({
  selector: 'app-user-list-page',
  imports: [RouterModule],
  templateUrl: './user-list-page.html',
  styleUrl: './user-list-page.scss',
})
export class UserListPage {
  public usersStore = inject(UsersStore);
  public apiService = inject(ApiService);

  users = this.usersStore.users;
  currentPage = this.usersStore.currentPageIndex;
  totalPages = this.usersStore.totalPages;

  nextPage() {
    this.usersStore.nextPage();
  }

  prevPage() {
    this.usersStore.prevPage();
  }

  goToPage(page: number) {
    this.usersStore.goToPage(page);
  }

  pageNumbers = computed(() =>
    Array.from({ length: this.totalPages() }, (_, i) => i),
  );

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
