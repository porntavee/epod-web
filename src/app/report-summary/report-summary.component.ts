import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { Component, KeyValueDiffers, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import * as moment from "moment";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import {
  ConfirmDialog,
  TransportNoDialog,
  ShipToDialog,
  StatusDialog,
  TypeOfWorkDialog,
  RouteDialog,
  VehicleDialog,
  DriverDialog,
} from "../dialog/dialog";
import { ExcelService } from "../shared/excel.service";
import { ServiceProviderService } from "../shared/service-provider.service";

@Component({
  selector: "app-report-summary",
  templateUrl: "./report-summary.component.html",
  styleUrls: ["./report-summary.component.css"],
})
export class ReportSummaryComponent implements OnInit {
  isDelivery: boolean = false;
  isMainPage: boolean = true;
  isFormPage: boolean = false;
  isTimeSheetPage: boolean = false;
  listModel: any = [
    {
      Seq: 1,
      Code: "T",
      Description: "รอจัดใบคุมรถ",
      NumStatus: 0,
    },
    {
      Seq: 2,
      Code: "O",
      Description: "รอยืนยันใบคุมรถ",
      NumStatus: 0,
    },
    {
      Seq: 3,
      Code: "W",
      Description: "รอคนขับรับงาน",
      NumStatus: 0,
    },
    {
      Seq: 5,
      Code: "L",
      Description: "ระหว่างรับสินค้า",
      NumStatus: 0,
    },
    {
      Seq: 6,
      Code: "D",
      Description: "ระหว่างจัดส่งสินค้า",
      NumStatus: 0,
    },
    {
      Seq: 7,
      Code: "P",
      Description: "จัดส่งสินค้าสำเร็จ",
      NumStatus: 0,
    },
    {
      Seq: 8,
      Code: "F",
      Description: "จัดส่งสินค้าไม่สำเร็จ",
      NumStatus: 0,
    },
    {
      Seq: 9,
      Code: "R",
      Description: "คนขับคืนบิลเสร็จสิ้น",
      NumStatus: 0,
    },
    {
      Seq: 10,
      Code: "S",
      Description: "คืนบิลเสร็จสิ้น",
      NumStatus: 0,
    },
    {
      Seq: 11,
      Code: "C",
      Description: "ยกเลิก",
      NumStatus: 0,
    },
  ]; //ข้อมูลในตารางหน้า Main
  listDetailModel: any = [
    {
      CustomerName: "Pick Up order",
      TypeOfWork: "Normal",
      PlanIn: "25/9/2022",
      ActualIn: "25/9/2022",
      Status: "Complete",
    },
    {
      CustomerName: "Customer1",
      TypeOfWork: "Service",
      PlanIn: "25/9/2022",
      ActualIn: "",
      Status: "Pending",
    },
  ];

  listDetailModel2: any = [
    {
      InvoiceNo: "2032022225",
      ApptDate: "25/9/2022",
      ActualArrive: "25/9/2022",
      Status: "On time",
    },
  ];

  listDetailModel3: any = [
    {
      DriverReturn: "2032022225",
      DueDate: "25/9/2022",
      ReturnDate: "25/9/2022",
      Status: "On time",
    },
  ];
  headerModel: any = {};
  criteriaModel: any = {}; //ค้นหา
  title: string = "เพิ่มข้อมูล";
  model: any = {}; //ข้อมูล Form
  models: any = []; //ข้อมูลในตารางหน้า Form
  timeSheetModel: any = {};
  dateControl = new FormControl(moment().format("YYYYMMDD"));

  mode: any = "create";
  listEmployee: any = [];
  listEmployeeCode: any = [];
  listFirstName: any = [];
  listActivityType: any = [];
  listFinancialProject: any = [];
  listStage: any = [];
  costCenter: any = "";
  p = 1;

  listRoute: any = [];

  lat = 51.678418;
  lng = 7.809007;

  timelineModel: any = {};

  constructor(
    public dialog: MatDialog,
    private serviceProviderService: ServiceProviderService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private differs: KeyValueDiffers,
    private excelService: ExcelService
  ) {}

  ngOnInit(): void {
    const startDate = new Date();
    const endDate = new Date();
    this.criteriaModel.startDate = moment(
      startDate.setDate(startDate.getDate() - 7)
    ).format("YYYYMMDD");
    this.criteriaModel.endDate = moment(endDate).format("YYYYMMDD");
    this.readSumStatus();
    this.read();
  }

  viewModel: any;
  readSumStatus() {
    this.spinner.show();

    let criteria = {
      userinformation: this.serviceProviderService.userinformation,
      BeginDate:
        this.criteriaModel.startDate != undefined &&
        this.criteriaModel.startDate != "Invalid date"
          ? moment(this.criteriaModel.startDate).format(
              "YYYY-MM-DD 00:00:00.000"
            )
          : undefined,
      EndDate:
        this.criteriaModel.endDate != undefined &&
        this.criteriaModel.endDate != "Invalid date"
          ? moment(this.criteriaModel.endDate).format("YYYY-MM-DD 00:00:00.000")
          : undefined,
    };

    let json = JSON.stringify(criteria);

    this.serviceProviderService
      .post("api/Transport/GetAllStatus", criteria)
      .subscribe(
        (data) => {
          this.spinner.hide();
          let model: any = {};
          model = data;
          this.viewModel = model;

          if (model.Status) {
            // model.Data.forEach(element => {
            //   element.TransportDate = moment(element.TransportDate).format('DD-MM-YYYY');
            //   // element.DateTo = moment(element.DateTo).format('DD-MM-YYYY');
            //   // element.LastDate = moment(element.LastDate).format('DD-MM-YYYY');
            // });

            this.listModel = model.Data;
          } else {
            this.listModel = [];
            this.spinner.hide();
            this.toastr.error(model.Message, "แจ้งเตือนระบบ", {
              timeOut: 5000,
            });
          }
        },
        (err) => {
          this.spinner.hide();
          this.toastr.error(err.message, "แจ้งเตือนระบบ", { timeOut: 5000 });
        }
      );
  }

  viewModel2: any = [];
  read() {
    this.spinner.show();

    let criteria = {
      userinformation: this.serviceProviderService.userinformation,
      InvoiceDateStart:
        this.criteriaModel.startDate != undefined &&
        this.criteriaModel.startDate != "Invalid date"
          ? moment(this.criteriaModel.startDate).format("YYYY-MM-DD")
          : undefined,
      InvoiceDateEnd:
        this.criteriaModel.endDate != undefined &&
        this.criteriaModel.endDate != "Invalid date"
          ? moment(this.criteriaModel.endDate).format("YYYY-MM-DD")
          : undefined,
    };

    let json = JSON.stringify(criteria);

    debugger;
    this.serviceProviderService
      .post("api/Report/ReportTransportOrders", criteria)
      .subscribe(
        (data) => {
          debugger;
          this.spinner.hide();
          let model: any = {};
          model = data;

          if (model.Status) {
            model.Data.forEach((element) => {
              element.TransportDate = moment(element.TransportDate).format(
                "DD-MM-YYYY"
              );
              element.InvoiceDate = moment(element.InvoiceDate).format(
                "DD-MM-YYYY"
              );
              element.OrderEstimate = moment(element.OrderEstimate).format(
                "DD-MM-YYYY"
              );
              // element.DriverFirstName = element.DriverFirstName + ' ' + element.DriverLastName;
              // element.DateTo = moment(element.DateTo).format('DD-MM-YYYY');
              // element.LastDate = moment(element.LastDate).format('DD-MM-YYYY');

              element.ShipmentNo = element.ShipmentNo ?? "";
              element.TransportNo = element.TransportNo ?? "";
              element.OrderNo = element.OrderNo ?? "";
              element.InvoiceNo = element.InvoiceNo ?? "";
              element.CustomerCode = element.CustomerCode ?? "";
              element.CustomerName = element.CustomerName ?? "";

              element.ShiptoCode = element.ShiptoCode ?? "";
              element.ShiptoName = element.ShiptoName ?? "";
              element.Vehicle = element.Vehicle ?? "";
              element.VehicleType = element.VehicleType ?? "";
              element.Route = element.Route ?? "";
              element.SubRoute = element.SubRoute ?? "";
              element.Transport = element.Transport ?? "";
              element.DriverName = element.DriverName ?? "";
              element.HelperName = element.HelperName ?? "";
              element.DateIn =
                element.DateIn != null
                  ? element.DateIn.substr(8, 2) +
                    "-" +
                    element.DateIn.substr(5, 2) +
                    "-" +
                    element.DateIn.substr(0, 4)
                  : element.DateIn ?? "";
              element.TimeIn =
                element.TimeIn != null
                  ? element.TimeIn.substring(0, 8)
                  : element.TimeIn ?? "";
              element.DateOut =
                element.DateOut != null
                  ? element.DateOut.substr(8, 2) +
                    "-" +
                    element.DateOut.substr(5, 2) +
                    "-" +
                    element.DateOut.substr(0, 4)
                  : element.DateOut ?? "";
              element.TimeOut =
                element.TimeOut != null
                  ? element.TimeOut.substring(0, 8)
                  : element.TimeOut ?? "";
              element.LatitudeLongitudeIn = element.LatitudeLongitudeIn ?? "";
              element.OTDelivery = element.OTDelivery ?? "";
              element.OTBillReturn = element.OTBillReturn ?? "";
              element.AdminReturnDate =
                element.AdminReturnDate != null
                  ? element.AdminReturnDate.substr(8, 2) +
                    "-" +
                    element.AdminReturnDate.substr(5, 2) +
                    "-" +
                    element.AdminReturnDate.substr(0, 4)
                  : element.AdminReturnDate ?? "";

              element.DeliveryLocation = element.DeliveryLocation ?? "";
              element.DeliveryCheckInLocation =
                element.DeliveryCheckInLocation ?? "";
              element.DeliveryCheckOutLocation =
                element.DeliveryCheckOutLocation ?? "";
              //D P R S
              // var strDeliveryStatus = "DPRS";
              // if (strDeliveryStatus.includes(String(element.OrderStatus))) {
              //   this.isDelivery = true;
              // }
            });

            this.viewModel2 = model.Data;

            // console.log(this.viewModel2);
          } else {
            this.listModel = [];
            this.spinner.hide();
            this.toastr.error(model.Message, "แจ้งเตือนระบบ", {
              timeOut: 5000,
            });
          }
        },
        (err) => {
          this.spinner.hide();
          this.toastr.error(err.message, "แจ้งเตือนระบบ", { timeOut: 5000 });
        }
      );
  }

  readDetail(param) {
    this.spinner.show();

    let criteria = {
      userinformation: this.serviceProviderService.userinformation,
      OrderNo: param.OrderNo,
    };

    // this.headerModel = param;
    // this.headerModel.DriverFirstName = '';
    // this.headerModel.DriverFirstName = this.headerModel.DriverFirstName + ' ' + this.headerModel.DriverLastName;

    let json = JSON.stringify(criteria);
    this.isDelivery = false;
    this.serviceProviderService
      .post("api/Transport/GetTransportDetail", criteria)
      .subscribe(
        (data) => {
          this.spinner.hide();
          let model: any = {};
          model = data;
          // this.viewModel = model;

          if (model.Status) {
            this.headerModel = model.Data[0];

            this.headerModel.OrderEstimate = moment(
              model.Data[0].OrderEstimate
            ).format("DD-MM-YYYY");
            this.headerModel.OwnerDescription =
              model.Data[0].OwnerCode + " - " + model.Data[0].OwnerName;
            this.headerModel.ShiptoDescription =
              model.Data[0].ShiptoCode + " - " + model.Data[0].ShiptoName;

            // this.headerModel = model.Data;

            this.isMainPage = false;
            this.isFormPage = true;

            this.readTimeline(param);
          } else {
            this.spinner.hide();
            this.toastr.error(model.Message, "แจ้งเตือนระบบ", {
              timeOut: 5000,
            });
          }
        },
        (err) => {
          this.spinner.hide();
          this.toastr.error(err.message, "แจ้งเตือนระบบ", { timeOut: 5000 });
        }
      );
  }

  readTimeline(param) {
    // debugger
    // this.spinner.show();

    let criteria = {
      userinformation: this.serviceProviderService.userinformation,
      TransportNo: param.TransportNo,
    };

    // this.headerModel = param;
    // this.headerModel.DriverFirstName = '';
    // this.headerModel.DriverFirstName = this.headerModel.DriverFirstName + ' ' + this.headerModel.DriverLastName;

    let json = JSON.stringify(criteria);
    this.isDelivery = false;
    this.serviceProviderService
      .post("api/Transport/GetTransportStatus", criteria)
      .subscribe(
        (data) => {
          // this.spinner.hide();
          let model: any = {};
          model = data;
          // this.viewModel = model;

          // debugger

          if (model.Status) {
            this.timelineModel = model.Data[0];
            // this.headerModel = model.Data[0];

            // this.headerModel.OrderEstimate = moment(model.Data[0].OrderEstimate).format('DD-MM-YYYY');
            // this.headerModel.OwnerDescription = model.Data[0].OwnerCode + ' - ' + model.Data[0].OwnerName;
            // this.headerModel.ShiptoDescription = model.Data[0].ShiptoCode + ' - ' + model.Data[0].ShiptoName;

            // // this.headerModel = model.Data;

            // this.isMainPage = false;
            // this.isFormPage = true;
          } else {
            // this.spinner.hide();
            this.toastr.error(model.Message, "แจ้งเตือนระบบ", {
              timeOut: 5000,
            });
          }
        },
        (err) => {
          this.spinner.hide();
          this.toastr.error(err.message, "แจ้งเตือนระบบ", { timeOut: 5000 });
        }
      );
  }

  confirm() {
    this.spinner.show();

    for (let index = 0; index < this.listDetailModel.length; index++) {
      this.listDetailModel[index].Seq = index + 1;
    }
    // this.listDetailModel.forEach(element => {
    //   element.Seq =
    // });

    let criteria = {
      userinformation: this.serviceProviderService.userinformation,
      TransportNo: this.headerModel.TransportNo,
      TTRANSPORTDS: this.listDetailModel,
    };

    let json = JSON.stringify(criteria);

    this.serviceProviderService
      .post("api/Transport/ApproveTransport", criteria)
      .subscribe(
        (data) => {
          this.spinner.hide();
          let model: any = {};
          model = data;
          this.viewModel = model;

          if (model.Status) {
            this.spinner.hide();
            this.toastr.success("บันทึกเสร็จสิ้น", "แจ้งเตือนระบบ", {
              timeOut: 5000,
            });
            this.backToMain();
          } else {
            this.spinner.hide();
            this.toastr.error(model.Message, "แจ้งเตือนระบบ", {
              timeOut: 5000,
            });
          }
        },
        (err) => {
          this.spinner.hide();
          this.toastr.error(err.message, "แจ้งเตือนระบบ", { timeOut: 5000 });
        }
      );
  }

  cancel() {
    //ต้องเอาไปใส่ใน app.module ที่ declarations
    const dialogRef = this.dialog.open(ConfirmDialog, {
      disableClose: false,
      height: "150px",
      width: "300px",
      data: { title: "คุณต้องการยกเลิกใช่หรือไม่?" },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);

      if (result) {
        this.spinner.show();

        let criteria = {
          userinformation: this.serviceProviderService.userinformation,
          TransportNo: this.headerModel.TransportNo,
          // "TTRANSPORTDS": this.listDetailModel
        };

        let json = JSON.stringify(criteria);

        this.serviceProviderService
          .post("api/Transport/CancelTransport", criteria)
          .subscribe(
            (data) => {
              this.spinner.hide();
              let model: any = {};
              model = data;
              this.viewModel = model;

              if (model.Status) {
                this.spinner.hide();
                this.toastr.success("บันทึกยกเลิกเสร็จสิ้น", "แจ้งเตือนระบบ", {
                  timeOut: 5000,
                });
                debugger;
                this.backToMain();
              } else {
                this.spinner.hide();
                this.toastr.error(model.Message, "แจ้งเตือนระบบ", {
                  timeOut: 5000,
                });
              }
            },
            (err) => {
              this.spinner.hide();
              this.toastr.error(err.message, "แจ้งเตือนระบบ", {
                timeOut: 5000,
              });
            }
          );
      }
    });
  }

  setSeq(param, idx) {
    param = idx;
    return param;
  }

  //use
  chooseTransportNo() {
    //ต้องเอาไปใส่ใน app.module ที่ declarations
    const dialogRef = this.dialog.open(TransportNoDialog, {
      disableClose: false,
      height: "400px",
      width: "800px",
      data: { title: "Transport No." },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);

      if (result != undefined) {
        // this.criteriaModel.transportTypeId = result.Id;
        this.criteriaModel.transportNo = result.TransportNo;
        // this.criteriaModel.shipToCode = result.Code;
        // this.criteriaModel.shipToAddress = result.Address;
        // this.criteriaModel.shipToDescription = result.Code + ' - ' + result.CustomerName;
        // param.Code = result.Code;
        // param.FirstName = result.firstName;
        // param.LastName = result.lastName;
        // param.UserID = result.empID;
        // this.costCenter = result.CostCenter;
      }
    });
  }

  //use
  chooseShipTo() {
    //ต้องเอาไปใส่ใน app.module ที่ declarations
    const dialogRef = this.dialog.open(ShipToDialog, {
      disableClose: false,
      height: "400px",
      width: "800px",
      data: { title: "สถานที่รับ-ส่งสินค้า" },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);

      if (result != undefined) {
        // this.criteriaModel.transportTypeId = result.Id;
        this.criteriaModel.shipToId = result.Id;
        this.criteriaModel.shipToCode = result.Code;
        this.criteriaModel.shipToAddress = result.Address;
        this.criteriaModel.shipToDescription =
          result.Code + " - " + result.CustomerName;
        // param.Code = result.Code;
        // param.FirstName = result.firstName;
        // param.LastName = result.lastName;
        // param.UserID = result.empID;
        // this.costCenter = result.CostCenter;
      }
    });
  }

  //use
  chooseStatus() {
    //ต้องเอาไปใส่ใน app.module ที่ declarations
    const dialogRef = this.dialog.open(StatusDialog, {
      disableClose: false,
      height: "400px",
      width: "800px",
      data: { title: "สถานะเอกสาร" },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);

      if (result != undefined) {
        // this.criteriaModel.transportTypeId = result.Id;
        this.criteriaModel.statusCode = result.Code;
        this.criteriaModel.statusDescription =
          result.Code + " - " + result.Description;
        // param.Code = result.Code;
        // param.FirstName = result.firstName;
        // param.LastName = result.lastName;
        // param.UserID = result.empID;
        // this.costCenter = result.CostCenter;
      }
    });
  }

  //use
  chooseTypeOfWork() {
    //ต้องเอาไปใส่ใน app.module ที่ declarations
    const dialogRef = this.dialog.open(TypeOfWorkDialog, {
      disableClose: false,
      height: "400px",
      width: "800px",
      data: { title: "ประเภทงาน" },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);

      if (result != undefined) {
        // this.criteriaModel.transportTypeId = result.Id;
        this.criteriaModel.typeOfWorkCode = result.Code;
        this.criteriaModel.typeOfWorkDescription =
          result.Code + " - " + result.Description;
        // param.Code = result.Code;
        // param.FirstName = result.firstName;
        // param.LastName = result.lastName;
        // param.UserID = result.empID;
        // this.costCenter = result.CostCenter;
      }
    });
  }

  //use
  chooseRoute() {
    //ต้องเอาไปใส่ใน app.module ที่ declarations
    const dialogRef = this.dialog.open(RouteDialog, {
      disableClose: false,
      height: "400px",
      width: "800px",
      data: {
        title: "เส้นทางหลัก",
        listData: this.listRoute,
        listDataSearch: this.listRoute,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);

      if (result != undefined) {
        this.criteriaModel.subRouteId = "";
        this.criteriaModel.subRouteCode = "";
        this.criteriaModel.subRouteDescription = "";

        this.criteriaModel.routeId = result.Id;
        this.criteriaModel.routeCode = result.Code;
        this.criteriaModel.routeDescription =
          result.Code + " - " + result.Description;
        // param.Code = result.Code;
        // param.FirstName = result.firstName;
        // param.LastName = result.lastName;
        // param.UserID = result.empID;
        // this.costCenter = result.CostCenter;
      }
    });
  }

  //use
  chooseVehicle() {
    //ต้องเอาไปใส่ใน app.module ที่ declarations
    const dialogRef = this.dialog.open(VehicleDialog, {
      disableClose: false,
      height: "400px",
      width: "800px",
      data: { title: "ทะเบียนรถ" },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);

      if (result != undefined) {
        this.criteriaModel.vehicleId = result.Id;
        this.criteriaModel.vehicleCode = result.Code;
        this.criteriaModel.vehicleDescription =
          result.Code + " - " + result.Description;
        // param.Code = result.Code;
        // param.FirstName = result.firstName;
        // param.LastName = result.lastName;
        // param.UserID = result.empID;
        // this.costCenter = result.CostCenter;
      }
    });
  }

  //use
  chooseDriver() {
    //ต้องเอาไปใส่ใน app.module ที่ declarations
    const dialogRef = this.dialog.open(DriverDialog, {
      disableClose: false,
      height: "400px",
      width: "800px",
      data: { title: "คนขับ" },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);

      if (result != undefined) {
        this.criteriaModel.driverId = result.Id;
        this.criteriaModel.driverCode = result.Code;
        this.criteriaModel.driverDescription =
          result.Code + " - " + result.FirstName + " " + result.LastName;
        // param.Code = result.Code;
        // param.FirstName = result.firstName;
        // param.LastName = result.lastName;
        // param.UserID = result.empID;
        // this.costCenter = result.CostCenter;
      }
    });
  }

  //use
  readRoute() {
    let criteria = {
      userinformation: this.serviceProviderService.userinformation,
      Code: "",
    };

    // let json = JSON.stringify(criteria);
    this.serviceProviderService
      .post("api/Masters/GetRoute", criteria)
      .subscribe(
        (data) => {
          let model: any = {};
          model = data;
          this.viewModel = model;

          if (model.Status) {
            this.listRoute = model.Data;
          } else {
            this.spinner.hide();
            this.toastr.error(model.Message, "แจ้งเตือนระบบ", {
              timeOut: 5000,
            });
          }
        },
        (err) => {
          this.spinner.hide();
          this.toastr.error(err.message, "แจ้งเตือนระบบ", { timeOut: 5000 });
        }
      );
  }

  backToMain() {
    this.isMainPage = true;
    this.isFormPage = false;
    this.isTimeSheetPage = false;
    // this.read();

    window.scroll(0, 0);
    // this.model = {};
    // this.models = [];
    // this.listModel = [];
  }

  reportModel: any = [];
  exportAsXLSX(): void {
    // this.spinner.show();

    let model = [];
    this.viewModel2.forEach((element) => {
      model.push({
        "Order No.": element.ShipmentNo,
        "Manifest Date": element.TransportDate,
        Manifest: element.TransportNo,
        "Sale Order (SO)": element.OrderNo,
        "INV NO": element.InvoiceNo,
        INV_DATE: element.InvoiceDate,
        "Appointment Date": element.OrderEstimate,
        "Owner Name": element.CustomerName,
        "Customer Code": element.ShiptoCode,
        "Customer Name": element.ShiptoName,
        "Ship to": element.ShiptoAdress,
        "License Plate": element.Vehicle,
        "Truck Type": element.VehicleType,
        Route: element.Route,
        SubRoute: element.SubRoute,
        "Transport By": element.Transport,
        "Driver Name": element.DriverName,
        "Helper Name": element.HelperName,
        "Total Drop": element.NumDrop,
        "Total Carton": element.Qty.toFixed(2),
        "Weight (kg)": element.Weight.toFixed(2),
        "Cubic meter": element.CBM.toFixed(2),
        "Date (In)": element.DateIn,
        "Time (In)": element.TimeIn,
        "Date (Out)": element.DateOut,
        "Time (Out)": element.TimeOut,
        // "DeliveryLocation": element.DeliveryLocation ?? "",
        // "DeliveryCheckInLocation": element.DeliveryCheckInLocation ?? "",
        // "DeliveryCheckOutLocation": element.DeliveryCheckOutLocation ?? "",
        "Latitude & Longitude In": element.DeliveryLocation,
        "Check Location In": element.ChechDeliveryCheckInDistance ?? "",
        "Check Location Out": element.ChechDeliveryCheckOutDistance ?? "",
        "Delivery Status": element.OTDelivery,
        "POD  Status": element.OTBillReturn,
        "POD Return to Bang Na DC": element.AdminReturnDate,
        "Order Status": element.OrderStatus ?? "",
        "Closure Reason": element.ClosureReason ?? "",
      });
    });

    debugger;
    this.excelService.exportAsExcelFile(model, "Summary Report");

    // let criteria = {
    //   "userinformation": this.serviceProviderService.userinformation,
    //   "DocNum": param.DocNum
    // }

    // let json = JSON.stringify(criteria);

    // this.serviceProviderService.post('/api/B1/getTimeSheetLog', criteria).subscribe(data => {
    //   this.spinner.hide();
    //   let model: any = {};
    //   model = data;
    //   // this.viewModel = model;

    //   if (model.Status) {
    //     // this.toastr.success('บันทึกสำเร็จ', 'แจ้งเตือนระบบ', { timeOut: 5000 });
    //     // this.read();
    //     this.reportModel = model.Data

    //     // const dialogRef = this.dialog.open(DocLogDialog, { disableClose: false, height: '400px', width: '800px', data: { title: 'Doc Log Report', listData: this.reportModel, listDataSearch: this.reportModel } });

    //     // dialogRef.afterClosed().subscribe(result => {
    //     //   console.log(`Dialog result: ${result}`);

    //     //   if (result != undefined) {
    //     //      this.excelService.exportAsExcelFile(result, 'doc-log-report');
    //     //   }
    //     // });

    //   }
    //   else {
    //     this.spinner.hide();
    //     this.toastr.error(model.Message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
    //   }

    // }, err => {
    //   this.spinner.hide();
    //   this.toastr.error(err.message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
    // });
  }

  exportAsXLSX2(): void {
    this.spinner.show();

    let code = "AC001";
    let zdocNum = "AC002";
    let firstName = "ลลิตา";
    let dateFrom = "01/06/2022";
    let lastName = "ลลิตา";
    let dateTo = "01/06/2022";

    let excelModel = [];
    excelModel.push(
      {
        Code: "First Name",
        [this.model.Code]: this.model.FirstName,
        " ": "",
        "  ": "",
        "   ": "",
        "    ": "",
        "     ": "",
        "      ": "",
        "       ": "",
        "Doc Num": "Date From",
        [" " + this.model.DocNum]: moment(this.model.DateFrom).format(
          "DD-MM-YYYY"
        ),
        "        ": "",
        "         ": "",
      },
      {
        Code: "Last Name",
        [this.model.Code]: this.model.LastName,
        " ": "",
        "  ": "",
        "   ": "",
        "    ": "",
        "     ": "",
        "      ": "",
        "       ": "",
        "Doc Num": "Date To",
        [" " + this.model.DocNum]: moment(this.model.DateTo).format(
          "DD-MM-YYYY"
        ),
        "        ": "",
        "         ": "",
      },
      {
        Code: "",
        [this.model.Code]: "",
        " ": "",
        "  ": "",
        "   ": "",
        "    ": "",
        "     ": "",
        "      ": "",
        "       ": "",
        "Doc Num": "",
        [" " + this.model.DocNum]: "",
        "        ": "",
        "         ": "",
      },
      {
        Code: "Date",
        [this.model.Code]: "Start Time",
        " ": "Hour",
        "  ": "End Time",
        "   ": "Activity Type",
        "    ": "Financial Project",
        "     ": "Cost Center",
        "      ": "Stage",
        "       ": "Break",
        "Doc Num": "Nonbillable Time",
        [" " + this.model.DocNum]: "Effective Time",
        "        ": "Billable Time",
        "         ": "Detail",
      }
    );

    this.models.forEach((element) => {
      excelModel.push({
        Code: element.Date,
        [this.model.Code]: element.StartTimeText,
        " ": element.U_HMC_Hour,
        "  ": element.EndTimeText,
        "   ": element.ActType,
        "    ": element.FiProject,
        "     ": element.CostCenter,
        "      ": element.U_HMC_Stage,
        "       ": element.BreakText,
        "Doc Num": element.NonBillTmText,
        [" " + this.model.DocNum]: element.EffectTmText,
        "        ": element.BillableTmText,
        "         ": element.U_HMC_Detail,
      });
    });
    this.excelService.exportAsExcelFile(excelModel, "timesheet-report");
    // this.excelService.exportAsExcelFile(this.listModel, 'user-log-report');
    this.spinner.hide();
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.listDetailModel,
      event.previousIndex,
      event.currentIndex
    );
  }

  clear() {
    this.criteriaModel = { apptDate: "" };
  }

  statusTransportColor(param) {
    switch (param) {
      case "C":
        return "#E16E5B";
      case "D":
        return "#F7E884";
      case "L":
        return "#F7E884";
      case "O":
        return "#B6B6B6";
      case "P":
        return "#79D58B";
      case "R":
        return "#79D58B";
      case "S":
        return "#66A5D9";
      case "W":
        return "#B6B6B6";
      default:
        break;
    }
  }

  numberWithCommas(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  }
}
