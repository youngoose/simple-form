import { Injectable } from '@angular/core';
import { ITypeAheadOperatorOptions } from '../model/login.model';
import { Observable, OperatorFunction, debounceTime, distinctUntilChanged, filter, shareReplay, switchMap, takeUntil, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor() { }

  typeAhead<Out> (
    options: ITypeAheadOperatorOptions<Out>
  ): OperatorFunction<string, Out> {
    return (source) => {

      const cache: Record<string, Observable<Out>> = {};
      let shouldAllowSameValue = false; // -> 1
      
      return source.pipe(
        debounceTime(options.debounceTime),
        filter(value => typeof value === "string"),
        filter(value => {
          if (value === "") {
            return options.allowEmptyString ?? true;
          } 
          return value.length >= options.minLength;
        }),
        distinctUntilChanged((prev, current) => {
          console.log('prev: ', prev);
          console.log('current: ', current);

          if (shouldAllowSameValue /** -> 3 */) {
            shouldAllowSameValue = false;
            return false;
          }

          console.log('prev === current: ', prev === current);          

          return prev === current; // -> 4
        }),
        switchMap(searchTerm => {
          // -> 5
          if (!cache[searchTerm]) {
            cache[searchTerm] = (options.loadFn(searchTerm)).pipe(
              shareReplay({
                bufferSize: 1,
                refCount: false,
                windowTime: 5000
              }),
              takeUntil(
                source.pipe(
                  tap(() => shouldAllowSameValue = true /** -> 2 */)
                )
              ),
            );
          }
          return cache[searchTerm];
        })
      )
    }
  }
}
