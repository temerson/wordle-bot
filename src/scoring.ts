import { Word } from './types';

type Scores = { [key: string]: number };

function isGreen(baseWord: string, compareWord: string, index: number): boolean {
  return baseWord[index] == compareWord[index];
}

function isYellow(baseWord: string, compareWord: string, index: number): boolean {
  // this will count yellows multiple times, which needs to be fixed
  // eg if the baseWord is `eerie` and the compareWord is `steps` it will find 3 yellow matches
  return !isGreen(baseWord, compareWord, index) && compareWord.includes(baseWord[index]);
}

// scores based on number of other words with the same letters, after removing duplicates
function scoreWordByLetterFrequency(word: string, letterFrequencies: Scores): number {
  return Array.from(new Set(word)).reduce((score, letter) => score + letterFrequencies[letter], 0);
}

// replace non-unique letters with underscores, eg: `eerie` => `e_ri_`
function toUniqueLetters(word: string): string {
  const usedLetters: string[] = [];
  return Array.from(word)
    .reduce((newWord, letter) => {
      if (usedLetters.includes(letter)) {
        return newWord + '_';
      } else {
        usedLetters.push(letter);
        return newWord + letter;
      }
    }, '');
}

// scores by most words with matching letters in the same spot, one point for each match in the word
function scoreWordByMostGreens(word: string, dictionary: string[]): number {
  const countGreens: Function = (baseWord: string, compareWord: string) => Array
    .from(baseWord)
    .reduce((score, _, index) => score + (isGreen(baseWord, compareWord, index) ? 1 : 0), 0);
  return dictionary
    .map((compareWord) => countGreens(word, compareWord))
    .reduce((total, score) => total + score, 0);
}

// scores by most words with matching letters in the same spot, two points per green and one point for each yellow in the word
function scoreWordByMostGreensAndYellows(word: string, dictionary: string[]): number {
  const countGreens: Function = (baseWord: string, compareWord: string) => Array
    .from(baseWord)
    .reduce((score, _, index) => score + (isGreen(baseWord, compareWord, index) ? 2 : 0), 0);
  const countYellows: Function = (baseWord: string, compareWord: string) => Array
    .from(baseWord) 
    .map(toUniqueLetters)
    .reduce((score, _, index) => score + (isYellow(baseWord, compareWord, index) ? 1 : 0), 0);
  return dictionary
    .map((compareWord) => countGreens(word, compareWord) + countYellows(word, compareWord))
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

export function scoreDictionaryByMostGreensAndYellows(dictionary: string[]): Word[] {
  return dictionary
    .map((word) => ({
      value: word,
      score: scoreWordByMostGreensAndYellows(word, dictionary),
    }))
    .sort((a: Word, b: Word) => b.score - a.score);
}
