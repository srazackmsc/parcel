import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./components/navbar/navbar.component";
import { FooterFixedComponent } from "./components/footer-fixed/footer-fixed.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterFixedComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'tcs_online_exam';
  onRightClick(event:MouseEvent){
    event.preventDefault(); // Prevents the default context menu
    console.log('Context menu blocked');
  }
}
