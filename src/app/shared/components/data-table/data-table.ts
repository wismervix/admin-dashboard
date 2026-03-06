import {
  Component,
  computed,
  // EventEmitter,
  input,
  output,
} from '@angular/core';
// import { TableColumn } from '../../../core/models/table.types';

@Component({
  selector: 'app-data-table',
  imports: [],
  templateUrl: './data-table.html',
  styleUrl: './data-table.scss',
})
export class DataTable {
  data = input<any[]>([]);
  pagination = input<boolean>(false);

  currentPage = input<number>(0);
  totalPages = input<number>(0);

  pageChange = output<number>();

  prevPage() {
    if (this.currentPage() > 0) {
      this.pageChange.emit(this.currentPage() - 1);
    }
  }

  nextPage() {
    if (this.currentPage() < this.totalPages() - 1) {
      this.pageChange.emit(this.currentPage() + 1);
    }
  }

  goToPage(page: number) {
    this.pageChange.emit(page);
  }

  pageNumbers = computed(() =>
    Array.from({ length: this.totalPages() }, (_, i) => i),
  );
}
