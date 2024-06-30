import { Component } from '@angular/core';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-import-summary',
  templateUrl: './import-summary.component.html',
  styleUrl: './import-summary.component.css',
})
export class ImportSummaryComponent {
  public errorCount: number = 0;
  public correctCount: number = 0;
  public errorsList: string[] = [];
  constructor(private sharedService: SharedService) {}
  ngOnInit() {
    this.errorCount = this.sharedService.errorCount;
    this.correctCount = this.sharedService.correctCount;
    this.errorsList = this.sharedService.errorList;
  }
}
