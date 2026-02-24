import {
  Component,
  Input,
  Output,
  EventEmitter,
  signal,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  FormGroup,
} from '@angular/forms';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-user-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-form.html',
  styleUrl: './user-form.scss',
})
export class UserForm {
  private fb = inject(FormBuilder);

  private _user = signal<User | null>(null);
  readonly userSignal = this._user.asReadonly();

  @Input() set user(value: User | null) {
    this._user.set(value);
    if (value) {
      this.form.patchValue(value);
    }
  }

  @Output() save = new EventEmitter<User>();

  form: FormGroup = this.fb.group({
    first_name: ['', [Validators.required, Validators.maxLength(50)]],
    last_name: ['', [Validators.required, Validators.maxLength(50)]],
    email: ['', [Validators.required, Validators.email]],
    username: ['', [Validators.required, Validators.minLength(3)]],
    age: [null, [Validators.required, Validators.min(0)]],
    gender: ['other', Validators.required],
    role: ['user', Validators.required],
    address: ['', Validators.required],
    city: ['', Validators.required],
    state: ['', Validators.required],
    country: ['', Validators.required],
    image: [''],
  });

  submit() {
    if (this.form.invalid || !this._user()) return;

    const updatedUser: User = {
      ...this._user()!,
      ...this.form.value,
      updated_at: new Date().toISOString(),
    };

    this.save.emit(updatedUser);
  }
}
