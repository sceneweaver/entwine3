import Actor from './actors-constructor';

// remove new lines and spaces
const splitStr = str => {
  let arr = str.split('\n').join(' ');
  arr = arr.split(' ');
  return arr;
};

const removeAbbr = arr => {
  return arr.filter(word => {
    return word // convert string to array of words; only include words (no empty strings)
      && word !== 'Mr.'
      && word !== 'Ms.'
      && word !== 'Mrs.'
      && (word.length > 2 || word[word.length - 1] !== '.'); // removes middle initials as to not confuse them with the end of a sentence
  });
};

const filterWords = arr => {
  return arr.filter((word, i, a) => {
    let prevWord = a[i - 1];
    return i !== 0 // exclude the first word (will always be capitalized)
      && /^[a-zA-Z]/.test(arr[i]) // exclude anything that does not start with a letter
      && !word.includes('—') // excludes any two words that have been joined by an em-dash
      && prevWord[prevWord.length - 1] !== '.' // excludes first word of a sentence
      && prevWord[prevWord.length - 1] !== '!' // excludes first word of a sentence
      && prevWord[prevWord.length - 1] !== '?' // excludes first word of a sentence
      && prevWord[prevWord.length - 2] !== '.' // excludes first word of a sentence if previous sentence ended in close quote
      && prevWord[prevWord.length - 1] !== ':';
  });
};

const removeApostrophes = arr => {
  return arr.map(word => word.replace(/'s/g, '')) // remove 's from end of words
};

const arrToObj = arr => {
  let pronounObj = {};
  let i = 0;
  while (i < arr.length) {
    if (/^[A-Z]/.test(arr[i])) { // check if word is capitalized
      let newWord = `${arr[i]}`;
      while (/^[A-Z]/.test(arr[i + 1]) && newWord[newWord.length - 1] !== ',') { // if next word is capitalized too, combine them. Will not combine proper nouns separated by a comma
        newWord += ` ${arr[i + 1]}`;
        i++;
      }
      pronounObj[newWord] ? pronounObj[newWord]++ : pronounObj[newWord] = 1; // count the number of occurences
    }
    i++;
  }
  return pronounObj;
};

const removePunctuation = obj => {
  const newObj = {};
  for (let key in obj) {
    const newKey = key.replace(/[",.!?*:]+/g, '');
    newObj[newKey] = obj[key];
  }
  return newObj;
};

// remove any date words
const removeUnwantedWords = obj => {
  const newObj = {};
  const unwantedWords = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'Jan', 'Feb', 'Mar', 'Apr', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Mon', 'Tue', 'Wed', 'Thurs', 'Fri', 'Sat', 'Sun', 'I'];
  for (let actorName in obj) {
    if (!unwantedWords.includes(actorName)) {
      newObj[actorName] = obj[actorName];
    }
  }
  return newObj;
};

// convert obj of words to array by rate of occurrence
const sortObjByOccurrence = obj => {
  const promisesArray = [];
  for (let word in obj) {
    const newActor = new Actor();
    newActor.name = word;
    promisesArray.push(newActor.getWikiInfo());
  }
  return Promise.all(promisesArray)
    .then(updatedActors => {
      const hash = {};
      updatedActors.forEach(actor => {
        if (hash[obj[actor.name]]) {
          hash[obj[actor.name]].push(actor);
        } else {
          hash[obj[actor.name]] = [actor];
        }
      });
      return hash;
    });
};

const convertHashToOrderedArr = hash => {
  let arrayOfOccurrences = [];
  let arrayOfWords = [];
  for (const num in hash) {
    arrayOfOccurrences.push(+num);
  }
  arrayOfOccurrences = arrayOfOccurrences.sort((a, b) => b - a);
  arrayOfOccurrences.forEach(key => {
    arrayOfWords = arrayOfWords.concat(hash[key]);
  })
  return arrayOfWords;
};

export default function findProperNouns(text) {
  const nounObj = removeUnwantedWords(removePunctuation(arrToObj(removeApostrophes(filterWords(removeAbbr(splitStr(text)))))));
  return sortObjByOccurrence(nounObj)
    .then(sortedObj => convertHashToOrderedArr(sortedObj));
}

