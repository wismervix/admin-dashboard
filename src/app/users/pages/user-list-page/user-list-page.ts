import { Component, computed, inject } from '@angular/core';
import { UserService } from '../../services/user';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-list-page',
  imports: [RouterModule],
  templateUrl: './user-list-page.html',
  styleUrl: './user-list-page.scss',
})
export class UserListPage {
  public userService = inject(UserService);

  users = computed(() => this.userService.users());
  currentPage = computed(() => this.userService.currentPageIndex);
  totalPages = computed(() => this.userService.totalPages);

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
}
