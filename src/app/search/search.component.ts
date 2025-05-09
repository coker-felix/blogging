import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Search as SearchIcon, X } from 'lucide-angular';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  @Output() onSearch = new EventEmitter<string>();
  searchTerm: string = '';
  readonly SearchIcon = SearchIcon;
  readonly X = X;

  handleChange(value: string): void {
    this.searchTerm = value;
    this.onSearch.emit(value);
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.onSearch.emit('');
  }
}