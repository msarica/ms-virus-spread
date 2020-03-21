import { PersonService } from "../person.service";

export class Person {
  id: number
  x: number=this.getRandom( 50, window.innerWidth-50);
  y: number=this.getRandom( 50, window.innerHeight-50);
  get distancing() {
    return this.service.settings.distancing;
  }
  recoveryTime = 2000; 
  sicknessTime = 5000; 
  
  speed=5;
  angle: number= this.getRandom(0, 360);
  status: string = 'healthy';
  hospitalized = false;

  service: PersonService;

  constructor(opts: Person){
    Object.assign(this, opts);

    this.recoveryTime = this.service.settings.recoveryTime;
    this.sicknessTime = this.service.settings.sicknessDuration;
  }

  getRandom(min, max){
    return Math.floor(Math.random()*(max-min)+min);
  }

  setDistancing(v: boolean){
    this.distancing = v;
  }

  updateLocation(){
    if(this.status === 'dead'){
      return;
    }

    const inc_x = Math.cos(this.angle * Math.PI/ 180 ) * this.speed;
    const inc_y = Math.sin(this.angle * Math.PI/ 180 ) * this.speed;
    this.x+=inc_x;
    this.y+=inc_y;

    const boundaryFn = (x,y, xx1, yy1, xx2, yy2)=> x < xx1 || x > xx2 - 15 ||
                                        y < yy1 || y > yy2 - 15;

    const inBoundary = !this.distancing ? 
      (x,y) => boundaryFn(x,y, 0, 0, window.innerWidth,  window.innerHeight) 
    : (x,y)=> {
        
        let p = window.innerWidth/4;
        let x2 = p;
        let x1 = 0;
        while(x2<x){
          x1+=p;
          x2+=p;
        }

        p = window.innerWidth/4;
        let y2 = p;
        let y1 = 0;
        while(y2<y){
          y1+=p;
          y2+=p;
        }

      return boundaryFn(x,y,x1,y1, x2, y2)
    }

    if(inBoundary(this.x,this.y)){
      this.angle += 90;
    }

    if(this.angle>=360){
      this.angle-=360;
    }
  }

  updateStatus(carriers: Person[]){
    if(this.status==='sick' || this.status==='infected' || this.status ==='dead' || this.status === 'recovered'){
      return;
    }

    const t = 7;
    const person = carriers.find(i=>{
      if(i.id === this.id){
        return false;
      }
      const x = this.x + 5;
      const y = this.y + 5;
      return i.x-t < x && x < i.x+t && i.y-t < y && y < i.y+t;
    });

    if(person){
      this.infected();
    }
  }

  gotoHospital: ()=>void;

  timerDead: any;
  infected(){
    this.status = 'infected';

    setTimeout(()=>{
      this.status = 'sick';
      // this.gotoHospital && this.gotoHospital();
      this.service.hospitalAdmission(this);

      this.timerDead = setTimeout(()=>{
        if(this.status === 'sick'){
          this.died();
        }
      }, this.sicknessTime);
    }, this.sicknessTime);
  }

  died(){
    this.status = 'dead';
    this.service.stopHospitalCare(this);
  }

  recovered(){
    this.status = 'recovered';
    this.service.stopHospitalCare(this);
    if(this.timerDead){
      clearTimeout(this.timerDead);
    }
  }

  private careTimer;
  hospitalCare(){
    this.hospitalized = true;
    this.careTimer = setTimeout(()=>{
      if(this.status === 'dead'){
        return;
      }
      this.recovered();
    }, this.recoveryTime);
  }

  updateDistancing(val: boolean){
    this.distancing = val;
  }

  destroy(){
    if(this.careTimer){
      clearTimeout(this.careTimer)
    }
  }
}