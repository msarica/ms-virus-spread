import { Injectable } from '@angular/core';
import { Subject, interval } from 'rxjs';
import {filter, map, tap, takeUntil } from 'rxjs/operators';
import { Person } from './person/person';

export interface StatusChange {
  id: number;
  previousStatus?: string;
  newStatus?: string;
  hospitalCare?: boolean
}

export interface LocationUpdate{
  id: number;
  status: string;
  location: {
    x: number;
    y: number;
  }
}

export interface Info {
  type: string;
  data: any;
}

@Injectable()
export class PersonService {
  destroy$ = new Subject();

  restart: Function;

  settings = {
    population: 500,
    hospitalBedSize: 50,
    recoveryTime: 3000,
    sicknessDuration: 5000,
    distancing: false
  }

  get peopleSize(){
    return +this.settings.population;
  }

  get hospitalSize(){
    return this.settings.hospitalBedSize;
  }

  people: Person[];

  updateCounts: Function;

  hospitalCare = [];
  waitList = [];
  ignoreIdList = [];

  setDistancing(val: boolean){
    if(!this.people){
      return;
    }
    this.people.forEach(i=> i.updateDistancing(val));
  }

  getPeople(){
    this.people = null;

    const people = Array
                  .from(Array(this.peopleSize).keys())
                  .map(i=> new Person({
                    id: i,
                    status: 'healthy',
                    service: this,
                  }));

    return people;
  }

  constructor() { 
    this.initialize();
  }

  initialize(){
    interval(50)
    .pipe(
      tap(()=>{
        this.people.forEach(i=>i.updateLocation());
        const infected = this.people.filter(i=> i.status==='infected');
        const sick = this.people.filter(i=>i.status==='sick');
        const carriers = [...infected, ...sick];
        this.people.forEach(i=>i.updateStatus(carriers));

        const recovered = this.people.filter(i=>i.status ==='recovered').length;
        const dead = this.people.filter(i=>i.status == 'dead').length;
        const healthy = this.people.length - (infected.length + sick.length + recovered + dead);
        const hospital = sick.filter(i=>i.hospitalized).length;
        const waitList = this.waitList.length;

        const counts = {
          infected: infected.length,
          sick: sick.length,
          hospital,
          recovered,
          dead,
          healthy,
          waitList
        }
        this.updateCounts(counts);

      }),
      takeUntil(this.destroy$)
      )
    .subscribe();
  }

  hospitalAdmission(person: Person){
    this.waitList.push(person);
    this.getNextPatient();
  }

  getNextPatient(){
    if(!this.waitList.length){
      return;
    }

    if(this.hospitalCare.length >= this.hospitalSize){
      return;
    }

    const person = this.waitList.shift();
    if(!person){
      return;
    }
    if(this.ignoreIdList.indexOf(person.id)>-1){
      this.getNextPatient();
      return;
    }

    this.startHospitalCare(person);
  }

  startHospitalCare(person: Person){
    this.hospitalCare.push(person);
    person.hospitalCare();
  }

  stopHospitalCare(person: Person){
    this.ignoreIdList.push(person.id);
    const pi = this.hospitalCare.findIndex(i=> i.id === person.id); 
    if(pi>-1){
      this.hospitalCare.splice(pi, 1);
      this.getNextPatient();
    }
  }

  ngOnDestroy(){
    this.destroy$.next();
    this.destroy$.complete();
  }

  start(){
    this.waitList = [];
    this.ignoreIdList = [];
    this.hospitalCare = [];
    this.updateCounts({});

    this.people = null;

    const people = this.getPeople();

    this.people = people;

    this.people[0].infected();
  }
}