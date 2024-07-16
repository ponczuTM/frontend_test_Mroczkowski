import { Component, Input } from '@angular/core';
import { DataService } from '../services/data.service';
import { MainContentComponent } from '../main-content/main-content.component';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {

  footerVisible = false;

  @Input() mainContent!: MainContentComponent;

  constructor(private dataService: DataService) { }

  toggleFooter() {
    this.footerVisible = !this.footerVisible;
  }

  resetSettings() {
    localStorage.removeItem('contentItems');
    const header = document.querySelector('.header h1') as HTMLElement | null;
    if (header && header.textContent && header.textContent.includes('Oliwer Mroczkowski')) {
      header.textContent = 'Zadanie rekrutacyjne';
    }
    this.mainContent.resetSettings();
    this.footerVisible = false;
  }

  showPersonalData() {
    const header = document.querySelector('.header h1') as HTMLElement | null;
    if (header && header.textContent && !header.textContent.includes('Oliwer Mroczkowski')) {
      header.innerHTML += '<br>Oliwer Mroczkowski';
    }
  }
}
