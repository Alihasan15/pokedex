import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PokemonDetailComponent } from './pokemons/pokemon-detail/pokemon-detail.component';
import { PokemonsComponent } from './pokemons/pokemons.component';


const routes: Routes = [
  { path:'',component:PokemonsComponent },
  { path: 'pokemons/:id', component: PokemonDetailComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
