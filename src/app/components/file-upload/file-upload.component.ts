import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  EventEmitter,
  Output,
} from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { SharedService } from '../../services/shared.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.css',
})
export class FileUploadComponent {
  @Input() multiple: boolean;
  // @Input() fileType: string;
  @Input() dragDropEnabled = true;
  @Output() filesChanged: EventEmitter<FileList>;

  @ViewChild('csvDragDropInput') dragDropInput: ElementRef<HTMLInputElement>;
  @ViewChild('studentDataLink') linkInput: ElementRef<HTMLInputElement>;
  csvLinkSubscription: Subscription;
  fileList: string[];
  notAcceptedDataType: boolean = false;
  acceptedFileType: string = '.csv';
  fileLink = new FormControl('');
  public records: any[] = [];

  constructor(private router: Router, private sharedService: SharedService) {
    this.filesChanged = new EventEmitter();
  }

  addFiles(files: FileList | any): void {
    this.filesChanged.emit(files);

    this.setFileList(files);
  }

  handleFileDrop(event: DragEvent) {
    if (event?.dataTransfer?.files?.length) {
      const files = event.dataTransfer.files;
      this.dragDropInput.nativeElement.files = files;
      this.addFiles(files);
    }
  }

  setFileList(files: FileList) {
    // this.fileList = Array.from(files).map((f) => f.name);
    let fileType = files[0].type;
    // console.log(fileType);
    if (fileType == 'text/csv' || fileType == 'csv') {
      let file = files[0];
      let reader = new FileReader();
      let csvRecordsArray: string[] = [];
      reader.readAsText(file);
      reader.onload = () => {
        let csvData = reader.result;
        console.log('csvData', csvData);
        // csvRecordsArray = (<string>csvData)
        //   .replace(/\r\n/g, '\r')
        //   .replace(/\n/g, '\r')
        //   .split(/\r/);
        csvRecordsArray = (<string>csvData).split(/\r\n|\n|\r/);
        this.sendData(csvRecordsArray);
      };
      reader.onerror = () => {
        console.log('error is occurred while reading file!');
      };
    } else {
      this.notAcceptedDataType = true;
    }

    // console.log(file);
    // this.sharedService.recordsData = this.records;
    // this.sendData(this.records);
  }

  fileReset() {
    this.dragDropInput.nativeElement.value = '';
    this.records = [];
  }
  sendData(records: any) {
    // this.sharedService.recordsData = records;
    // this.sharedService.setData(records);
    this.sharedService.send_data.next(records);
    if (records && records.length > 0) {
      this.router.navigate(['/table']);
    }
  }
  onHandleUploadData = () => {
    console.log('link ', this.fileLink.value);
    this.csvLinkSubscription = this.sharedService
      .getCSV(this.fileLink.value)
      .subscribe((data) => {
        if (data) {
          this.sendData(data);
        }
      });
  };
  ngOnDestroy() {
    if (this.csvLinkSubscription) {
      this.csvLinkSubscription.unsubscribe();
    }
  }
}
