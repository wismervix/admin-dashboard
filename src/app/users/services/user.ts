import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { UsersApiResponse } from '../../core/models/user.model';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);

  private usersUrl = 'https://dummyjson.com/users';

  // Pagination state
  private skipSignal = signal(0);
  private limit = 30;

  // Internal subject for reactive HTTP
  private usersSubject = new BehaviorSubject<UsersApiResponse>({
    users: [],
    total: 0,
    skip: 0,
    limit: this.limit,
  });

  usersResponse = signal(this.usersSubject.value);

  users = computed(() => this.usersResponse().users);

  constructor() {
    effect(() => {
      const skip = this.skipSignal();

      this.http
        .get<UsersApiResponse>(
          `${this.usersUrl}?limit=${this.limit}&skip=${skip}`,
        )
        .pipe(
          tap((res) => {
            this.usersSubject.next(res);
            this.usersResponse.set(res);
          }),
        ).subscribe();
    });
  }

  nextPage() {
    const nextSkip = this.skipSignal() + this.limit;
    if (nextSkip < this.usersResponse().total) {
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
    if (newSkip >= 0 && newSkip < this.usersResponse().total) {
      this.skipSignal.set(newSkip);
    }
  }

  get totalPages() {
    return Math.ceil(this.usersResponse().total / this.limit);
  }

  get currentPageIndex() {
    return Math.floor(this.skipSignal() / this.limit);
  }
}
