import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormGroup, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MyService } from '../my-service';


@Component({
  selector: 'app-cities',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ReactiveFormsModule],
  templateUrl: './cities.html',
  styleUrls: ['./cities.scss']
})
export class CitiesComponent implements OnInit {


  data: any[] = [];
  rows: any[] = [];
  pageIndex = 1;
  pageSize = 10;
  totalRecords = 0;
  searchText = '';
  showPopup = false;
  isEdit = false;
  editId: number | null = null;
  cityName : any;
  stateId = 1;
  sortDirection: 'asc' | 'desc' = 'asc';
  cityForm: any;
  submitted = false;


  constructor(private service: MyService, private fb: FormBuilder) { }

  ngOnInit() {
    this.cityForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern('^[a-zA-Z ]+$')
        ]
      ]
    });
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
    this.submitted = false;
    this.cityForm.reset();
    this.showPopup = true;
  }

  // ================= EDIT =================
  openEditPopup(row: any) {
    this.isEdit = true;
    this.editId = row.cityId;
    this.stateId = row.stateId;
    this.submitted = false;
    this.cityForm.patchValue({ name: row.name });
    this.showPopup = true;
  }

  // ================= SAVE =================
 saveData() {
  this.submitted = true;

  if (!this.cityForm) {
    console.error('cityForm not initialized');
    return;
  }

  if (this.cityForm.invalid) {
    this.cityForm.markAllAsTouched();
    return;
  }

  const cityName: string = this.cityForm.get('name')!.value.trim();

  if (this.isEdit && this.editId !== null) {
    this.service.updateCity({
      cityId: this.editId,
      stateId: this.stateId,
      name: cityName
    }).subscribe((res: any) => {
      if (res.success === 1) {
        this.closePopup();
        this.loadCities();
      }
    });

  } else {
    this.service.addCity({
      stateId: this.stateId,
      name: cityName
    }).subscribe((res: any) => {
      if (res.success === 1) {
        this.closePopup();
        this.pageIndex = 1;
        this.loadCities();
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
  this.submitted = false;
  this.cityForm.reset();
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
