import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user';
import { User } from '../../../core/models/user.model';
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
  private userService = inject(UserService);

  user = signal<User | null>(null);

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const foundUser = this.userService.getUserById(id);

    if (foundUser) {
      this.user.set(foundUser);
    } else {
      this.router.navigate(['/users']);
    }
  }

  handleSave(data: any) {
    this.userService.updateUser(data.user).subscribe({
      next: (res) => {
        const userId = res.user.id;

        if (data.image) {
          this.userService
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
  //   this.userService.updateUser(updatedUser).subscribe({
  //     next: () => {
  //       this.router.navigate(['/users']);
  //     },
  //     error: (err) => {
  //       console.error('Update failed', err);
  //     },
  //   });
  // }
}
