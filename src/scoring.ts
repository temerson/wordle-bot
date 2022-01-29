import { Word } from './types';

type Scores = { [key: string]: number };

// scores based on number of other words with the same letters, after removing duplicates
function scoreWordByLetterFrequency(word: string, letterFrequencies: Scores): number {
  return Array.from(new Set(word)).reduce((score, letter) => score + letterFrequencies[letter], 0);
}

// scores by most words with matching letters in the same spot, one point for each match in the word
function scoreWordByMostGreens(word: string, dictionary: string[]): number {
  const countGreens: Function = (baseWord: string, compareWord: string) => Array
    .from(baseWord)
    .reduce((score, letter, index) => score + (compareWord[index] === letter ? 1 : 0), 0);
  return dictionary
    .map((compareWord) => countGreens(word, compareWord))
    .reduce((total, score) => total + score, 0);
}

export function scoreDictionaryByWordCount(dictionary: string[]): Word[] {
  const allWordsTogether: string = dictionary.reduce((str, word) => str + word, '');
  const letterFrequencies: Scores = Array.from(allWordsTogether)
    .reduce((scores: Scores, letter) => ({ ...scores, [letter]: (scores[letter] || 0) + 1 }), {});

  return dictionary
    .map((word) => ({
      value: word,
      score: scoreWordByLetterFrequency(word, letterFrequencies),
    }))
    .sort((a: Word, b: Word) => b.score - a.score);
}

export function scoreDictionaryByMostGreens(dictionary: string[]): Word[] {
  return dictionary
    .map((word) => ({
      value: word,
      score: scoreWordByMostGreens(word, dictionary),
    }))
    .sort((a: Word, b: Word) => b.score - a.score);
}
