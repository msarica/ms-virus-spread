import { Component, OnInit, Input } from '@angular/core';
import { Subject, interval, Observable } from 'rxjs';
import { takeUntil, tap, filter, map, debounceTime, takeWhile } from 'rxjs/operators';
import { Person } from './person';
import { PersonService, StatusChange } from '../person.service';

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.css']
})
export class PersonComponent implements OnInit {
  @Input()
  person: Person;

  get id(){ return this.person.id; }
  get x(){return this.person.x};
  get y(){return this.person.y};
  get status(){return this.person.status};
  get hospitalized(){return this.person.hospitalized};

  get sickTime(){ return this.personService.settings.sicknessDuration; }
  get recoveryTime() { return this.personService.settings.recoveryTime; }

  // destroy$ = new Subject();

  constructor(
    private personService: PersonService
  ) {
  }

  ngOnInit() {
  }

  ngOnDestroy(){
    // this.destroy$.next();
    // this.destroy$.complete();
  }
}