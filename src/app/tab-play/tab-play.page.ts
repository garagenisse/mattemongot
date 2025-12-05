import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonButton,
  IonButtons,
  IonBackButton,
  IonProgressBar,
  IonGrid,
  IonRow,
  IonCol
} from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MathService, Quiz } from '../services/math.service';
import { SettingsService, LevelSettings, UserLevelSettings } from '../services/settings.service';

@Component({
  selector: 'app-tab-play',
  templateUrl: 'tab-play.page.html',
  styleUrls: ['tab-play.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent, 
    IonButton,
    IonButtons,
    IonBackButton,
    IonProgressBar,
    IonGrid,
    IonRow,
    IonCol,
    TranslateModule
  ]
})
export class TabPlayPage implements OnInit, OnDestroy {
  quiz: Quiz | null = null;
  level: LevelSettings | null = null;
  userLevel: UserLevelSettings | null = null;
  levelDesc = '';
  delta = 0;
  isTimed = true;
  selectedAnswerIndex: number | null = null;
  showFeedback = false;
  private levelIndex = 0;
  private timerInterval: ReturnType<typeof setInterval> | null = null;
  private lastClick = 0;

  constructor(
    private route: ActivatedRoute,
    private mathService: MathService,
    private settingsService: SettingsService,
    private translate: TranslateService
  ) {}

  async ngOnInit(): Promise<void> {
    const levelParam = this.route.snapshot.paramMap.get('levelIndex');
    this.levelIndex = levelParam ? parseInt(levelParam, 10) : 0;
    
    await this.loadLevel();
    this.init();
  }

  async ionViewWillEnter(): Promise<void> {
    await this.loadLevel();
    this.init();
    this.startTimer();
  }

  ionViewWillLeave(): void {
    this.stopTimer();
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }

  private async loadLevel(): Promise<void> {
    const settings = await this.settingsService.loadSettings();
    const userSettings = await this.settingsService.loadUserSettings();
    
    this.level = settings.levels[this.levelIndex] || settings.levels[0];
    this.userLevel = userSettings.levels[this.levelIndex] || userSettings.levels[0];
    this.isTimed = userSettings.timed;
    this.levelDesc = this.translate.instant('levels.' + this.level.label);
  }

  private init(): void {
    this.createQuiz();
    this.delta = 0;
    this.selectedAnswerIndex = null;
    this.showFeedback = false;
  }

  private startTimer(): void {
    if (this.isTimed && !this.timerInterval) {
      this.timerInterval = setInterval(() => this.timerTick(), 1000);
      console.log('Enter, start timer');
    }
  }

  private stopTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
      console.log('Leave, shutdown timer');
    }
  }

  private timerTick(): void {
    if (this.delta > 0) {
      const factor = (this.delta / 100) * 3;
      this.delta -= (1 + factor);
      if (this.delta < 0) this.delta = 0;
    }

    // Check stats and award stars
    this.checkAndAwardStars();
    console.log('Timer... delta:', this.delta);
  }

  private async checkAndAwardStars(): Promise<void> {
    if (!this.userLevel) return;

    let newStars = this.userLevel.stars;
    
    if (this.delta > 70 && this.userLevel.stars < 3) {
      newStars = 3;
      console.log('Gold medal awarded');
    } else if (this.delta > 50 && this.userLevel.stars < 2) {
      newStars = 2;
      console.log('Silver medal awarded');
    } else if (this.delta > 30 && this.userLevel.stars < 1) {
      newStars = 1;
      console.log('Bronze medal awarded');
    }

    if (newStars > this.userLevel.stars) {
      this.userLevel.stars = newStars;
      await this.settingsService.updateLevelStars(this.levelIndex, newStars);
    }
  }

  onClickAnswer(index: number): void {
    // Spam click protection
    const now = Date.now();
    const spamClickCheck = now - this.lastClick;
    this.lastClick = now;
    
    if (spamClickCheck < 500) {
      console.log('Spam click');
      return;
    }

    if (!this.quiz || this.showFeedback) return;

    this.selectedAnswerIndex = index;
    this.showFeedback = true;
    const isCorrect = this.quiz.correctIndex === index;
    console.log('Answer is:', isCorrect ? 'correct' : 'incorrect');

    if (this.isTimed) {
      const adjustment = ((100 - this.delta) / 8) * (isCorrect ? 1 : -1);
      this.delta += adjustment;
      if (this.delta < 0) this.delta = 0;
    }

    // Small delay before showing next question
    setTimeout(() => {
      this.selectedAnswerIndex = null;
      this.showFeedback = false;
      this.createQuiz();
    }, isCorrect ? 300 : 800);
  }

  private createQuiz(): void {
    if (this.level) {
      this.quiz = this.mathService.getQuiz(this.level.level);
    }
  }

  getProgressColor(): string {
    if (this.delta >= 70) return 'success';
    if (this.delta >= 50) return 'warning';
    if (this.delta >= 30) return 'primary';
    return 'medium';
  }

  getButtonColor(index: number): string {
    if (!this.showFeedback) {
      return 'primary';
    }
    
    // Show feedback after user clicked
    if (this.quiz && index === this.quiz.correctIndex) {
      return 'success';
    }
    if (index === this.selectedAnswerIndex) {
      return 'danger';
    }
    return 'primary';
  }
}
