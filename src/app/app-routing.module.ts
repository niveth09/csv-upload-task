import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { DataTableComponent } from './components/data-table/data-table.component';
import { ImportSummaryComponent } from './components/import-summary/import-summary.component';

const routes: Routes = [
  { path: '', component: FileUploadComponent },
  { path: 'table', component: DataTableComponent },
  { path: 'import-summary', component: ImportSummaryComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
