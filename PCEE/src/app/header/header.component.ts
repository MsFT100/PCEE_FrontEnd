import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ThemeService } from '../themeService';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ 
    FormsModule,
    CommonModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  isLoggedIn = false;
  isDarkTheme: boolean = true;

  constructor(private router: Router,
     private cdr: ChangeDetectorRef,
     private themeService: ThemeService) {}
  
  
 
  ngOnInit(): void {
    this.checkLoginStatus();
    this.isDarkTheme = this.themeService.isDarkTheme();
    this.themeService.isDarkTheme();

  }
  toggleTheme(): void {
    this.isDarkTheme = !this.isDarkTheme;
    this.themeService.setDarkTheme(this.isDarkTheme);
    window.location.reload();
  }
  ngDoCheck(): void{
    //window.location.reload();
  }
  checkLoginStatus(): void {
    const token = localStorage.getItem('token');
    this.isLoggedIn = !!token;
    this.cdr.detectChanges(); // Trigger change detection
  }

  logout(): void {
    localStorage.clear();
    this.isLoggedIn = false;
    this.router.navigate(['/signin']);
  }
}