import { BrowserModule } from "@angular/platform-browser";
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatButtonModule } from "@angular/material/button";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatInputModule } from "@angular/material/input";
import { MatDialogModule } from "@angular/material/dialog";
import { MatSelectModule } from "@angular/material/select";
import { MatExpansionModule } from '@angular/material/expansion';
import { MatRadioModule } from '@angular/material/radio';
import { NgxSpinnerModule } from "ngx-spinner";
import { ToastrModule } from "ngx-toastr";
import { NgxDropzoneModule } from "ngx-dropzone";
import {
  NgxMatDatetimePickerModule,
  NgxMatTimepickerModule
} from "ngx-mat-datetime-picker";
import {
  MatMomentDateModule,
  MomentDateModule,
  MomentDateAdapter
} from "@angular/material-moment-adapter";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { RoutingComponent } from "./demo/routing/routing.component";
import { RoutingParamComponent } from "./demo/routing-param/routing-param.component";
import { RoutingParamsComponent } from "./demo/routing-params/routing-params.component";
import { RoutingObjectComponent } from "./demo/routing-object/routing-object.component";
import { FileUploadComponent } from "./demo/file-upload/file-upload.component";
import {
  ModalComponent,
  ModalDialogComponent,
  ModalAlertComponent
} from "./demo/modal/modal.component";
import { SpinnerComponent } from "./demo/spinner/spinner.component";
import { ToastComponent } from "./demo/toast/toast.component";
import { FormComponent } from "./demo/form/form.component";
import { DatetimepickerComponent } from "./demo/datetimepicker/datetimepicker.component";
import { ApplicationComponent } from "./demo/application/application.component";
import { ListComponent } from "./demo/application/list/list.component";
import { CriteriaComponent } from "./demo/application/criteria/criteria.component";
import { ViewComponent } from "./demo/application/view/view.component";
import { EditComponent } from "./demo/application/edit/edit.component";
import { LoginComponent } from "./demo/login/login.component";
import { NgxPaginationModule } from 'ngx-pagination';
import { DocLogDialog, EmployeeDialog, FinancialProjectDialog, NewsComponent, StageDialog } from "./news/news.component";
import { NewsCriteriaComponent } from "./news/news-criteria/news-criteria.component";
import { NewsEditComponent } from "./news/news-edit/news-edit.component";
import { EventComponent } from "./event/event.component";
import { EventListComponent } from "./event/event-list/event-list.component";
import { EventCriteriaComponent } from "./event/event-criteria/event-criteria.component";
import { EventEditComponent } from "./event/event-edit/event-edit.component";
import { DropZoneComponent } from "./demo/drop-zone/drop-zone.component";
import { SelectOptionComponent } from "./demo/select-option/select-option.component";
import { InputTextComponent } from "./component/input-text/input-text.component";
import { ButtonComponent } from "./component/button/button.component";
import { NewsListComponent } from "./news/news-list/news-list.component";
import { ButtonEditComponent } from "./component/button-edit/button-edit.component";
import { ButtonViewComponent } from "./component/button-view/button-view.component";
import { ButtonDeleteComponent } from "./component/button-delete/button-delete.component";
import { DateFormatPipe } from "./date-format.pipe";
import { DatetimeFormatPipe } from "./datetime-format.pipe";
import { SelectOptionsComponent } from "./component/select-option/select-option.component";
import { TextAreaComponent } from "./component/text-area/text-area.component";
import { DropzoneSingleComponent } from "./component/dropzone-single/dropzone-single.component";
import { DropzoneMultiComponent } from "./component/dropzone-multi/dropzone-multi.component";
import { DatepickerComponent } from "./component/datepicker/datepicker.component";
import { CustomDatetimepickerComponent } from "./component/custom-datetimepicker/custom-datetimepicker.component";
import { MatFormFieldModule } from "@angular/material/form-field";
import { InputTextBorderComponent } from "./component/input-text-border/input-text-border.component";
import { SwitchComponent } from "./component/switch/switch.component";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { CustomCheckboxComponent } from "./component/custom-checkbox/custom-checkbox.component";
import { MatTabsModule } from "@angular/material/tabs";
import { DropzoneSingleLargeComponent } from "./component/dropzone-single-large/dropzone-single-large.component";
import { ButtonLargeComponent } from "./component/button-large/button-large.component";
import { MAT_DATE_LOCALE } from "@angular/material/core";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { MultiSelectedOptionComponent } from "./component/multi-selected-option/multi-selected-option.component";
import { AngularEditorModule } from '@kolkov/angular-editor';
import { TextEditorComponent } from './component/text-editor/text-editor.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { InputNumberComponent } from './component/input-number/input-number.component';
import { LineCriteriaComponent } from './component/line-criteria/line-criteria.component';
import { DropzoneVideoComponent } from './dropzone-video/dropzone-video.component';
import { PendingComponent } from './pending/pending.component';
import { FormGroupMemberComponent } from './shared/widgets/form-group-member/form-group-member.component';
import { NavigatorBarComponent } from './shared/widgets/navigator-bar/navigator-bar.component';
import { TableMemberComponent } from './shared/widgets/table-member/table-member.component';
import { MatChipsModule } from "@angular/material/chips";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { ChipTagComponent } from './shared/widgets/chip-tag/chip-tag.component';
import { NewsViewlistComponent } from './news/news-viewlist/news-viewlist.component';
import { DashboardV2Component } from './dashboard-v2/dashboard-v2.component';
import { UserLogReportComponent } from './user-log-report/user-log-report.component';
import { OrderApproveComponent } from './order-approve/order-approve.component';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { OrderTransportComponent } from './order-transport/order-transport.component';
import { OrderTransportFormComponent } from './order-transport-form/order-transport-form.component';
import { ConfirmDialog, DriverDialog, RouteDialog, ShipToDialog, StatusDialog, TransportNoDialog, TypeOfWorkDialog, VehicleDialog } from "./dialog/dialog";
import { OrderComponent } from './order/order.component';
import { OrderFormComponent } from './order-form/order-form.component';
import { MasterUserComponent } from './master-user/master-user.component';

@NgModule({
  declarations: [
    AppComponent,
    RoutingComponent,
    RoutingParamComponent,
    RoutingParamsComponent,
    RoutingObjectComponent,
    FileUploadComponent,
    ModalComponent,
    ModalDialogComponent,
    ModalAlertComponent,
    SpinnerComponent,
    ToastComponent,
    FormComponent,
    DatetimepickerComponent,
    ApplicationComponent,
    ListComponent,
    CriteriaComponent,
    ViewComponent,
    EditComponent,
    LoginComponent,
    NewsComponent,
    NewsCriteriaComponent,
    NewsListComponent,
    NewsEditComponent,
    EventComponent,
    EventListComponent,
    EventCriteriaComponent,
    EventEditComponent,
    DropZoneComponent,
    SelectOptionComponent,
    InputTextComponent,
    ButtonComponent,
    ButtonEditComponent,
    ButtonViewComponent,
    ButtonDeleteComponent,
    DateFormatPipe,
    DatetimeFormatPipe,
    SelectOptionsComponent,
    TextAreaComponent,
    DropzoneSingleComponent,
    DropzoneMultiComponent,
    DatepickerComponent,
    CustomDatetimepickerComponent,
    InputTextBorderComponent,
    SwitchComponent,
    CustomCheckboxComponent,
    DropzoneSingleLargeComponent,
    ButtonLargeComponent,
    DashboardComponent,
    MultiSelectedOptionComponent,
    TextEditorComponent,
    InputNumberComponent,
    LineCriteriaComponent,
    DropzoneVideoComponent,
    PendingComponent,
    FormGroupMemberComponent,
    NavigatorBarComponent,
    TableMemberComponent,
    ChipTagComponent,
    NewsViewlistComponent,
    DashboardV2Component,
    FinancialProjectDialog,
    StageDialog,
    EmployeeDialog,
    UserLogReportComponent,
    DocLogDialog,
    OrderApproveComponent,
    OrderTransportComponent,
    OrderTransportFormComponent,
    RouteDialog,
    TypeOfWorkDialog,
    ShipToDialog,
    StatusDialog,
    TransportNoDialog,
    VehicleDialog,
    DriverDialog,
    ConfirmDialog,
    OrderComponent,
    OrderFormComponent,
    MasterUserComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatDatepickerModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    MatTabsModule,
    NgxSpinnerModule,
    ToastrModule.forRoot(),
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    MatMomentDateModule,
    NgxDropzoneModule,
    MatSlideToggleModule,
    NgxChartsModule,
    AngularEditorModule,
    CKEditorModule,
    NgxPaginationModule,
    MatExpansionModule,
    MatRadioModule,
    MatChipsModule,
    MatAutocompleteModule,
    DragDropModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: "en-GB" }],
  bootstrap: [AppComponent]
})
export class AppModule { }
