import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-doctor-form',
  templateUrl: './doctor-form.component.html',
  styleUrls: ['./doctor-form.component.css']
})

export class  DoctorFormComponent {
  doctorForm!: FormGroup;
  submitted = false;
  showPassword = false;
  showConfirmPassword = false;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.doctorForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      admissionDate: ['', Validators.required],
      degrees: this.fb.array([this.createDegreeField(), this.createDegreeField()]), // Two default degrees
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[0-9])(?=.*[\W_]).{8,}$/)]],
      confirmPassword: ['', Validators.required],
      onlineConsultFee: ['', [Validators.required, Validators.min(0)]],
      inPersonConsultFee: ['', [Validators.required, Validators.min(0)]],

    }, {
      validators: this.passwordMatchValidator
    });
  }

  get degrees(): FormArray {
    return this.doctorForm.get('degrees') as FormArray;
  }

  createDegreeField(): AbstractControl {
    return this.fb.control('', Validators.required);
  }

  addDegree(): void {
    this.degrees.push(this.createDegreeField());
  }

  passwordMatchValidator(form: AbstractControl) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.doctorForm.invalid) {
      return;
    }

    this.http.post('http://localhost:3000/doctors', this.doctorForm.value)
      .subscribe(response => {
        alert('Doctor registered successfully!');
        this.doctorForm.reset();
        this.submitted = false;
        this.router.navigate(['/thank-you']);
      }, error => {
        alert('Error registering doctor!');
      });
  }
}