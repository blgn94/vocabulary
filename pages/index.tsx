import React, { useRef, useState } from "react";
import Head from 'next/head'
import styles from '../styles/Home.module.css'

export default function Home() {  
  type object1 = {
    word: string,
    count: number,
    percentage: number,
  }

  let file: string = "";
  let file1 = "";

  const [topTenWord, setTopTenWord] = useState<object1[]>([]);
  const [paragraphs, setParagraph] = useState(0);
  const [sentences, setSentences] = useState(0);
  const [words, setWords] = useState(0);
  const [characters, setCharacters] = useState(0);
  const [averageOfWordsInSentences, setAverageOfWordsInSentences] = useState(0);
  const [vocabulary, setVocabulary] = useState<string[]>([]);
  // const [text, setText] = useState<string[]>([]);
  const [vocabFromStory, setVocabFromStory] = useState<string[]>([]);

  const getConflictStoryVocab = () => {
    let array: Array<string> = []
    vocabFromStory.map((item, index) => {
      if(isNotContainsReal(vocabulary, item))
      array.push(item);
    })
    return array;
  }
  const getConflictStudentVocab = () => {
    let array: Array<string> = []
    vocabulary.map((item, index) => {
      if(isNotContainsReal(vocabFromStory, item))
      array.push(item);
    })
    return array;
  }
  // *************************** In file, how many paragraphs are there? ***************************
  const getParagraphCount = () => {
    let paragraph = 0;
    let i = 0;
    while(i < file.length) {
      if(file[i] === '\n') {
        let oldCounter = i;
        while(file[oldCounter] === '\n') {
          oldCounter++;
        }
        i = oldCounter;
        paragraph++;
      }
      i++;
    }
    return paragraph; 
  }
  // *************************** In file, how many sentences are there? ***************************
  const getSentenceCount = () => {
    let sentences = 0;
    for(let i=0; i<file.length; i++)
      if(file[i] === '.') {
        if(file[i + 1] === ' ')
          sentences++;
    }
    return sentences;
  }
  // *************************** In file, how many words there? ***************************
  const getWordCount = (inputText: string) => {
    let words = 0;
    for(let i=0; i<inputText.length; i++) {
      if(inputText[i] === ' ') {
        words++;
      }
    }
    return words;
  }
  const getCharacterCount = () => {
    return file.length;
  }
  // *************************** return structured words ***************************
  const getOrganizedWords = () => {
    const words = file.split(' ');
    const eachWords: { word: string; count: number }[] = [];
    words.map((item, key) => {
      const wordObject = {word: "", count: 0};
      if(item.length > 2) {
        wordObject.word = item;
        wordObject.count = words.filter(searchingWord => searchingWord === item).length;
        eachWords.push(wordObject);
      }
    })
    return eachWords;
  }
  // *************************** Quick sort functions ***************************
  // source: https://www.guru99.com/quicksort-in-javascript.html
  function swap(items: Array<{word: string, count: number}>, leftIndex: number, rightIndex: number){
      var temp = items[leftIndex];
      items[leftIndex] = items[rightIndex];
      items[rightIndex] = temp;
  }
  function partition(items: Array<{word: string, count: number}>, left: number, right: number) {
      let pivot = items[Math.floor((right + left) / 2)].count; 
      let i = left;
      let j = right;
      while (i <= j) {
          while (items[i].count > pivot) {
              i++;
          }
          while (items[j].count < pivot) {
              j--;
          }
          if (i <= j) {
              swap(items, i, j);
              i++;
              j--;
          }
      }
      return i;
  }
  function quickSort(items: Array<{word: string, count: number}>, left: number, right: number) {
      var index;
      if (items.length > 1) {
          index = partition(items, left, right);
          if (left < index - 1) {
              quickSort(items, left, index - 1);
          }
          if (index < right) {
              quickSort(items, index, right);
          }
      }
      return items;
  }
  // *************************** Top Ten Unique words finding functions ***************************
  // source: https://stackoverflow.com/questions/11246758/how-to-get-unique-values-in-an-array
  const contains = (array: Array<{word: string, count: number}>, word: string) => {
    for (var i = 0; i < array.length; i++) {
      if (array[i].word === word) return false;
    }
    return true;
  };
  const isNotContainsReal = (array: Array<string>, word: string) => {
    for (var i = 0; i < array.length; i++) {
      if (array[i] === word) return false;
    }
    return true;
  };
  const unique = (array: Array<{word: string, count: number}>) => {
    let arr: {word: string, count: number, percentage: number}[] = [];
    for (let i = 0; i < array.length; i++) {
      if (contains(arr, array[i].word)) {
        const percentage = Math.round( (array[i].count / getWordCount(file)) * 100 )
        arr.push({ word: array[i].word, count: array[i].count, percentage: percentage });
      }
    }
    const topTen = [];
    for(let i=0; i<10; i++) {
      topTen.push(arr[i]);
    }
    return topTen;
  }
  const uniqueReal = (array: Array<string>) => {
    let arr: Array<string> = [];
    for (let i = 0; i < array.length; i++) {
      if (isNotContainsReal(arr, array[i])) {
        arr.push(array[i]);
      }
    }
    return arr;
  }
  // ***************************************** find the average words number of sentences ***************************************** 
  const getAverageNumberOfWordsInSentence = () => {
    const sentences = [];
    let sentence = "";
    for(let i=0; i<file.length; i++) {
      sentence += file[i];
      if(file[i] === '.') {
        if(file[i + 1] === ' ') {
          sentences.push(sentence);
          sentence = "";
        }
      }
    }
    let NumberOfWordsInSentences: number[] = [];
    sentences.forEach((item) => {
      NumberOfWordsInSentences.push(getWordCount(item));
    });
    let sumOfWords = 0;
    NumberOfWordsInSentences.forEach(numberOfWords => (sumOfWords += numberOfWords));
    return Math.round(sumOfWords / sentences.length);
  }
  // ************************************** get list of vocabulary of story **************************************
  const getVacobFromStory = (inputText: string) => {
    let words = [];
    let word = "";
    for(let i=0; i<inputText.length; i++) {
      if((inputText[i] === ' ' || inputText[i] === '.' || inputText[i] === ',' || inputText[i] === '(' || inputText[i] === ')') && word.length > 0) {
        word = word.toLocaleLowerCase();
        words.push(word);
        word = "";
      }
      if(inputText[i] !== ' ' && inputText[i] !== ',' 
      && inputText[i] !== '.' && inputText[i] !== `'` 
      && inputText[i] !== `"` && inputText[i] !== '(' 
      && inputText[i] !== ')' && inputText[i] !== '0'
      && inputText[i] !== '1' && inputText[i] !== '2'
      && inputText[i] !== '3' && inputText[i] !== '4'
      && inputText[i] !== '5' && inputText[i] !== '6'
      && inputText[i] !== '7' && inputText[i] !== '8'
      && inputText[i] !== '9' && inputText[i] !== '-'
      && inputText[i] !== ' ' && inputText[i] !== '\n'
      && inputText[i] !== '\r'){
          word += inputText[i];
      }
    }
    return words;
  }
  // ************************* upload short story .txt file and show ****************************
  let bg: Array<string> = [];
  const [text, setText] = useState<string[]>([]);
  const showShortStory = (event: Event) => {
    const preview = document.getElementById("show-text");
    const reader = new FileReader();
    const textFile = /text.*/;
    const fileSelected = event.target ? event.target.files[0] : null;
    if(window.File && window.FileReader && window.FileList && window.Blob) {
      if (fileSelected.type.match(textFile)){
        reader.onload = () => {
          file = reader.result?.toString().toLocaleLowerCase();
        }
        reader.onloadend = (event) => {
          // text = file.split('\n');
          setText(file.split("\n"));
          setParagraph(getParagraphCount());
          setSentences(getSentenceCount());
          setWords(getWordCount(file));
          setCharacters(getCharacterCount());
          setTopTenWord(unique(quickSort(getOrganizedWords(), 0, getOrganizedWords().length - 1)));
          setAverageOfWordsInSentences(getAverageNumberOfWordsInSentence());
          setVocabFromStory(uniqueReal(getVacobFromStory(file)));
        }
        reader.readAsText(fileSelected);
      }
      else {
        alert("It doesn't seem to be a text file!");
      }
    }
    else {
      alert("Your browser is too old to support HTML5 File API");
    }
  }
  // ************************* upload student vocabulary .txt file and show ****************************
  const showVocabulary = (event: Event) => {
    const preview = document.getElementById("show-text");
    const reader = new FileReader();
    const textFile = /text.*/;
    const fileSelected = event.target ? event.target.files[0] : null;
    if(window.File && window.FileReader && window.FileList && window.Blob) {
      if (fileSelected.type.match(textFile)){
        reader.onload = () => {
          file = reader.result?.toString().toLocaleLowerCase();
        }
        reader.onloadend = () => {
          setVocabulary(file.split('\r\n'));
        }
        reader.readAsText(fileSelected);
      }
      else {
        alert("It doesn't seem to be a text file!");
      }
    }
    else {
      alert("Your browser is too old to support HTML5 File API");
    }
  }
  // *********************** download button js *************************
  // source: https://javascript.plainenglish.io/how-to-download-files-on-button-click-reactjs-f7257e55a26b
  const downloadTxtFile1 = () => {
    let string = getConflictStoryVocab();
    for(let i=0; i<string.length; i++) {
      string[i] = string[i] + "\n";
    }
    const file = new Blob(string, {type: 'text/plain'});
    const element = document.createElement("a");
    element.href = URL.createObjectURL(file);
    element.download = "vocabulary1 - Result.txt";
    document.body.appendChild(element);
    element.click();
  }
  const downloadTxtFile2 = () => {
    let string = getConflictStudentVocab();
    for(let i=0; i<string.length; i++) {
      string[i] = string[i] + "\n";
    }
    const file = new Blob(string, {type: 'text/plain'});
    const element = document.createElement("a");
    element.href = URL.createObjectURL(file);
    element.download = "vocabulary2 - Result.txt";
    document.body.appendChild(element);
    element.click();
  }

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.statistic}>
            <div className={styles.counts}>
              <p>
                Paragraphs: {paragraphs}
              </p>
              <p>
                Sentences: {sentences}
              </p>
              <p>
                Words: {words}
              </p>
              <p>
                Characters: {characters}
              </p>
            </div>
            <div className={styles.topTenWords}>
              <strong>Top 10 words in whole text:</strong>
              {(topTenWord && topTenWord?.length > 0) && topTenWord.map((item, key) => (
                <p key={key}>{item.word} : {item.percentage}%</p>
              ))}
            </div>
            <div className={styles.averageWordsInSentence}>
                <p>
                  <strong>Average words number of each sentences : </strong>{averageOfWordsInSentences}
                </p>
            </div>
          </div>
          <div className={styles.ShortStory}>
            <p className={styles.notConflictTitle}>
              <strong>Short Story</strong>
              <br/>
              <br/>
            </p>
              {console.log(text)}
              {(text && text.length > 0) && text?.map((item, key) => (
                <p key={key}>{item} <br/> </p>
                ))}
          </div>
        </div>
        {/* ********************** file upload ********************** */}
        <div className={styles.Inputs}>
          <input id="shortStory" type="file" onChange={showShortStory}></input>
          <input id="vocabulary" type="file" onChange={showVocabulary}></input>
        </div>
        {/* ********************** download button ********************** */}
        <div className={styles.btnDiv}>
          <button id="downloadBtn" onClick={downloadTxtFile1} value="download">Download: 1</button>
          <button id="downloadBtn" onClick={downloadTxtFile2} value="download">Download: 2</button>
        </div>
        {/* ********************** texts ************************ */}
        <div className={styles.paragraphText}>
          <div className={styles.vocabFromStory}>
            <p className={styles.notConflictTitle}>
              <strong>Short Story Vocabulary</strong>
              <br/>
              <br/>
            </p>
            {(vocabFromStory && vocabFromStory.length > 0) && vocabFromStory.map((item, index) => (
              <p key={index}> {item} <br/> </p>
            ))}
          </div>
          <div className={styles.Vocabulary}>
            <p className={styles.notConflictTitle}>
              <strong>Student Vocabulary</strong>
              <br/>
              <br/>
            </p>
            {(vocabulary && vocabulary.length > 0) && vocabulary.map((item, index) => (
              <p key={index}> {item} <br/> </p>
            ))}
          </div>
          <div className={styles.vocabFromStoryConflict}>
              <p className={styles.notConflictTitle}>
                <strong>1: Vocabulary from short story /not conflict with student vocabulary/</strong>
                <br/>
                <br/>
              </p>
            {((vocabFromStory && vocabFromStory.length > 0) && (vocabulary.length > 0 && vocabulary)) && vocabFromStory.map((item, index) => {
              // return isNotContainsReal(vocabulary, item) ? <p key={index}> {item} <br/></p> : null;
              return !vocabulary.includes(item) ? <p key={index}> {item} <br/></p> : null;
            })}
          </div>
          <div className={styles.VocabularyConflict}>
              <p className={styles.notConflictTitle}>
                <strong>2: Vocabulary from student /not conflict with vocabulary of story/</strong>
                <br/>
                <br/>
              </p>
            {((vocabulary && vocabulary.length > 0) && (vocabFromStory.length > 0 && vocabFromStory)) && vocabulary.map((item, index) => {
              return isNotContainsReal(vocabFromStory, item) ? <p key={index}> {item} <br/></p> : null;
            })}
          </div>
        </div>
      </main>
    </>
  )
}