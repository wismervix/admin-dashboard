import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  // public baseUrl = 'http://127.0.0.1:8000/api';
  public baseUrl = 'http://127.0.0.1:9900/api';

  getMediaUrl(path?: string | null): string {
    if (!path) return '';

    if (path.startsWith('http')) return path;

    return `${this.baseUrl.replace('/api', '/storage/')}${path}`;
  }
}
