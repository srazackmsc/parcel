import { Routes } from '@angular/router';
import { OnlineExamComponent } from './components/online-exam/online-exam.component';
import { RegisterComponent } from './components/register/register.component';

export const routes: Routes = [
    {path:'',redirectTo:'online_exam',pathMatch:'full'},
    {path:'register',component:RegisterComponent},
    {path:'online_exam',component:OnlineExamComponent}
];
