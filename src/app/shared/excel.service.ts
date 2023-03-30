import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx-js-style';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
@Injectable({
  providedIn: 'root'
})
export class ExcelService {
  constructor() { }
  public exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);

    let objectMaxLength = []; 
    for (let i = 0; i < json.length; i++) {
      let value = <any>Object.values(json[i]);
      for (let j = 0; j < value.length; j++) {
        if (typeof value[j] == "number") {
          objectMaxLength[j] = 10 + 5;
        } else {
          objectMaxLength[j] =
            objectMaxLength[j] >= value[j].length 
              ? objectMaxLength[j]
              : value[j].length + 5;
        }
      }
    }
    // console.log(objectMaxLength);

    // var wscols = [
    //   { width: objectMaxLength[0] },  // first column
    //   { width: objectMaxLength[1] }, // second column
    //   { width: objectMaxLength[2] }, //...
    //   { width: objectMaxLength[3] }, 
    //   { width: objectMaxLength[4] },
    //   { width: objectMaxLength[5] }, 
    //   { width: objectMaxLength[6] }, 
    //   { width: objectMaxLength[7] }, 
    //   { width: objectMaxLength[8] },
    //   { width: objectMaxLength[9] }
    // ];
    
    //ใส่ความกว้าง
    const wscols = objectMaxLength.map(w => { return { width: w } });
    // const wscols = objectMaxLength.map(w => { return { wch: w} });
    worksheet["!cols"] = wscols;
    
    // worksheet["TransportNo"].s = { fill: { fgColor: { rgb: "7A7A7A" } }, font: { color: { rgb: "FFFFFF" }}};
    // for(const itm of json} {
    //   worksheet[itm].s = { fill: { fgColor: { rgb: "7A7A7A" } }, font: { color: { rgb: "FFFFFF" } } }
    // }

    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };

    //ใส่สี
    // 00BFFF ฟ้า
    // FFFFFF ขาว
    const colNames = ['A1', 'B1', 'C1', 'D1', 'E1', 'F1', 'G1', 'H1', 'I1', 'J1', 'K1', 'L1', 'M1', 'N1', 'O1', 'P1', 'Q1', 'R1', 'S1', 'T1', 'U1', 'V1', 'W1', 'X1', 'Y1', 'Z1', 'AA1', 'AB1', 'AC1', 'AD1'];
    for (const itm of colNames) {
      if (worksheet[itm]) {
        worksheet[itm].s = {
          fill: { fgColor: { rgb: 'cee5fd' } },
          font: { color: { rgb: '6b6f82' } },
        };
      }
    }
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }
  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

  downloadFileCSV(data, filename = 'data', headerList: any[]) {
    let csvData = this.ConvertToCSV(data, headerList);
    console.log(csvData)
    let blob = new Blob(['\ufeff' + csvData], { type: 'text/csv;charset=utf-8;' });
    let dwldLink = document.createElement("a");
    let url = URL.createObjectURL(blob);
    let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
    if (isSafariBrowser) {  //if Safari open in new window to save file with random filename.
      dwldLink.setAttribute("target", "_blank");
    }
    dwldLink.setAttribute("href", url);
    dwldLink.setAttribute("download", filename + ".csv");
    dwldLink.style.visibility = "hidden";
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
  }
  ConvertToCSV(objArray, headerList) {
    let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    let str = '';
    let row = 'ลำดับ,';
    for (let index in headerList) {
      row += headerList[index] + ',';
    }
    row = row.slice(0, -1);
    str += row + '\r\n';
    for (let i = 0; i < array.length; i++) {
      let line = (i + 1) + '';
      for (let index in headerList) {
        let head = headerList[index];
        line += ',' + array[i][head];
      }
      str += line + '\r\n';
    }
    return str;
  }

  exportToCsv(rows: object[], filename: string) {
    if (!rows || !rows.length) {
      return;
    }
    const separator = ',';
    const keys = Object.keys(rows[0]);
    const csvContent =
      keys.join(separator) +
      '\n' +
      rows.map(row => {
        return keys.map(k => {
          let cell = row[k] === null || row[k] === undefined ? '' : row[k];
          cell = cell instanceof Date
            ? cell.toLocaleString()
            : cell.toString().replace(/"/g, '""');
          if (cell.search(/("|,|\n)/g) >= 0) {
            cell = `"${cell}"`;
          }
          return cell;
        }).join(separator);
      }).join('\n');

    let blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    let dwldLink = document.createElement("a");
    let url = URL.createObjectURL(blob);
    let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
    if (isSafariBrowser) {  //if Safari open in new window to save file with random filename.
      dwldLink.setAttribute("target", "_blank");
    }
    dwldLink.setAttribute("href", url);
    dwldLink.setAttribute("download", filename + ".csv");
    dwldLink.style.visibility = "hidden";
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);


  }

}