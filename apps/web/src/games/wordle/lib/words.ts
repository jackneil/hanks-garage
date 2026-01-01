// Word lists for different difficulty levels
// TARGET WORDS: Curated, kid-friendly vocabulary (used for puzzle solutions)
// VALIDATION: Uses Scrabble dictionary (see dictionary.ts) for guess validation

import { getDictionary } from "./dictionary";

export const WORDS_3 = [
  "cat", "dog", "sun", "hat", "run", "big", "red", "bed", "cup", "map",
  "pen", "top", "box", "fox", "hop", "pop", "mom", "dad", "bus", "bug",
  "rug", "mug", "hug", "fun", "gum", "bun", "cut", "nut", "but", "put",
  "bat", "rat", "sat", "mat", "fat", "pat", "van", "can", "man", "pan",
  "fan", "tan", "hen", "ten", "men", "den", "wet", "pet", "set", "net",
  "jet", "let", "get", "met", "bet", "pig", "wig", "dig", "fig", "jig",
  "zip", "tip", "dip", "hip", "lip", "rip", "sip", "six", "mix", "fix",
  "pot", "hot", "dot", "got", "not", "lot", "cot", "rot", "log", "fog",
  "jog", "pup", "hog", "cow", "bow", "row", "low", "mow", "tow", "sow",
  "boy", "toy", "joy", "say", "day", "way", "may", "pay", "hay", "ray",
];

export const WORDS_4 = [
  "play", "jump", "fish", "game", "ball", "tree", "book", "star", "moon", "snow",
  "rain", "cake", "bear", "duck", "frog", "bird", "leaf", "rock", "sand", "wave",
  "ship", "boat", "bike", "kite", "drum", "bell", "ring", "sing", "king", "wing",
  "pink", "blue", "gold", "gray", "dark", "fast", "slow", "tall", "cool", "warm",
  "soft", "hard", "good", "nice", "kind", "love", "home", "room", "door", "wall",
  "hand", "foot", "face", "head", "nose", "eyes", "ears", "lips", "hair", "back",
  "milk", "food", "meat", "rice", "corn", "bean", "peas", "soup", "salt", "dish",
  "help", "work", "rest", "walk", "talk", "read", "draw", "swim", "ride", "hide",
  "find", "make", "take", "give", "come", "stay", "feel", "want", "need", "wish",
  "baby", "kids", "aunt", "dogs", "cats", "pets", "toys", "cars", "park", "pool",
  "farm", "barn", "city", "road", "path", "hill", "pond", "lake", "fire", "wind",
  "time", "year", "week", "hour", "part", "side", "away", "near", "here", "over",
];

export const WORDS_5 = [
  "happy", "party", "candy", "pizza", "beach", "water", "music", "dance", "laugh", "smile",
  "dream", "magic", "super", "power", "space", "robot", "alien", "queen", "crown", "sword",
  "horse", "tiger", "shark", "snake", "eagle", "bunny", "puppy", "kitty", "mouse", "whale",
  "plant", "flower", "grass", "cloud", "storm", "sunny", "rainy", "windy", "foggy", "snowy",
  "house", "table", "chair", "couch", "floor", "light", "clock", "phone", "glass", "brush",
  "bread", "fruit", "apple", "grape", "lemon", "peach", "melon", "berry", "juice", "honey",
  "shirt", "pants", "shoes", "socks", "dress", "coat", "scarf", "glove", "purse", "watch",
  "train", "plane", "truck", "wheel", "speed", "drive", "crash", "brake", "motor", "track",
  "brain", "heart", "blood", "teeth", "thumb", "elbow", "chest", "knee", "ankle", "wrist",
  "earth", "world", "ocean", "river", "mount", "cliff", "cave", "woods", "field", "trail",
  "story", "movie", "video", "album", "photo", "paint", "color", "shape", "round", "square",
  "count", "first", "third", "fifth", "month", "today", "night", "early", "later", "begin",
  "again", "about", "above", "after", "along", "among", "being", "below", "every", "could",
  "would", "should", "think", "thank", "thing", "those", "three", "under", "until", "where",
  "which", "while", "white", "whole", "woman", "women", "write", "young", "youth", "build",
  "climb", "cover", "cross", "doubt", "drink", "error", "event", "extra", "focus", "force",
  "fresh", "front", "fruit", "grade", "grand", "great", "green", "group", "guide", "heard",
  "heart", "heavy", "human", "image", "index", "inner", "input", "issue", "joint", "judge",
  "known", "large", "laugh", "layer", "learn", "least", "leave", "level", "light", "limit",
  "local", "logic", "loose", "lower", "lunch", "major", "maker", "match", "maybe", "media",
];

export const WORDS_6 = [
  "garden", "monkey", "dragon", "castle", "pirate", "prince", "wonder", "friend", "family", "school",
  "summer", "winter", "spring", "autumn", "market", "bridge", "tunnel", "island", "forest", "desert",
  "jungle", "planet", "galaxy", "rocket", "meteor", "system", "engine", "button", "screen", "camera",
  "guitar", "violin", "pillow", "mirror", "window", "carpet", "closet", "drawer", "cereal", "cookie",
  "muffin", "waffle", "yogurt", "cheese", "butter", "tomato", "carrot", "potato", "banana", "orange",
  "cherry", "frozen", "jacket", "mitten", "helmet", "sandal", "saddle", "pedals", "handle", "basket",
  "trophy", "ribbon", "player", "winner", "muscle", "finger", "tongue", "throat", "kidney", "person",
  "people", "parent", "sister", "cousin", "nephew", "animal", "purple", "yellow", "circle", "square",
  "pigeon", "rabbit", "turtle", "lizard", "beetle", "spider", "donkey", "turkey", "falcon", "parrot",
  "pencil", "crayon", "eraser", "marker", "folder", "staple", "binder", "laptop", "tablet", "remote",
];

export function getWordList(length: number): string[] {
  switch (length) {
    case 3:
      return WORDS_3;
    case 4:
      return WORDS_4;
    case 5:
      return WORDS_5;
    case 6:
      return WORDS_6;
    default:
      return WORDS_5;
  }
}

export function getRandomWord(length: number): string {
  const words = getWordList(length);
  return words[Math.floor(Math.random() * words.length)].toUpperCase();
}

export function isValidWord(word: string, length: number): boolean {
  // Use Scrabble dictionary for validation (much more comprehensive)
  const dictionary = getDictionary(length);
  return dictionary.has(word.toLowerCase());
}
