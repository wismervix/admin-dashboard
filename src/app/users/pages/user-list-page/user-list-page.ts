import { Component, computed, inject } from '@angular/core';
import { UserService } from '../../services/user';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-user-list-page',
  imports: [RouterModule],
  templateUrl: './user-list-page.html',
  styleUrl: './user-list-page.scss',
})
export class UserListPage {
  public userService = inject(UserService);
  public apiService = inject(ApiService);

  users = this.userService.users;
  currentPage = this.userService.currentPageIndex;
  totalPages = this.userService.totalPages;

  nextPage() {
    this.userService.nextPage();
  }

  prevPage() {
    this.userService.prevPage();
  }

  goToPage(page: number) {
    this.userService.goToPage(page);
  }

  pageNumbers = computed(() =>
    Array.from({ length: this.totalPages() }, (_, i) => i),
  );

  deleteUser(id: number) {
    const confirmed = confirm('Are you sure you want to delete this user?');

    if (!confirmed) return;

    this.userService.deleteUser(id).subscribe({
      error: (err) => {
        console.error('Delete failed', err);
      },
    });
  }
}
