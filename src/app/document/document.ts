import { Component, OnInit, Inject, PLATFORM_ID, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MyService } from '../my-service';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-document',
  standalone: true,
  imports: [CommonModule, FormsModule, ],
  templateUrl: './document.html'
})
export class DocumentComponent implements OnInit {

  showAddPopup = false;
  selectedFile!: File;
  successMessage = '';
  showSuccess = false;

  documentForm = {
    portfolioTypeId: 1,
    clientId: 1,
    trackingNumber: '0007933261001753412',
      remark: ''
  };

  documentList: any[] = [];

  constructor(private myService: MyService, @Inject(PLATFORM_ID) private platformId: Object, private cdr: ChangeDetectorRef, private location: Location,
    private router: Router) { }

  ngOnInit(): void {
    this.loadDocuments();   // 👈 LIST ON PAGE LOAD
  }

  openAddPopup() {
    this.showAddPopup = true;
  }

  closeAddPopup() {
    this.showAddPopup = false;
    this.selectedFile = undefined as any;
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  // SAVE DOCUMENT — USES YOUR SERVICE
  saveDocument() {
    if (!this.selectedFile) {
      alert('Please select file');
      return;
    }

    this.myService
      .addCustomerOtherDocument(this.documentForm, this.selectedFile)
      .subscribe({
        next: () => {


          // ✅ reload list — NEW FILE APPEARS
          this.showSuccessMessage('Department Added successfully!');
          this.loadDocuments();
            this.closeAddPopup();
        },
        error: () => alert('Upload failed')
      });

  }

  // LOAD LIST — USES YOUR SERVICE
  loadDocuments() {
    this.myService.getCustomerDocumentList({
      portfolioTypeId: 1,
      clientId: 1,
      trackingNo: this.documentForm.trackingNumber
    }).subscribe(res => {

      this.documentList = (res.data || []).filter(
        (doc: any) => doc.parentType === 7,

      );

      this.cdr.detectChanges();


    });
  }


  viewDocument(doc: any) {
    this.myService.viewCustomerDocument(doc.id).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank'); // This opens the actual file in a new tab
      },
      error: () => alert('Unable to open file')
    });
  }


  // DOWNLOAD DOCUMENT
  downloadDocument(doc: any) {
    const url =
      `http://192.168.10.248:81/api/commonDocument/getCustomerDocument?id=${doc.id}`;

    const link = document.createElement('a');
    link.href = url;
    link.download = doc.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    this.showSuccessMessage('Department Download successfully!');
  }

  private showSuccessMessage(message: string) {
    this.successMessage = message;
    this.showSuccess = true;

    setTimeout(() => {
      this.showSuccess = false;
      this.successMessage = '';
    }, 500); // auto-hide after 3 sec
  }

  goBack() {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      // optional fallback
      this.router.navigate(['/home']);
    }

  }


}
