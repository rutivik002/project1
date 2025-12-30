// department.component.ts
import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule, FormGroup, Validators, FormBuilder, ReactiveFormsModule, Form } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MyService } from '../my-service';
import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { Department } from '../models/department.model';
import { Location } from '@angular/common';

@Component({
  selector: 'app-department',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './department.html',
  styleUrls: ['./department.scss']
})
export class DepartmentComponent implements OnInit {

  rows: Department[] = [];
  data: any[] = [];
  showPopup = false;
  isEdit = false;
  editId: number | null = null;
  deptName = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  departmentForm!: FormGroup;
  submitted: any;
  successMessage = '';
  showSuccess = false;

  constructor(
    private myService: MyService, @Inject(PLATFORM_ID) private platformId: Object,  private location: Location, private router: Router,private fb: FormBuilder, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.departmentForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.pattern('^[a-zA-Z ]+$')
        ]
      ]
    });
    if (isPlatformBrowser(this.platformId)) {
      this.loadData();
    }

  }
  loadData(): void {
    this.myService.getData().subscribe({
      next: (res: any) => {
        // ✅ CORRECT MAPPING
        if (res?.success === 1) {
          this.data = res.data;       // 🔥 MAIN FIX
          this.rows = [...this.data];

        }

        // ✅ FORCE UI UPDATE (SSR + Standalone)
        this.cdr.detectChanges();
      },
      error: err => console.error('API ERROR', err)
    });
  }
  onSearch(value: string) {
    const v = value.toLowerCase().trim();
    this.rows = this.data.filter(d => d.name.toLowerCase().startsWith(v));
  }

  openAddPopup() {
    this.submitted = false;
    this.isEdit = false;
    this.editId = null;
    this.deptName = '';
    this.showPopup = true;
    this.departmentForm.reset();
  }

  openEditPopup(row: any) {
    this.isEdit = true;
    this.submitted = false;
    this.editId = row.id;
    this.deptName = row.name;
    this.showPopup = true;
    this.departmentForm.patchValue({
      name: row.name
    });
  }

  saveData(): void {
    this.submitted = true;

    if (this.departmentForm.invalid) {
      return; // ❌ stop here, show ONE error
    }

    const name = this.departmentForm.value.name;

    if (this.isEdit && this.editId !== null) {
      const id = this.editId;

      this.myService.updateData({ id: this.editId, name }).subscribe((res: any) => {
        if (res.success === 1) {
          const index = this.data.findIndex(d => d.id === id);
          if (index !== -1) this.data[index].name = name;
          this.rows = [...this.data];
          this.showSuccessMessage('Department Edit successfully!');
          this.closePopup();
        }
      });

    } else {
      this.myService.addData({ name }).subscribe((res: any) => {
        if (res.success === 1) {
          this.data.push({ id: res.id, name });
          this.rows = [...this.data];
          this.closePopup();
           this.showSuccessMessage('Department Added successfully!');
        }
      });
    }
  }

  deleteDepartment(id: number) {
    this.myService.deleteData(id).subscribe((res: any) => {
      if (res.success === 1) {
        this.data = this.data.filter(d => d.id !== id);
        this.rows = [...this.data];
      }
           this.showSuccessMessage('Department delete successfully!');
           this.loadData();
    });
  }
  closePopup() {
    this.showPopup = false;
    this.deptName = '';
    this.editId = null;
    this.departmentForm.reset();
  }
  sortByName() {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.rows = [...this.rows].sort((a, b) =>
      this.sortDirection === 'asc'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    );
  }

  private showSuccessMessage(message: string) {
    this.successMessage = message;
    this.showSuccess = true;

    setTimeout(() => {
      this.showSuccess = false;
      this.successMessage = '';
    }, 3000); // auto-hide after 3 sec
  }

  goBack() {
  if (window.history.length > 1) {
    this.location.back();
  } else {
    // optional fallback
    this.router.navigate (['/home']);
  }
}
}
