import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MyService } from '../my-service';

@Component({
  selector: 'app-cities',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './cities.html',
  styleUrls: ['./cities.scss']
})
export class CitiesComponent implements OnInit {

  // TABLE DATA
  data: any[] = [];
  rows: any[] = [];

  // PAGINATION
  pageIndex = 1;
  pageSize = 10;
  totalRecords = 0;

  // SEARCH
  searchText = '';

  // CRUD
  showPopup = false;
  isEdit = false;
  editId: number | null = null;
  cityName = '';
  stateId = 1;

  constructor(private service: MyService) {}

  ngOnInit() {
    this.loadCities();
  }

  // ================= LOAD DATA =================
  loadCities() {
    this.service.getCities(this.searchText, this.pageIndex, this.pageSize)
      .subscribe({
        next: (res: any) => {
          if (res.success === 1) {
            this.rows = res.data.data;          // current page rows
            this.totalRecords = res.data.totalrecords;
          }
        },
        error: err => console.error(err)
      });
  }

  // ================= SEARCH =================
  onSearch(value: string) {
    this.searchText = value;
    this.pageIndex = 1;        // reset to first page
    this.loadCities();
  }

  // ================= PAGINATION =================
  get totalPages(): number {
    return Math.ceil(this.totalRecords / this.pageSize);
  }

  nextPage() {
    if (this.pageIndex < this.totalPages) {
      this.pageIndex++;
      this.loadCities();
    }
  }

  prevPage() {
    if (this.pageIndex > 1) {
      this.pageIndex--;
      this.loadCities();
    }
  }

  // ================= ADD =================
  openAddPopup() {
    this.isEdit = false;
    this.editId = null;
    this.cityName = '';
    this.showPopup = true;
  }

  // ================= EDIT =================
  openEditPopup(row: any) {
    this.isEdit = true;
    this.editId = row.cityId;
    this.cityName = row.name;
    this.stateId = row.stateId;
    this.showPopup = true;
  }

  // ================= SAVE =================
  saveData() {
    if (!this.cityName.trim()) return;

    if (this.isEdit && this.editId !== null) {
      // UPDATE
      this.service.updateCity({
        cityId: this.editId,
        stateId: this.stateId,
        name: this.cityName
      }).subscribe(res => {
        if (res.success === 1) {
          this.closePopup();
          this.loadCities();
        }
      });

    } else {
      // ADD
      this.service.addCity({
        stateId: this.stateId,
        name: this.cityName
      }).subscribe(res => {
        if (res.success === 1) {
          this.closePopup();
          this.pageIndex = 1;
          this.loadCities();
        } else if (res.success === 2) {
          alert(res.message);
        }
      });
    }
  }

  // ================= DELETE =================
  deleteCity(id: number) {
    if (!confirm('Delete this city?')) return;

    this.service.deleteCity(id).subscribe(res => {
      if (res.success === 1) {
        this.loadCities();
      }
    });
  }

  closePopup() {
    this.showPopup = false;
    this.cityName = '';
    this.editId = null;
  }
}
