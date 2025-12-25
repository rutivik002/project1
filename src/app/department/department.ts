// department.component.ts
import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MyService } from '../my-service';

@Component({
  selector: 'app-department',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HttpClientModule],
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

  constructor(
    private myService: MyService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
  this.myService.getData().subscribe({
    next: (res: any) => {
      console.log('Department API response:', res);

      this.data = res.data ?? res;
      this.rows = [...this.data];
    },
    error: (err) => {
      console.error('Failed to load departments:', err);
      this.data = [];
      this.rows = [];
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
  }

  openEditPopup(row: any) {
    this.isEdit = true;
    this.editId = row.id;
    this.deptName = row.name;
    this.showPopup = true;
  }

  saveData() {
  if (!this.deptName.trim()) return;

  if (this.isEdit && this.editId !== null) {

    const id = this.editId; // ✅ now TypeScript knows it's number

    this.myService.updateData({
      id: id,
      name: this.deptName
    }).subscribe((res: any) => {
      if (res.success === 1) {
        const index = this.data.findIndex(d => d.id === id);
        if (index !== -1) {
          this.data[index].name = this.deptName;
        }
        this.rows = [...this.data];
        this.closePopup();
      }
    });

  } else {
    // add
    this.myService.addData({ name: this.deptName }).subscribe((res: any) => {
      if (res.success === 1) {
        this.data.push({ id: res.id, name: this.deptName });
        this.rows = [...this.data];
        this.closePopup();
        this.loadData();
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
