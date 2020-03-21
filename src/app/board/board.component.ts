import { Component, OnInit } from '@angular/core';
import { PersonService } from '../person.service';
import { Subject } from 'rxjs';
import { takeUntil, tap, map, filter } from 'rxjs/operators';
import { Person } from '../person/person';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
  destroy$ = new Subject();

  status = {}

  get hospitalSize(){
    return this.personService.settings.hospitalBedSize;
  }

  // private _distancing = false;
  // get distancing(){
  //   return this._distancing;
  // }
  // set distancing(val){
  //   this._distancing = val;
  //   this.personService.setDistancing(val);
  // }

  constructor(
    private personService: PersonService
  ) { 
    this.reset();
    this.personService.updateCounts = this.updateCounts.bind(this);
  }

  reset(){
    this.status = {
      healthy: 0,
      infected: 0,
      sick: 0,
      hospital: 0,
      recovered: 0,
      dead: 0,
    }
  }

  updateCounts(val){
    this.status = val;
  }

  ngOnInit() {
  
  }

  ngOnDestroy(){
    this.destroy$.next();
    this.destroy$.complete();
  }

  restart(){
    this.personService.start();
  }
}