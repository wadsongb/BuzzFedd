import { Component, OnInit } from '@angular/core';
import quizz_questions from "../../../assets/data/quizz_questions.json"

@Component({
  selector: 'app-quizz',
  templateUrl: './quizz.component.html',
  styleUrls: ['./quizz.component.css']
})
export class QuizzComponent implements OnInit {


  quizzSelected:number = 0;

  title:string = "";

  questions:any;
  questionSelected:any;

  answers:string[] = [];
  answerSelected: string = "";

  questionIndex:number = 0;
  questionMaxIndex:number = 0;

  isFinished:boolean = false;
  isLestQuestion:boolean = false;

  constructor() { }

  ngOnInit(): void {
    this.quizzSelected=0;
    if(quizz_questions) {
      this.loadQuizz(this.quizzSelected);
      this.isLestQuestion = false;
    }
  }

  loadQuizz(id:number) {
    this.quizzSelected = id;
    this.isFinished = false;
    this.title = quizz_questions.quizz[this.quizzSelected].title;
    this.questions = quizz_questions.quizz[this.quizzSelected].questions;
    this.questionIndex = 0;
    this.questionSelected = this.questions[this.questionIndex];
    this.questionMaxIndex = this.questions.length;
    this.answers = [];
  }

  playerChoice(alias:string){
    this.answers.push(alias);
    this.nextStep();
  }

  async nextStep() {
    this.questionIndex++;

    if(this.questionMaxIndex > this.questionIndex) {
      this.questionSelected = this.questions[this.questionIndex];
    } else {
      this.isFinished = true;

      if(this.quizzSelected < quizz_questions.quizz.length-1) {
        this.isLestQuestion = false;
      } else {
        this.isLestQuestion = true;
      }

      const finalAnswer:string = await this.checkResult();
      const type = quizz_questions.quizz[this.quizzSelected].results;
      this.answerSelected = quizz_questions.quizz[this.quizzSelected].results[finalAnswer as keyof typeof type];
    }
  }

  async checkResult() {
    return this.answers.reduce((previous, current, i, arr) => {
      if(
        arr.filter(item => item === previous).length >
        arr.filter(item => item === current).length
      ){
        return previous;
      }else{
        return current;
      }
    })
  }

  nextQuestion() {
    this.quizzSelected ++;
    if(this.quizzSelected < quizz_questions.quizz.length){
      this.loadQuizz(this.quizzSelected);
    } else {
      this.isLestQuestion = true;
    }
  }

  backToFirst() {
    this.quizzSelected = 0;
    this.loadQuizz(this.quizzSelected);
  }

}
