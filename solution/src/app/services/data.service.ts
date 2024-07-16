import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private contentData: { id: number, content: string }[] = [];
  private fileContent: string = '';

  constructor(private http: HttpClient) {
    this.loadData().subscribe(data => this.contentData = data);
  }

  loadData(): Observable<any> {
    return this.http.get<any[]>('../../assets/data.json')
      .pipe(
        catchError(() => of([]))
      );
  }

  getContent(index: number): string {
    return this.contentData[index]?.content || '';
  }

  getRandomContent(): string {
    const randomIndex = Math.floor(Math.random() * this.contentData.length);
    return this.contentData[randomIndex]?.content || '';
  }

  getUniqueRandomContent(existingContent: string[]): string | null {
    const availableContent = this.contentData.map(item => item.content).filter(content => !existingContent.includes(content));
  
    if (availableContent.length >= 2) {
      availableContent.splice(0, 2);
    }
  
    if (availableContent.length === 0) {
      return null;
    }
  
    const randomIndex = Math.floor(Math.random() * availableContent.length);
    console.log(randomIndex);
    return availableContent[randomIndex];
  }
  
  

  getFileContent(): string {
    return this.fileContent;
  }
  
}