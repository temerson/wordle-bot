import fetch from 'isomorphic-fetch';

export async function fetchJsBundleName(url: string): Promise<string|undefined> {
  return fetch(url)
    .then((resp: Response) => resp.text())
    .then((html: string) => html.match(/main.[\w\n]+.js/)?.[0]);
}

export async function fetchDictionary(url: string): Promise<string[]> {
  return fetch(url)
    .then((resp: Response) => resp.text())
    .then((js: string) => {
      const wordString: string|undefined = js.match(/("\w{5}",)+"\w{5}"/)?.[0];
      return wordString?.split(',').map((wordWithQuotes: string) => wordWithQuotes.substring(1, 6)) || [];
    });
}
