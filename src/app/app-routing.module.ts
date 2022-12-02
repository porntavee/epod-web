import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoutingComponent } from './demo/routing/routing.component';
import { RoutingParamComponent } from './demo/routing-param/routing-param.component';
import { RoutingParamsComponent } from './demo/routing-params/routing-params.component';
import { RoutingObjectComponent } from './demo/routing-object/routing-object.component';
import { FileUploadComponent } from './demo/file-upload/file-upload.component';
import { ModalComponent } from './demo/modal/modal.component';
import { SpinnerComponent } from './demo/spinner/spinner.component';
import { ToastComponent } from './demo/toast/toast.component';
import { FormComponent } from './demo/form/form.component';
import { DatetimepickerComponent } from './demo/datetimepicker/datetimepicker.component';
import { ApplicationComponent } from './demo/application/application.component';
import { LoginComponent } from './demo/login/login.component';
import { NewsComponent } from './news/news.component';
import { NewsEditComponent } from './news/news-edit/news-edit.component';
import { EventComponent } from './event/event.component';
import { EventEditComponent } from './event/event-edit/event-edit.component';
import { DropZoneComponent } from './demo/drop-zone/drop-zone.component';
import { SelectOptionComponent } from './demo/select-option/select-option.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardV2Component } from './dashboard-v2/dashboard-v2.component';
import { PendingComponent } from './pending/pending.component';
import { NewsViewlistComponent } from './news/news-viewlist/news-viewlist.component';
import { UserLogReportComponent } from './user-log-report/user-log-report.component';
import { OrderApproveComponent } from './order-approve/order-approve.component';
import { OrderTransportComponent } from './order-transport/order-transport.component';
import { OrderTransportFormComponent } from './order-transport-form/order-transport-form.component';
import { OrderComponent } from './order/order.component';
import { OrderFormComponent } from './order-form/order-form.component';
import { MasterUserComponent } from './master-user/master-user.component'
import { MasterShiplocationComponent } from './master-shiplocation/master-shiplocation.component'
import { ReturnDocumentComponent } from './return-document/return-document.component';
import { TrackingStatusComponent } from './tracking-status/tracking-status.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'dashboard', component: DashboardV2Component},
  { path: 'pending', component: PendingComponent },
  { path: 'demo-routing', component: RoutingComponent },
  { path: 'demo-routing-param/:id', component: RoutingParamComponent },
  { path: 'demo-routing-params/:id/:id2', component: RoutingParamsComponent },
  { path: 'demo-routing-object', component: RoutingObjectComponent },
  { path: 'demo-file-upload', component: FileUploadComponent },
  { path: 'demo-modal', component: ModalComponent },
  { path: 'demo-spinner', component: SpinnerComponent },
  { path: 'demo-toast', component: ToastComponent },
  { path: 'demo-form', component: FormComponent },
  { path: 'demo-datetimepicker', component: DatetimepickerComponent },
  { path: 'demo-application', component: ApplicationComponent },
  { path: 'demo-login', component: LoginComponent },
  { path: 'demo-drop-zone', component: DropZoneComponent },
  { path: 'demo-select-option', component: SelectOptionComponent },
  { path: 'news', component: NewsComponent },
  { path: 'news-edit/:code', component: NewsEditComponent },
  { path: 'event', component: EventComponent },
  { path: 'event-edit/:code', component: EventEditComponent },
  { path: 'news-viewlist/:code', component: NewsViewlistComponent },
  { path: 'user-log-report', component: UserLogReportComponent },
  { path: 'order-approve', component: OrderApproveComponent },
  { path: 'order', component: OrderComponent },
  { path: 'order-form/:id', component: OrderFormComponent },
  { path: 'order-transport', component: OrderTransportComponent },
  { path: 'order-transport-form/:id', component: OrderTransportFormComponent },
  { path: 'master-user', component: MasterUserComponent },
  { path: 'master-shiplocation', component: MasterShiplocationComponent },
  { path: 'return-document', component: ReturnDocumentComponent },
  { path: 'tracking-status', component: TrackingStatusComponent },
  { path: 'return-document', component: ReturnDocumentComponent },
  { path: 'return-transaction', component: ReturnTransactionComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
