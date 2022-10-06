import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css']
})
export class ToastComponent implements OnInit {

  public toast: ToastrService;
  constructor(private toastr: ToastrService) {
  }

  ngOnInit(): void {
    // $('.toast-basic').on('click', function () {
    //   M.toast({
    //     html: 'I am a toast!'
    //   })
    // });

    // $('.toast-callback').on('click', function () {
    //   M.toast({
    //     html: 'I am a toast',
    //     completeCallback: function () {
    //     }
    //   })
    // });
  }

  showSuccess() {
    this.toastr.success('Hello world!', 'Toastr fun!', {
      progressBar: true,
      easing: 'ease-in',
      timeOut: 5000
    });
  }

  showError() {
    this.toastr.error('everything is broken', 'Major Error', {
      timeOut: 5000
    });
  }

  showInfo() {
    this.toastr.info('Information For You', 'Information', {
      timeOut: 5000
    });
  }

  showWarning() {
    this.toastr.warning('Warning', 'Waring', {
      timeOut: 5000
    });
  }
}
