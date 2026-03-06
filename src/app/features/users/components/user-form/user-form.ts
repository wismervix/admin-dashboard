import {
  Component,
  Input,
  Output,
  EventEmitter,
  signal,
  inject,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  FormGroup,
} from '@angular/forms';
import { User } from '../../../../core/models/user.model';
import { ApiService } from '../../../../core/services/api.service';
import { calculateAge } from '../../../../core/utils/date.utils';
import { Card } from "../../../../shared/components/card/card";

@Component({
  selector: 'app-user-form',
  imports: [CommonModule, ReactiveFormsModule, Card],
  templateUrl: './user-form.html',
  styleUrl: './user-form.scss',
})
export class UserForm {
  constructor() {
    this.form.get('birthDate')?.valueChanges.subscribe((value) => {
      this.birthDateSignal.set(value);
    });
  }

  private fb = inject(FormBuilder);
  public apiService = inject(ApiService);

  private _user = signal<User | null>(null);
  readonly userSignal = this._user.asReadonly();

  birthDateSignal = signal<string | null>(null);
  readonly calculatedAge = computed(() => {
    const birthDate = this.birthDateSignal();
    return birthDate ? calculateAge(birthDate) : null;
  });

  imageFile = signal<File | null>(null);
  imagePreview = signal<string | null>(null);

  onImageSelected(event: any) {
    const file = event.target.files[0];

    if (!file) return;

    this.imageFile.set(file);
    this.imagePreview.set(URL.createObjectURL(file));
  }

  @Input() set user(value: User | null) {
    this._user.set(value);
    if (value) {
      this.form.patchValue(value);
      this.birthDateSignal.set(value.birthDate);

      if (value.image) {
        this.imagePreview.set(this.apiService.getMediaUrl(value.image));
      }
    }
  }

  // @Output() save = new EventEmitter<User>();
  @Output() save = new EventEmitter<{ user: User; image?: File | null }>();

  form: FormGroup = this.fb.group({
    first_name: ['', [Validators.required, Validators.maxLength(50)]],
    last_name: ['', [Validators.required, Validators.maxLength(50)]],
    gender: ['other', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.minLength(8), Validators.maxLength(100)]],
    birthDate: ['', Validators.required],
    image: [''],
    role: ['user', Validators.required],
    address: ['', Validators.required],
    city: ['', Validators.required],
    state: ['', Validators.required],
    country: ['', Validators.required],
  });

  submit() {
    if (this.form.invalid || !this._user()) return;

    const age = calculateAge(this.form.value.birthDate);

    const updatedUser: User = {
      ...this._user()!,
      ...this.form.value,
      age,
      updated_at: new Date().toISOString(),
    };

    // this.save.emit(updatedUser);
    this.save.emit({
      user: updatedUser,
      image: this.imageFile(),
    });
  }
}
