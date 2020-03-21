import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { BoardComponent } from './board/board.component';
import { PersonComponent } from './person/person.component';
import { PersonService } from './person.service';

@NgModule({
  imports:      [ BrowserModule, FormsModule ],
  declarations: [ AppComponent, BoardComponent, PersonComponent ],
  bootstrap:    [ AppComponent ],
  providers: [PersonService]
})
export class AppModule { }
