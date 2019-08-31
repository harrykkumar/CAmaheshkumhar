import { Injectable } from '@angular/core';
import { Workbook } from 'exceljs';
import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx'
import * as fs from 'file-saver';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
const EXCEL_EXTENSION = '.xlsx'

@Injectable({
  providedIn: 'root'
})
export class ExcelService {


  constructor() {

  }

  generateExcel(CompanyName, Address, headerName, Exceldata, ReportName, fromDate, toDate,excelSummary) {
    const CompanyTitle = CompanyName;
    const AddressTitle = Address
    const header = headerName
    const data = Exceldata
    const ReportNameTitle = ReportName
    let workbook = new Workbook();

    // Do Not changes this code : This is fixed Formate Excel For Header Data
    let worksheet = workbook.addWorksheet(ReportName);
    let titleRow = worksheet.addRow([CompanyTitle]);
    titleRow.font = { name: 'Calibri', family: 4, size: 16, bold: true }
    worksheet.mergeCells('A1:G1');
    let AddressTitleRow = worksheet.addRow([AddressTitle]);
    AddressTitleRow.font = { name: 'Calibri', family: 4, size: 12, bold: true }
    worksheet.mergeCells('A2:G2');
    worksheet.addRow([]);
    let ReportNameTitleRow = worksheet.addRow([ReportNameTitle]);
    ReportNameTitleRow.font = { name: 'Calibri', family: 4, size: 12, bold: true }
    worksheet.mergeCells('A4:G4');
    worksheet.addRow(['Date : ' + fromDate + '-' + toDate])
    worksheet.mergeCells('A5:G5');
    worksheet.addRow([]);
    let headerRow = worksheet.addRow(header);
    headerRow.font = { name: 'Calibri', family: 4, size: 12, bold: true }

    // Cell Style : Fill and Border
    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '80bfff' },
        bgColor: { argb: '80bfff' }
      }
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    })
    // worksheet.addRows(data);


    // Add Data and Conditional Formatting
    data.forEach(d => {
      let row = worksheet.addRow(d);
      let qty = row.getCell(200);
      let color = 'FFFFFF';


      qty.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: color }
      }
    }

    );
    headerName.forEach((e, index) => {
      worksheet.getColumn(1).width = 8;
      worksheet.getColumn(index + 1).width = 20;
    })

    // worksheet.addRow([]);
    let summaryRow = worksheet.addRow(excelSummary);
    summaryRow.font = { name: 'Calibri', family: 4, size: 12, bold: true }

    // Cell Style : Fill and Border
    summaryRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '80bfff' },
        bgColor: { argb: '80bfff' }
      }
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    })
  //  worksheet.mergeCells(`A${summaryRow.number}:F${summaryRow.number}`);
    worksheet.addRow([]);
    // let summaryRow = worksheet.addRow(excelSummary);
    // summaryRow.font = { name: 'Calibri', family: 4, size: 12, bold: true }
    // // summaryRow.getCell(1).fill = {
    // //   type: 'pattern',
    // //   pattern: 'solid',
    // //   fgColor: { argb: 'cce6ff' }
    // // };
    // summaryRow.getCell(1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }

    // //Merge Cells
    // worksheet.mergeCells(`A${summaryRow.number}:F${summaryRow.number}`);
    //Footer Row
    // let footerRow = worksheet.addRow(['This is system generated excel sheet.']);
    // footerRow.getCell(1).fill = {
    //   type: 'pattern',
    //   pattern: 'solid',
    //   fgColor: { argb: 'cce6ff' }
    // };
    // footerRow.getCell(1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }

    // //Merge Cells
    // worksheet.mergeCells(`A${footerRow.number}:F${footerRow.number}`);

    //Generate Excel File with given name
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, ReportName + '.xlsx');
    })

  }

  public exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json)
    console.log('worksheet', worksheet)
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] }
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
    this.saveAsExcelFile(excelBuffer, excelFileName)
  }

  exportByTableId(tableId, sheetName, fileName) {
    const workbook = XLSX.utils.book_new();
    const sheet1 = XLSX.utils.table_to_sheet(document.getElementById(tableId));
    XLSX.utils.book_append_sheet(workbook, sheet1, sheetName);
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
    this.saveAsExcelFile(excelBuffer, fileName);
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    })
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION)
  }

}


