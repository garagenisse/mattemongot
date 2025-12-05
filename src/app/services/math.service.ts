import { Injectable } from '@angular/core';

export interface Quiz {
  quizDisplay: string;
  answers: number[];
  correctIndex: number;
}

@Injectable({
  providedIn: 'root'
})
export class MathService {
  constructor() {}

  /**
   * Generate a quiz for the given times table
   * @param timesTable The multiplication table (1-20)
   * @returns Quiz object with question and answers
   */
  getQuiz(timesTable: number): Quiz {
    // Get random number 0-10
    const r = Math.round(Math.random() * 10);

    // Randomly choose x * y or y * x format
    const quiz = Math.random() < 0.5 
      ? `${r} × ${timesTable}` 
      : `${timesTable} × ${r}`;

    console.log('New quiz:', quiz);

    const correctAnswer = r * timesTable;
    const answers: number[] = [correctAnswer];

    // Generate two incorrect answers
    while (answers.length <= 2) {
      const wrongAnswer = Math.round(Math.random() * 10) * timesTable;
      if (!answers.includes(wrongAnswer)) {
        answers.push(wrongAnswer);
      }
    }

    console.log('Answers:', answers.join(', '));

    // Shuffle answers using Fisher-Yates algorithm
    const shuffledAnswers = this.shuffleArray([...answers]);
    console.log('Answers shuffled:', shuffledAnswers.join(', '));

    const correctIndex = shuffledAnswers.findIndex(a => a === correctAnswer);

    return {
      quizDisplay: quiz,
      answers: shuffledAnswers,
      correctIndex
    };
  }

  /**
   * Fisher-Yates shuffle algorithm
   */
  private shuffleArray<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
}
