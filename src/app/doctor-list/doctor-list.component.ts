import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-doctor-list',
  templateUrl: './doctor-list.component.html',
  styleUrls: ['./doctor-list.component.css'],
})
export class DoctorListComponent implements OnInit {
  doctors: any[] = [];
  currentPage = 1;
  limit = 10;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.loadDoctors();
  }

  loadDoctors(): void {
    this.http
      .get<any[]>(
        `http://localhost:3000/doctors?_page=${this.currentPage}&_limit=${this.limit}`
      )
      .subscribe((data) => {
        this.doctors = [...this.doctors, ...data];
        this.currentPage++;
      });
  }

  deleteDoctor(id: number): void {
    this.http.delete(`http://localhost:3000/doctors/${id}`).subscribe(() => {
      this.doctors = this.doctors.filter((doctor) => doctor.id !== id);
    });
  }

  goToHome(): void {
    console.log("naviggte");
    this.router.navigate(['/']);
  }
}
