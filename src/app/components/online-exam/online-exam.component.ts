import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { OnlineExamService } from '../../services/online-exam.service';
import { FormsModule } from '@angular/forms';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-online-exam',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './online-exam.component.html',
  styleUrl: './online-exam.component.css',
})
export class OnlineExamComponent implements OnInit, AfterViewInit {
  private onlineExamService = inject(OnlineExamService);
  errorMessage: string = '';
  @ViewChild('timerInterval') timerInterval!: ElementRef;
  @ViewChild('percentageVal') percentageVal!: ElementRef;
  @ViewChild('downloadTemp') downloadTemp!: ElementRef;
  authUser: any = {
    username: '',
    user_password: '',
  };
  eachIndex: number = 0;
  isLoggedUser: boolean = false;
  isPaperLoaded: boolean = false;
  allQuestions: any = [];
  filterQuestions: any = [];
  eachQuestion: any = {};
  submittedQuestions: any = [];
  currentUser: any = {};
  eachQuestionOpt: number = -1;
  totalQuestions: number = 10; //35;
  paperSubmitted: boolean = false;
  isResultReady: boolean = false;
  timerIntervalF: any;
  notePoints: any = {
    point1: 'Please check above details before start exam.',
    point2:
      'If details are not correct/proper please reach out to exam invisilator.',
    point3:
      'Do not refresh the page, If you refresh the page you will loss the session.',
    point4: "If no concerns then tap on 'Start Exam' button.",
    point5:
      'Once exam paper loaded timer will start based on your duration, Make sure to submit your exam on or before the end of the exam duration',
  };

  constructor() {
    //console.log(this.timerInterval);
  }
  ngOnInit(): void {
    //console.log(this.timerInterval);
    //setInterval(() => this.detectDevTools(), 1000); // Check every 1 second
  }
  ngAfterViewInit(): void {
    if (this.timerInterval) {
      //console.log(this.timerInterval.nativeElement.innerHTML);
    }
  }
  downloadPageAsImage() {
    // Use html2canvas to capture the content of the #content div (or the entire page)
    html2canvas(this.downloadTemp.nativeElement).then((canvas) => {
      // Convert the canvas to a PNG image data URL
      const imageURL = canvas.toDataURL('image/png');
      
      // Create a temporary link element to trigger the download
      const link = document.createElement('a');
      link.href = imageURL;
      link.download = `${this.currentUser.fname+"_"+this.currentUser.lname}.png`;  // Set the default file name
      
      // Programmatically trigger the click to start the download
      link.click();
    });
  }
  downloadForm() {
    // Get the form's HTML
    const formHTML = this.downloadTemp.nativeElement.innerHTML;

    // Create a Blob with the form's HTML content
    const blob = new Blob([formHTML], { type: 'text/html' });

    // Create a download link element
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${this.currentUser.fname+"_"+this.currentUser.lname}.html`;

    // Append the link to the body, trigger the click, and remove the link afterward
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
  validateUser() {
   // debugger;
    if (this.authUser) {
      for (let k in this.authUser) {
        if (this.authUser[k] == '' || this.authUser[k] == undefined) {
          this.errorMessage = 'All fields are mandatory';
          return;
        }
      }
      this.onlineExamService
        .validateUserForOnlineExam(this.authUser)
        .subscribe((res: any) => {
          if (res.length != 0) {
            if(res[0].exam_submitted_date != undefined){
              this.errorMessage = `Based on our database you already completed the exam on ${res[0].exam_submitted_date}`;
              return;
            }
            this.onlineExamService
              .getExamByCategoryType(res[0].exam_type)
              .subscribe((subRes: any) => {
                //this.currentUser['eid'] = this.currentUser.id;
                this.currentUser = { ...res[0], ...subRes };
                this.currentUser['eid'] = res[0].id;
                this.isLoggedUser = true;
              });
          } else {
            this.errorMessage = 'No data found, please check details again.';
          }
        });
    }
  }
  startExam() {
    //this.setTimer(5)
    this.onlineExamService
      .getQuestionPaperByCategory(this.currentUser.exam_type)
      .subscribe((examQues: any) => {
        if (examQues.length != 0) {
          this.allQuestions = examQues.questions;
          this.filterQuestions = this.getRandomFromArray(
            this.allQuestions,
            this.totalQuestions
          );
          this.eachQuestion =
            this.allQuestions[this.filterQuestions[this.eachIndex]];
          this.eachQuestion['sno'] = this.eachIndex;
          this.isPaperLoaded = true;
          this.setTimer(examQues.duration);
        }
      });
  }
  // doA() {
  //   this.paperSubmitted = false;
  // }
  submitExam() {
    this.eachQuestion['selectedAnswer'] = this.eachQuestionOpt;
    this.submittedQuestions.push(this.eachQuestion);
    let correctAnswers = 0;
    clearInterval(this.timerIntervalF);
    this.paperSubmitted = true;
    console.log(this.submittedQuestions);
    this.isResultReady = false;
    if (this.submittedQuestions.length != 0) {
      this.onlineExamService
        .getAnswerByCategoryName(this.currentUser.exam_type)
        .subscribe((ans: any) => {
          if (ans) {
            //let {answers} = ans;
            for (let sq of this.submittedQuestions) {
              let selectedAnswer = sq.selectedAnswer;
              for (let ra of ans.answers) {
                if (ra.qid == sq.qid) {
                  correctAnswers =
                    selectedAnswer == ra.answer
                      ? correctAnswers + 1
                      : correctAnswers;
                  sq['correctAnswer'] = ra.answer;
                }
              }
            }
            console.log(this.submittedQuestions);
            //this.calculatePercentage(correctAnswers,this.totalQuestions);
            this.finalCallForExamResult(correctAnswers, this.totalQuestions);
          }
        });
    }
  }
  finalCallForExamResult(noOfAnswer: number, totalQuestions: any) {
    if (noOfAnswer && totalQuestions) {
      setTimeout(() => {
        this.isResultReady = true;
        setTimeout(() => {
          this.calculatePercentage(noOfAnswer, totalQuestions);
          //setTimeout(()=>{this.downloadForm()},100);
          setTimeout(()=>{
            this.downloadPageAsImage();
            this.saveExamResultsByUser();
          },100);
        }, 1000);
      }, 4000);
    }
  }
  getNextQuestion(ind: number) {
    this.eachQuestion['selectedAnswer'] = this.eachQuestionOpt;
    this.submittedQuestions.push(this.eachQuestion);
    //alert(this.eachQuestionOpt);
    this.eachIndex = ind + 1;
    this.eachQuestion = this.allQuestions[this.filterQuestions[this.eachIndex]];
    this.eachQuestion['sno'] = this.eachIndex;
    this.eachQuestionOpt = -1;
  }

  getRandomFromArray(ary: any, count: number) {
    if (count > ary.length) throw new Error('Count exceeds array length');
    const indices = new Set();
    while (indices.size < count) {
      indices.add(Math.floor(Math.random() * ary.length));
    }
    return [...indices];
  }
  calculatePercentage(part: number, whole: number) {
    if (isNaN(part) || isNaN(whole) || whole === 0) {
      alert('Please enter valid numbers.');
      return;
    }
    // Calculate percentage
    const percentage = Math.round((part / whole) * 100);
    console.log('percentage==>' + percentage);
    // Display result
    this.percentageVal.nativeElement.innerHTML = `${percentage} %`;
    this.currentUser['score'] = `${percentage} %`;
  }
  setTimer(durationInMinutes: number) {
    let timeLeft = durationInMinutes * 60; // Convert minutes to seconds
    const updateTimer = () => {
      let hours = Math.floor(timeLeft / 3600);
      let minutes = Math.floor((timeLeft % 3600) / 60);
      let seconds = timeLeft % 60;
      this.timerInterval.nativeElement.innerHTML = `${String(hours).padStart(2,'0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2,'0')}`;
      if (timeLeft <= 0) {
        clearInterval(this.timerIntervalF);
        this.timerInterval.nativeElement.innerHTML = "Time's up!";
        alert("Time's up! The exam has ended.");
      } else {
        timeLeft--;
      }
    };
    updateTimer(); // Initial call to avoid 1-second delay
    this.timerIntervalF = setInterval(updateTimer, 1000);
  }
  // Method to check if dev tools are open (basic check)
  // detectDevTools() {
  //   const devToolsWidth = window.outerWidth - window.innerWidth > 100; // Dev tools open width
  //   const devToolsHeight = window.outerHeight - window.innerHeight > 100; // Dev tools open height

  //   if (devToolsWidth || devToolsHeight) {
  //     alert('Developer tools detected. Please close them to continue.');
  //     // Optionally, you could disable further interaction, reload page, or block access
  //   }
  // }
  saveExamResultsByUser(){
    if(this.currentUser){
      let data = {
        "exam_type":this.currentUser.exam_type,
        "exam_desc":this.currentUser.exam_desc,
        "emp_id":this.currentUser.eid,
        "score" : this.currentUser.score
      }
      this.onlineExamService.saveExamResult(data).subscribe((res:any)=>{
        if(res){
          this.onlineExamService.updateExamResultForEmpId(this.currentUser.eid,this.currentUser.score).subscribe((eres:any)=>{
            console.log(eres);
          })
        }
      })
    }
  }
 
}
