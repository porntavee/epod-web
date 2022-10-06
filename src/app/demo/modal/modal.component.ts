import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {
  animal: string;
  name: string;
  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ModalDialogComponent, {
      data: { name: this.name, animal: this.animal },
      disableClose: false,
      id: "modal-component",
      height: "350px",
      width: "600px",
      hasBackdrop: true
    });

    dialogRef.afterOpened().subscribe(result => {
      console.log('The dialog was opened', result);
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      this.animal = result;
    });

    dialogRef.backdropClick().subscribe(result => {
      console.log('The dialog was backdrop click', result);
    });
  }

  openAlert(): void {
    const dialogRef = this.dialog.open(ModalAlertComponent, {
      data: { name: this.name, animal: this.animal },
      disableClose: false,
      id: "modal-component",
      height: "130px",
      width: "450px",
      hasBackdrop: true,
      position: { top: '1%', left: '70%' },

    });

    dialogRef.afterOpened().subscribe(result => {
      console.log('The dialog was opened', result);
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      this.animal = result;
    });

    dialogRef.backdropClick().subscribe(result => {
      console.log('The dialog was backdrop click', result);
    });
  }

}

@Component({
  selector: 'model-dialog',
  templateUrl: 'model-dialog.html',
})
export class ModalDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<ModalDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'model-dialog',
  templateUrl: 'model-alert.html',
})
export class ModalAlertComponent {

  constructor(
    public dialogRef: MatDialogRef<ModalAlertComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    setTimeout(() => {
      /** spinner ends after 5 seconds */
      this.dialogRef.close();
    }, 1000);
  }
}