import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { LoginService } from '../service/login.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss'
})
export class SearchBarComponent {
  searchControl = new FormControl();
  results$!: Observable<any[]>;

  constructor(private readonly http: HttpClient, private readonly loginService: LoginService) {}

  ngOnInit() {
    this.results$ = this.searchControl.valueChanges.pipe(
      this.loginService.typeAhead({
        minLength: 3,
        debounceTime: 300,
        loadFn: searchTerm => {
          // const searchQuery = searchTerm ? `${searchTerm}?offset=20&limit=20` : "";
          const searchQuery = searchTerm ? `?title_like=^${searchTerm}` : "";
          return this.http.get<any[]>(
            // `https://pokeapi.co/api/v2/pokemon${searchQuery}`
            `https://jsonplaceholder.typicode.com/posts${searchQuery}`
            // https://gist.githubusercontent.com/Miserlou/c5cd8364bf9b2420bb29/raw/2bf258763cdddd704f8ffd3ea9a3e81d25e2c6f6/cities.json
          )
        }
      })
    )
  }
}
