import { Component, OnInit } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from '@angular/fire/auth';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

/**
 * An enum for all the different forms we can have in this component.
 */
enum FormType {
  Login = 'login',
  Signup = 'signup',
  Reset = 'reset',
}

/**
 * An enum for the form field names so that we can have typing in html.
 */
enum FormFieldName {
  Email = 'email',
  Password = 'password',
  PasswordConfirm = 'passwordConfirm',
}

@Component({
  selector: 'app-email-login',
  templateUrl: './email-login.component.html',
  styleUrls: ['./email-login.component.scss'],
})
export class EmailLoginComponent implements OnInit {
  /**
   * An enum for all the different forms we can have in this component.
   */
  readonly FormType = FormType;

  /**
   * An enum for the form field names so that we can have typing in html.
   */
  readonly FormFieldName = FormFieldName;

  /**
   * The form used for either Login, Signup or Reset password.
   */
  form: FormGroup;

  /**
   * Determines which form we want to display.
   */
  formType: FormType = FormType.Signup;

  /**
   * Whether or not we are waiting for a server response.
   */
  loading: boolean;

  /**
   * The response of the server after submitting the form.
   */
  serverMessage: string;

  constructor(private auth: Auth, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      [FormFieldName.Email]: ['', [Validators.required, Validators.email]],
      [FormFieldName.Password]: ['', [Validators.required, Validators.minLength(6)]],
      [FormFieldName.PasswordConfirm]: ['', []],
    });
  }

  changeFormType(type: FormType) {
    this.formType = type as FormType;
  }

  get isLogin(): boolean {
    return this.formType === FormType.Login;
  }

  get isSignup(): boolean {
    return this.formType === FormType.Signup;
  }

  get isPasswordReset(): boolean {
    return this.formType === FormType.Reset;
  }

  get email(): AbstractControl {
    return this.form.get(FormFieldName.Email);
  }

  get password(): AbstractControl {
    return this.form.get(FormFieldName.Password);
  }

  get passwordConfirm(): AbstractControl {
    return this.form.get(FormFieldName.PasswordConfirm);
  }

  get passwordDoesMatch(): boolean {
    // We want to only check if the passwords match only if we are
    // in a signup form since the others don't have such a field
    if (this.formType !== FormType.Signup) {
      return true;
    } else {
      return this.password.value === this.passwordConfirm.value;
    }
  }

  async onSubmit(): Promise<void> {
    this.loading = true;

    const email = this.email.value;
    const password = this.password.value;

    try {
      if (this.isLogin) {
        await signInWithEmailAndPassword(this.auth, email, password);
      }

      if (this.isSignup) {
        await createUserWithEmailAndPassword(this.auth, email, password);
      }

      if (this.isPasswordReset) {
        await sendPasswordResetEmail(this.auth, email);
        this.serverMessage = 'Check your email';
      }
    } catch (error) {
      this.serverMessage = error as string;
    }

    this.loading = false;
  }
}
