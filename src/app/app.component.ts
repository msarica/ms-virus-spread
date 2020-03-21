import { Component } from '@angular/core';
import { Person } from './person/person';
import { PersonService } from './person.service';
import { takeUntil, first, tap, filter, debounceTime } from 'rxjs/operators';
import { Subject, merge, interval } from 'rxjs';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {
  destroy$ = new Subject();

  get people(){
    return this.personService.people;
  }

  constructor(
    private personService: PersonService,
  ){
  }

  ngOnInit(){
    this.personService.start();
  }

}
