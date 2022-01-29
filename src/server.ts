import { fetchJsBundleName, fetchDictionary } from './fetchUtils.js';
import { scoreDictionaryByWordCount, scoreDictionaryByMostGreens, scoreDictionaryByMostGreensAndYellows } from './scoring.js';

const baseUrl: string = 'https://www.powerlanguage.co.uk/wordle/';
const jsBundleName: string = await fetchJsBundleName(baseUrl) || '';
const dictionary: string[] = await fetchDictionary(baseUrl + jsBundleName);

// console.log(scoreDictionaryByWordCount(dictionary).slice(0, 10));
// console.log(scoreDictionaryByMostGreens(dictionary).slice(0, 10));
console.log(scoreDictionaryByMostGreensAndYellows(dictionary).slice(0, 10));
