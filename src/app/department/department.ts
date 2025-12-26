// department.component.ts
import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, FormGroup, Validators, FormBuilder, ReactiveFormsModule, Form } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MyService } from '../my-service';

@Component({
  selector: 'app-department',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule,ReactiveFormsModule, HttpClientModule],
  templateUrl: './department.html',
  styleUrls: ['./department.scss']
})
export class DepartmentComponent implements OnInit {

  data: any[] = [];
  rows: any[] = [];
  showPopup = false;
  isEdit = false;
  editId: number | null = null;
  deptName = '';
  sortDirection: 'asc' | 'desc' = 'asc';
   departmentForm!: FormGroup;

  constructor(
    private myService: MyService,@Inject(PLATFORM_ID) private platformId: Object, private fb: FormBuilder  ) { }

  ngOnInit() {
     this.departmentForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern('^[a-zA-Z ]+$')
        ]
      ]
    });
     console.log('DepartmentComponent initialized');
    this.loadData()
  }
 loadData() {
    this.myService.getData().subscribe({
      next: (res: any) => {
        this.data = res?.data?.data ?? [];
        this.rows = [...this.data];
      },
      error: (err) => {
        console.error('Failed to load departments:', err);
      }
    });
  }
  onSearch(value: string) {
    const v = value.toLowerCase().trim();
    this.rows = this.data.filter(d => d.name.toLowerCase().startsWith(v));
  }

  openAddPopup() {
    this.isEdit = false;
    this.editId = null;
    this.deptName = '';
    this.showPopup = true;
     this.departmentForm.reset();
  }

  openEditPopup(row: any) {
    this.isEdit = true;
    this.editId = row.id;
    this.deptName = row.name;
    this.showPopup = true;
     this.departmentForm.patchValue({
      name: row.name
    });
  }

  saveData() {
    if (this.departmentForm.invalid) {
      this.departmentForm.markAllAsTouched();
      return;
    }

    const name = this.departmentForm.value.name;

    if (this.isEdit && this.editId !== null) {
      const id = this.editId;

      this.myService.updateData({ id, name }).subscribe((res: any) => {
        if (res.success === 1) {
          const index = this.data.findIndex(d => d.id === id);
          if (index !== -1) this.data[index].name = name;
          this.rows = [...this.data];
          this.closePopup();
        }
      });

    } else {
      this.myService.addData({ name }).subscribe((res: any) => {
        if (res.success === 1) {
          this.data.push({ id: res.id, name });
          this.rows = [...this.data];
          this.closePopup();
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
}
