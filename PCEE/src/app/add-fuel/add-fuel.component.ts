import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-add-fuel',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    RouterModule
  ],
  templateUrl: './add-fuel.component.html',
  styleUrl: './add-fuel.component.css'
})
export class AddFuelComponent {
  formData: any = {};
  errorMessage: string | null = null;
  vehicleId: string | null = null;

  constructor(private http: HttpClient,
      private router: Router,
      private route: ActivatedRoute
    ) { }
  onSubmit() {
  throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
    // Get the vehicle ID from the route parameters
    
    this.route.paramMap.subscribe(params => {
      this.vehicleId = params.get('id');
    });

    

  }
}
