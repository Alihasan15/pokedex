import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CustomPipePipe } from './custom-pipe.pipe';
import { HttpClientModule } from '@angular/common/http';
import { PokemonsComponent } from './pokemons/pokemons.component';
import { NgxSpinnerModule } from "ngx-spinner"; 
import {ProgressBarModule} from "angular-progress-bar"
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { PokemonDetailComponent } from './pokemons/pokemon-detail/pokemon-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    CustomPipePipe,
    PokemonsComponent,
    PokemonDetailComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgxSpinnerModule,
    ProgressBarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
