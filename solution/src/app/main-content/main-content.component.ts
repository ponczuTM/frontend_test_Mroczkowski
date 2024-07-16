import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-main-content',
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.scss']
})
export class MainContentComponent implements OnInit {
  @ViewChild('content', { static: true }) contentDiv!: ElementRef<HTMLDivElement>;
  contentItems: string[] = [];
  longText: string = '';

  constructor(
    private dataService: DataService,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.loadContentItems();
    this.loadLongText();
  }

  addContent(isReplace: boolean) {
    const selectedOption = document.querySelector('input[name="option"]:checked') as HTMLInputElement;
    if (!selectedOption) {
      alert('Wybierz opcję!');
      return;
    }

    let newText: string | null = '';
    if (selectedOption.value === 'option1') {
      newText = this.dataService.getContent(0);
    } else if (selectedOption.value === 'option2') {
      newText = this.dataService.getContent(1);
    } else {
      if (isReplace == false) {
        newText = this.dataService.getUniqueRandomContent(this.contentItems);
      } else {
        newText = this.dataService.getRandomContent();
      }
      if (!newText) {
        alert('Wszystkie elementy zostały już wykorzystane!\nŻaden element nie został dodany');
        return;
      }
    }

    if (isReplace) {
      this.contentItems = [newText];
    } else {
      if (this.contentItems.includes(newText)) {
        alert(`Element "${newText}" został już dodany!`);
        return;
      }

      if (this.contentItems.includes(this.longText)) {
        this.contentItems = [newText];
      } else {
        this.contentItems.push(newText);
      }
    }

    this.saveContentItems();
    this.contentItems.sort((a, b) => a.localeCompare(b));
  }

  editContent(oldText: string) {
    const newText = prompt('Wprowadź nową treść:', oldText);
    if (newText && newText.trim()) {
      const index = this.contentItems.indexOf(oldText);
      if (index !== -1) {
        this.contentItems[index] = newText.trim();
        this.saveContentItems();
        this.contentItems.sort((a, b) => a.localeCompare(b));
      }
    }
  }

  deleteContent(text: string) {
    const index = this.contentItems.indexOf(text);
    if (index !== -1) {
      const confirmDelete = confirm(`Czy na pewno chcesz usunąć element "${text}"?`);
      if (confirmDelete) {
        this.contentItems.splice(index, 1);
        this.saveContentItems();
      }
    }
  }

  resetSettings() {
    const storedItems = localStorage.getItem('contentItems');
    if (storedItems) {
      let parsedItems = JSON.parse(storedItems);
      parsedItems.sort();
      this.contentItems = parsedItems;
    } else {
      this.contentItems = [this.longText];
      this.saveContentItems();
    }
  }

  loadLongText() {
    this.http.get('assets/text.txt', { responseType: 'text' })
      .subscribe(
        (data: string) => {
          this.longText = data;
          this.resetSettings();
        },
        error => {
          console.error('Błąd wczytywania pliku tekstowego:', error);
        }
      );
  }

  saveContentItems() {
    localStorage.setItem('contentItems', JSON.stringify(this.contentItems));
  }

  loadContentItems() {
    const storedItems = localStorage.getItem('contentItems');
    console.log(storedItems);
    if (storedItems) {
      this.contentItems = JSON.parse(storedItems);
    }
  }
}
