import { Component } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'my-App';
  
  constructor(private apiService:ApiService){

  }
  ngOnInit(){
   
  }
}