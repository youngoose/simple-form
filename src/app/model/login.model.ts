import { Observable, ObservableInput } from "rxjs";

export interface ITypeAheadOperatorOptions<Out> {
  /**
   * The minimum length of the allowed search term.
   */
  minLength: number;
  /**
   * The amount of time between key presses before making a request.
   */
  debounceTime: number;
  /**
   * Whether to allow empty string to be treated as a valid search term.
   * Useful for when you want to show default results when the user clears the search box
   *
   * @default true
   */
  allowEmptyString?: boolean;

  /**
   * The function that will be called to load the results.
   */
  loadFn: (searchTerm: string) => Observable<Out>;
}