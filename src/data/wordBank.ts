import { Quote } from '../types/typing';

export const COMMON_WORDS: string[] = [
  'the', 'be', 'of', 'and', 'a', 'to', 'in', 'he', 'have', 'it', 'that', 'for', 'they', 'with', 'as', 'not',
  'on', 'she', 'at', 'by', 'this', 'we', 'you', 'do', 'but', 'his', 'from', 'they', 'say', 'her', 'she',
  'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what', 'so', 'up', 'out', 'if', 'about',
  'who', 'get', 'which', 'go', 'me', 'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know',
  'take', 'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other', 'than', 'then',
  'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also', 'back', 'after', 'use', 'two', 'how',
  'our', 'work', 'first', 'well', 'way', 'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day',
  'most', 'us', 'great', 'between', 'need', 'large', 'system', 'water', 'place', 'right', 'small', 'number',
  'always', 'world', 'next', 'sound', 'below', 'something', 'thought', 'both', 'few', 'those', 'show',
  'always', 'large', 'often', 'together', 'ask', 'house', 'world', 'school', 'point', 'study', 'still',
  'learn', 'plant', 'cover', 'food', 'sun', 'four', 'between', 'state', 'keep', 'eye', 'never', 'last',
  'let', 'thought', 'city', 'tree', 'cross', 'farm', 'hard', 'start', 'might', 'story', 'saw', 'far',
  'sea', 'draw', 'left', 'late', 'run', 'don\'t', 'while', 'press', 'close', 'night', 'real', 'life',
  'few', 'north', 'open', 'seem', 'together', 'next', 'white', 'children', 'begin', 'got', 'walk',
  'example', 'ease', 'paper', 'group', 'always', 'music', 'those', 'both', 'mark', 'often', 'letter',
  'until', 'mile', 'river', 'car', 'feet', 'care', 'second', 'book', 'carry', 'took', 'science', 'eat',
  'room', 'friend', 'began', 'idea', 'fish', 'mountain', 'stop', 'once', 'base', 'hear', 'horse', 'cut',
  'sure', 'watch', 'color', 'face', 'wood', 'main', 'enough', 'plain', 'girl', 'usual', 'young', 'ready',
  'above', 'ever', 'red', 'list', 'though', 'feel', 'talk', 'bird', 'soon', 'body', 'dog', 'family',
  'direct', 'pose', 'leave', 'song', 'measure', 'door', 'product', 'black', 'short', 'numeral', 'class',
  'wind', 'question', 'happen', 'complete', 'ship', 'area', 'half', 'rock', 'order', 'fire', 'south',
  'problem', 'piece', 'told', 'knew', 'pass', 'since', 'top', 'whole', 'king', 'space', 'heard', 'best',
  'hour', 'better', 'true', 'during', 'hundred', 'five', 'remember', 'step', 'early', 'hold', 'west',
  'ground', 'interest', 'reach', 'fast', 'verb', 'sing', 'listen', 'six', 'table', 'travel', 'less',
  'morning', 'ten', 'simple', 'several', 'vowel', 'toward', 'war', 'lay', 'against', 'pattern', 'slow',
  'center', 'love', 'person', 'money', 'serve', 'appear', 'road', 'map', 'rain', 'rule', 'govern',
  'pull', 'cold', 'notice', 'voice', 'unit', 'power', 'town', 'fine', 'certain', 'fly', 'fall', 'lead',
  'cry', 'dark', 'machine', 'note', 'wait', 'plan', 'figure', 'star', 'box', 'noun', 'field', 'rest',
  'correct', 'able', 'pound', 'done', 'beauty', 'drive', 'stood', 'contain', 'front', 'teach', 'week',
  'final', 'gave', 'green', 'oh', 'quick', 'develop', 'ocean', 'warm', 'free', 'minute', 'strong',
  'special', 'mind', 'behind', 'clear', 'tail', 'produce', 'fact', 'street', 'inch', 'multiply', 'nothing',
  'course', 'stay', 'wheel', 'full', 'force', 'blue', 'object', 'decide', 'surface', 'deep', 'moon',
  'island', 'foot', 'system', 'busy', 'test', 'record', 'boat', 'common', 'gold', 'possible', 'plane',
  'stead', 'dry', 'wonder', 'laugh', 'thousands', 'ago', 'ran', 'check', 'game', 'shape', 'equate',
  'hot', 'miss', 'brought', 'heat', 'snow', 'tire', 'bring', 'yes', 'distant', 'fill', 'east', 'paint',
  'language', 'among', 'grand', 'ball', 'yet', 'wave', 'drop', 'heart', 'am', 'present', 'heavy', 'dance',
  'engine', 'position', 'arm', 'wide', 'sail', 'material', 'size', 'vary', 'settle', 'speak', 'weight',
  'general', 'ice', 'matter', 'circle', 'pair', 'include', 'divide', 'syllable', 'felt', 'perhaps', 'pick'
];

export const CURATED_QUOTES: Quote[] = [
  {
    id: 'q1',
    text: 'Simplicity is prerequisite for reliability.',
    author: 'Edsger W. Dijkstra',
    length: 'short',
  },
  {
    id: 'q2',
    text: 'Talk is cheap. Show me the code.',
    author: 'Linus Torvalds',
    length: 'short',
  },
  {
    id: 'q3',
    text: 'Perfection is achieved not when there is nothing more to add, but when there is nothing left to take away.',
    author: 'Antoine de Saint-Exupéry',
    length: 'short',
  },
  {
    id: 'q4',
    text: 'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    author: 'Martin Fowler',
    length: 'medium',
  },
  {
    id: 'q5',
    text: 'First, solve the problem. Then, write the code. Premature optimization is the root of all evil in programming.',
    author: 'John Johnson & Donald Knuth',
    length: 'medium',
  },
  {
    id: 'q6',
    text: 'In the middle of difficulty lies opportunity. The true sign of intelligence is not knowledge but imagination.',
    author: 'Albert Einstein',
    length: 'medium',
  },
  {
    id: 'q7',
    text: 'It is not the critic who counts; not the man who points out how the strong man stumbles, or where the doer of deeds could have done them better. The credit belongs to the man who is actually in the arena, whose face is marred by dust and sweat and blood.',
    author: 'Theodore Roosevelt',
    length: 'long',
  },
  {
    id: 'q8',
    text: 'Two roads diverged in a yellow wood, and sorry I could not travel both and be one traveler, long I stood and looked down one as far as I could to where it bent in the undergrowth; then took the other, as just as fair, and having perhaps the better claim.',
    author: 'Robert Frost',
    length: 'long',
  },
  {
    id: 'q9',
    text: 'Programs must be written for people to read, and only incidentally for machines to execute. Structure and interpretation of computer programs begins with the clarity of human thought.',
    author: 'Harold Abelson',
    length: 'medium',
  },
  {
    id: 'q10',
    text: 'Make it work, make it right, make it fast.',
    author: 'Kent Beck',
    length: 'short',
  }
];

export function getRandomWords(count: number, includePunctuation = false, includeNumbers = false): string[] {
  const result: string[] = [];
  const punctuationMarks = ['.', ',', '!', '?', ';', ':', '-', '\''];

  for (let i = 0; i < count; i++) {
    // Occasionally inject a number if enabled
    if (includeNumbers && Math.random() < 0.15) {
      const num = Math.floor(Math.random() * 999) + 1;
      result.push(num.toString());
      continue;
    }

    const randomIndex = Math.floor(Math.random() * COMMON_WORDS.length);
    let word = COMMON_WORDS[randomIndex];

    if (includePunctuation && Math.random() < 0.2) {
      const mark = punctuationMarks[Math.floor(Math.random() * punctuationMarks.length)];
      if (mark === '\'') {
        word = word + "'s";
      } else {
        word = word + mark;
      }
    }

    result.push(word);
  }

  return result;
}

export function generateWeakKeyDrill(weakKeys: string[], wordCount = 30): string[] {
  if (!weakKeys.length) {
    return getRandomWords(wordCount);
  }

  const lowercaseWeak = weakKeys.map(k => k.toLowerCase());
  
  // Find words that contain one or more weak keys
  const matchedWords = COMMON_WORDS.filter(w => 
    lowercaseWeak.some(k => w.toLowerCase().includes(k))
  );

  const fallback = COMMON_WORDS;
  const pool = matchedWords.length >= 10 ? matchedWords : fallback;

  const result: string[] = [];
  for (let i = 0; i < wordCount; i++) {
    const picked = pool[Math.floor(Math.random() * pool.length)];
    result.push(picked);
  }

  return result;
}
