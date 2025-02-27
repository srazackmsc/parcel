import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  private utilsService = inject(UtilsService);

  message : string = "";
  exams : any = [];

  registrationForm : any = {
    fname : "",
    lname : "",
    email : "",
    mobileno : "",
    dob : "",
    gender : "",
    address1 : "",
    address2 : "",
    state : "",
    city : "",
    region : "",
    pincode : "",
    exam_type : "",
    username : "",
    user_password : "",
    exam_desc : "",
    duration : ""
  }

  ngOnInit(): void {
    this.getExamTypes();
  }
  getExamTypes(){
    this.utilsService.getExamTypes().subscribe((res:any)=>{
      if(res.length != 0){
        this.exams = res;
      }else{
        this.exams = [];
      }
    });
  }
  mapExamDetails(e:any){
    let eid = e.target.value;
    this.exams.filter((x:any,i:number)=>{
      if(eid == x.id){
        this.registrationForm.exam_desc = x.text;
        this.registrationForm.duration = x.duration;
      }
    });
  }
  resetForm(){
    for(let field in this.registrationForm ){
      this.registrationForm[field] = "";
    }
    setTimeout(()=>{
      this.message = "";
    },1500)
  }
  doRegistration(){
    if(this.registrationForm){
      for(let field in this.registrationForm ){
        if(this.registrationForm[field] == ""){
          alert("All fields are mandatory");          
          return;
        }
      }
      console.log(this.registrationForm);
      this.utilsService.saveEmployee(this.registrationForm).subscribe((res:any)=>{
        this.resetForm();
        this.message = "Employee added successfully."
      })
    }
  }
  validateText(e:any){debugger
    let regE = /^[a-zA-Z]+$/;
    if(!regE.test(e.target.value)){
      return;
    }
  }
  onInput(event: any): void {
    // Get the value entered by the user
    const inputValue = event.target.value;

    // Use regex to replace any non-alphabet characters
    event.target.value = inputValue.replace(/[^A-Za-z]/g, '');
  }
  onNumber(event: any): void {
    const inputValue = event.target.value;

    // Use regex to replace any non-alphabet characters
    event.target.value = inputValue.replace(/[^0-9]/g, '');
  }
  validateNumber(text:string){
    let regE = /^(\+\d{1,3}[- ]?)?\d{10}$/;
    if(!regE.test(text)){
      return;
    }
  }

}
