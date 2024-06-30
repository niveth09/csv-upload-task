import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, take, pipe } from 'rxjs';
import { SharedService } from '../../services/shared.service';
import { AsyncPipe } from '@angular/common';
import { Router } from '@angular/router';

export class CSVRecord {
  public name: string;
  public email: string;
  public phoneNumber: Number | string;
  public city: string;
  public address: string;
  public gpa: Number | string;
}
@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.css',
})
export class DataTableComponent implements OnInit, AfterViewInit, OnDestroy {
  dataTable: any = [];
  dataSubscription: Subscription;
  public records: any[] = [];
  public errorList: any[] = [];
  public errorCount = 0;
  public currentErrorCount = 0;
  public correctCount = 0;
  constructor(private sharedService: SharedService, private router: Router) {
    // console.log('constructor');
    // this.getData();
    // this.setFileList(this.dataTable);
  }
  ngOnInit(): void {
    console.log('oninit');
    this.getData();
    this.setFileList(this.dataTable);
  }
  ngAfterViewInit() {
    console.log('afterviewinit');
    this.getData();
    this.setFileList(this.dataTable);
  }
  getData = async () => {
    this.dataSubscription = this.sharedService.getData().subscribe((data) => {
      console.log('data', data);
      if (data.length > 0) {
        console.log('data has arrived');
        this.setFileList(data);
      }
      // if (data !== null && data !== undefined && data.length > 0) {
      // const reader: FileReader = new FileReader();
      // reader.readAsText(data[0]);
      // const list = data.split('\n');
      // list.forEach((e: any) => {
      //   this.dataTable.push(e);
      // });
      // console.log(this.dataTable);
      // }
    });
  };

  setFileList = (files: FileList) => {
    if (files && files.length > 0) {
      // let headersRow = this.getHeaderArray(files);
      this.records = this.getDataRecordsArrayFromCSVFile(files, 6);
      console.log('records ', this.records);
      console.log(files);
      this.dataTable = this.records;
      // console.log('headers ', headersRow);
    }
  };
  getDataRecordsArrayFromCSVFile = (
    csvRecordsArray: any,
    headerLength: any
  ) => {
    let csvArr = [];
    console.log('getDataRecordsArrayFromCSVFile', csvRecordsArray);
    for (let i = 1; i < csvRecordsArray.length; i++) {
      let currentRecord = (<string>csvRecordsArray[i]).split(',');
      // console.log('length check', currentRecord.length, headerLength);
      // if (currentRecord.length == headerLength) {
      console.log('inside currentRecord', csvRecordsArray[10]);

      if (
        currentRecord.length > 0 &&
        csvRecordsArray[i] != ',,,,,,' &&
        csvRecordsArray[i] != ',,,,,,,,,,,,,,,,,,,,,,,,' &&
        csvRecordsArray[i]
      ) {
        this.currentErrorCount = 0;
        let csvRecord: CSVRecord = new CSVRecord();
        csvRecord.name =
          this.isNotDefined(i, 0, currentRecord[0]) != 'false'
            ? currentRecord[0].trim()
            : '';
        csvRecord.email =
          this.isNotDefined(i, 1, currentRecord[1]) != 'false'
            ? currentRecord[1].trim()
            : '';
        csvRecord.phoneNumber =
          this.isNotDefined(i, 2, currentRecord[2]) != 'false'
            ? this.isValidPhoneNumber(i, 2, currentRecord[2].trim())
            : currentRecord[2];
        csvRecord.city =
          this.isNotDefined(i, 3, currentRecord[3]) != 'false'
            ? currentRecord[3].trim()
            : currentRecord[3];
        csvRecord.address =
          this.isNotDefined(i, 4, currentRecord[4]) != 'false'
            ? currentRecord[4].trim()
            : currentRecord[4];
        csvRecord.gpa =
          this.isNotDefined(i, 5, currentRecord[5]) != 'false'
            ? this.isValidGPA(i, 5, currentRecord[5].trim())
            : currentRecord[5];
        csvArr.push(csvRecord);
        if (this.currentErrorCount == 0) this.sharedService.correctCount++;
      }
      // }
    }
    return csvArr;
  };
  isNotDefined(rowNumber: number, index: number, value: String) {
    if (value) {
      return value;
    }
    this.addErrorList(`row[${rowNumber}][${index}]- can't have an empty value`);
    return 'false';
  }
  addErrorList = (message: string) => {
    this.sharedService.errorCount++;
    this.currentErrorCount++;
    console.log('error', this.sharedService.errorCount);
    this.sharedService.errorList.push(message);
    this.errorList.push(message);
  };
  isValidPhoneNumber(rowNumber: number, index: number, phoneNumber: string) {
    if (phoneNumber != undefined) {
      let convertedNumber = this.isValidNumber(rowNumber, index, phoneNumber);
      if (phoneNumber.length === 10) return convertedNumber;
      this.addErrorList(
        `row[${rowNumber}][${index}]- phone number should have 10 numbers`
      );
      return 0;
    }
    return 0;
  }
  isValidNumber(rowNumber: number, index: number, value: string) {
    try {
      let convertedNumber = Number(value);
      return convertedNumber;
    } catch (err) {
      this.addErrorList(
        `row[${rowNumber}][${index}]- phone number should have numbers only`
      );
      return 0;
    }
  }
  isValidGPA(rowNumber: number, index: number, gpa: string) {
    let convertedString = this.isValidNumber(rowNumber, index, gpa);
    if (convertedString > 0 && convertedString <= 10) return convertedString;
    this.addErrorList(
      `row[${rowNumber}][${index}]- gpa should be greater than 0 and lesser than 10`
    );
    return 0;
  }
  isValidCSVFile(file: any) {
    return file.name.endsWith('.csv');
  }
  getHeaderArray = (csvRecordsArr: any) => {
    console.log('getHeaderArray', csvRecordsArr);
    let headers = (<string>csvRecordsArr[0]).split(',');
    let headerArray = [];
    for (let j = 0; j < headers.length; j++) {
      headerArray.push(headers[j]);
    }
    console.log('headersArray', headerArray);
    return headerArray;
  };
  onHandleNavigateCheck() {
    this.router.navigate(['/import-summary']);
  }
  ngOnDestroy() {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }
}
