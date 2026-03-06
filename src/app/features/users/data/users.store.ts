import { computed, inject, Injectable, signal } from '@angular/core';
import { User, UsersApiResponse } from '../../../core/models/user.model';
import { ApiService } from '../../../core/services/api.service';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsersStore {
  private http = inject(HttpClient);
  private apiService = inject(ApiService);

  private usersUrl = `${this.apiService.baseUrl}/users`;

  // Pagination state
  private skipSignal = signal(0);
  private limit = 30;

  public usersResponse = signal<UsersApiResponse>({ users: [] });

  // users = computed(() => this.usersResponse().users);

  // Computed list of users for the current page
  readonly users = computed(() => {
    const allUsers = this.usersResponse().users;
    const skip = this.skipSignal();
    return allUsers.slice(skip, skip + this.limit);
  });

  readonly totalPages = computed(() =>
    Math.ceil(this.usersResponse().users.length / this.limit),
  );

  readonly currentPageIndex = computed(() =>
    Math.floor(this.skipSignal() / this.limit),
  );

  constructor() {
    this.http
      .get<UsersApiResponse>(this.usersUrl)
      .pipe(tap((res) => this.usersResponse.set(res)))
      .subscribe();
  }

  // 🔍 Get single user
  getUserById(id: number): User | undefined {
    return this.usersResponse().users.find((u) => u.id === id);
  }

  calculateAge(birthDate: string): number {
    if (!birthDate) return 0;

    const today = new Date();
    const birth = new Date(birthDate);

    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age;
  }

  uploadImage(userId: number, image?: File) {
    const formData = new FormData();

    if (image) {
      formData.append('image', image);
    }

    return this.http
      .post<{
        user: User;
      }>(`${this.usersUrl}/${userId}/images`, formData)
      .pipe(
        tap((res) => {
          const updated = this.usersResponse().users.map((u) =>
            u.id === userId ? res.user : u,
          );

          this.usersResponse.set({
            users: updated,
          });
        }),
      );
  }

  // ✏ Update user
  updateUser(updatedUser: User) {
    return this.http
      .put<{ user: User }>(`${this.usersUrl}/${updatedUser.id}`, updatedUser)
      .pipe(
        tap((res) => {
          const updatedUsers = this.usersResponse().users.map((u) =>
            u.id === updatedUser.id ? res.user : u,
          );
          // console.log('updated user: ', updatedUser);

          this.usersResponse.set({ users: updatedUsers });
        }),
      );
  }

  // 🗑️ Delete user
  deleteUser(id: number) {
    return this.http.delete(`${this.usersUrl}/${id}`).pipe(
      tap(() => {
        const filteredUsers = this.usersResponse().users.filter(
          (u) => u.id !== id,
        );

        this.usersResponse.set({ users: filteredUsers });
      }),
    );
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
}
