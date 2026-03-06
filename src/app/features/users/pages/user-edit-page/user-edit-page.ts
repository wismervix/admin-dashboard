import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersStore } from '../../data/users.store';
import { User } from '../../../../core/models/user.model';
import { UserForm } from '../../components/user-form/user-form';

@Component({
  selector: 'app-user-edit-page',
  imports: [CommonModule, UserForm],
  templateUrl: './user-edit-page.html',
  styleUrl: './user-edit-page.scss',
})
export class UserEditPage {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private usersStore = inject(UsersStore);

  user = signal<User | null>(null);

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const foundUser = this.usersStore.getUserById(id);

    if (foundUser) {
      this.user.set(foundUser);
    } else {
      this.router.navigate(['/users']);
    }
  }

  handleSave(data: any) {
    this.usersStore.updateUser(data.user).subscribe({
      next: (res) => {
        const userId = res.user.id;

        if (data.image) {
          this.usersStore
            .uploadImage(userId, data.image)
            .subscribe(() => this.router.navigate(['/users']));
        } else {
          this.router.navigate(['/users']);
        }
      },
      error: (err) => {
        console.error('Update failed', err);
      },
    });
  }
  // handleSave(updatedUser: User) {
  //   this.usersStore.updateUser(updatedUser).subscribe({
  //     next: () => {
  //       this.router.navigate(['/users']);
  //     },
  //     error: (err) => {
  //       console.error('Update failed', err);
  //     },
  //   });
  // }
}
