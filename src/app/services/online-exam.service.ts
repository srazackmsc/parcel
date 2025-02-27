import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OnlineExamService {

  private URL = 'http://localhost:3100';
  constructor(private http : HttpClient) { }

  validateUserForOnlineExam(data:any){
    return this.http.get(`${this.URL}/employees?username=${data.username}&user_password=${data.user_password}`)
  }
  getExamByCategoryType(type:string){
    return this.http.get(`${this.URL}/exam_types/${type}`)
  }
  getQuestionPaperByCategory(type:string){
    return this.http.get(`${this.URL}/exam_questions_category_types/${type}`);
  }
  getAnswerByCategoryName(type:string){
    return this.http.get(`${this.URL}/exam_answers_category_types/${type}`)
  }
  saveExamResult(data:any){
    return this.http.post(`${this.URL}/exam_result_for_user`,data);
  }
  updateExamResultForEmpId(eid:string,score:string){
    return this.http.patch(`${this.URL}/employees/${eid}`,{
      "score" : score,
      "exam_submitted_date" : new Date()
    })
  }

}
