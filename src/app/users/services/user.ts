import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { UsersApiResponse } from '../../core/models/user.model';
import { ApiService } from '../../core/services/api.service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private apiService = inject(ApiService);

  private usersUrl = `${this.apiService.baseUrl}/users`;

  // Pagination state
  private skipSignal = signal(0);
  private limit = 30;

  // Internal subject for reactive HTTP
  private usersSubject = new BehaviorSubject<UsersApiResponse>({
    users: [],
  });

  usersResponse = signal(this.usersSubject.value);

  // users = computed(() => this.usersResponse().users);

  // Computed list of users for the current page
  users = computed(() => {
    const allUsers = this.usersResponse().users;
    const skip = this.skipSignal();
    return allUsers.slice(skip, skip + this.limit);
  });

  constructor() {
    effect(() => {
      // Only need to fetch once, or you can fetch fresh if your API supports pagination
      this.http
        .get<UsersApiResponse>(this.usersUrl)
        .pipe(
          tap((res) => {
            this.usersSubject.next(res);
            this.usersResponse.set(res);
            console.log('user res: ', this.usersResponse());
          }),
        )
        .subscribe();
    });
  }

  nextPage() {
    const nextSkip = this.skipSignal() + this.limit;
    if (nextSkip < this.usersResponse().users.length) {
      this.skipSignal.set(nextSkip);
    }
  }

  prevPage() {
    const prevSkip = this.skipSignal() - this.limit;
    if (prevSkip >= 0) {
      this.skipSignal.set(prevSkip);
    }
  }

  goToPage(pageIndex: number) {
    const newSkip = pageIndex * this.limit;
    if (newSkip >= 0 && newSkip < this.usersResponse().users.length) {
      this.skipSignal.set(newSkip);
    }
  }

  get totalPages() {
    return Math.ceil(this.usersResponse().users.length / this.limit);
  }

  get currentPageIndex() {
    return Math.floor(this.skipSignal() / this.limit);
  }
}
