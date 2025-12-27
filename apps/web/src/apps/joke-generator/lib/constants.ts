/**
 * Joke Generator Constants
 * Categories, types, and curated kid-friendly jokes
 */

// Joke categories
export const JOKE_CATEGORIES = [
  { id: "all", label: "All", emoji: "🎭" },
  { id: "animals", label: "Animals", emoji: "🐶" },
  { id: "knock-knock", label: "Knock Knock", emoji: "🚪" },
  { id: "school", label: "School", emoji: "📚" },
  { id: "silly", label: "Silly", emoji: "🤪" },
  { id: "food", label: "Food", emoji: "🍕" },
] as const;

export type JokeCategory = (typeof JOKE_CATEGORIES)[number]["id"];

// Joke interface
export interface Joke {
  id: string;
  category: Exclude<JokeCategory, "all">;
  setup: string;
  punchline: string;
}

// Rating type
export type Rating = "funny" | "not-funny";

// Curated kid-friendly jokes (50+ jokes)
export const CURATED_JOKES: Joke[] = [
  // ANIMALS
  {
    id: "animal-001",
    category: "animals",
    setup: "What do you call a sleeping dinosaur?",
    punchline: "A dino-snore!",
  },
  {
    id: "animal-002",
    category: "animals",
    setup: "What do you call a fish without eyes?",
    punchline: "A fsh!",
  },
  {
    id: "animal-003",
    category: "animals",
    setup: "Why don't elephants use computers?",
    punchline: "Because they're afraid of the mouse!",
  },
  {
    id: "animal-004",
    category: "animals",
    setup: "What do you call a bear with no teeth?",
    punchline: "A gummy bear!",
  },
  {
    id: "animal-005",
    category: "animals",
    setup: "Why do cows wear bells?",
    punchline: "Because their horns don't work!",
  },
  {
    id: "animal-006",
    category: "animals",
    setup: "What do you call a dog that does magic tricks?",
    punchline: "A Labracadabrador!",
  },
  {
    id: "animal-007",
    category: "animals",
    setup: "Why did the chicken join a band?",
    punchline: "Because it had the drumsticks!",
  },
  {
    id: "animal-008",
    category: "animals",
    setup: "What do you call an alligator in a vest?",
    punchline: "An investigator!",
  },
  {
    id: "animal-009",
    category: "animals",
    setup: "Why are cats bad storytellers?",
    punchline: "They only have one tale!",
  },
  {
    id: "animal-010",
    category: "animals",
    setup: "What do you call a lazy kangaroo?",
    punchline: "A pouch potato!",
  },

  // KNOCK KNOCK
  {
    id: "knock-001",
    category: "knock-knock",
    setup: "Knock knock. Who's there? Boo. Boo who?",
    punchline: "Don't cry, it's just a joke!",
  },
  {
    id: "knock-002",
    category: "knock-knock",
    setup: "Knock knock. Who's there? Lettuce. Lettuce who?",
    punchline: "Lettuce in, it's cold out here!",
  },
  {
    id: "knock-003",
    category: "knock-knock",
    setup: "Knock knock. Who's there? Cow says. Cow says who?",
    punchline: "No silly, cow says MOOO!",
  },
  {
    id: "knock-004",
    category: "knock-knock",
    setup: "Knock knock. Who's there? Atch. Atch who?",
    punchline: "Bless you!",
  },
  {
    id: "knock-005",
    category: "knock-knock",
    setup: "Knock knock. Who's there? Tank. Tank who?",
    punchline: "You're welcome!",
  },
  {
    id: "knock-006",
    category: "knock-knock",
    setup: "Knock knock. Who's there? Banana. Banana who? (x3) Orange. Orange who?",
    punchline: "Orange you glad I didn't say banana?",
  },
  {
    id: "knock-007",
    category: "knock-knock",
    setup: "Knock knock. Who's there? Interrupting cow. Interrup—",
    punchline: "MOO!",
  },
  {
    id: "knock-008",
    category: "knock-knock",
    setup: "Knock knock. Who's there? Wooden shoe. Wooden shoe who?",
    punchline: "Wooden shoe like to hear another joke?",
  },
  {
    id: "knock-009",
    category: "knock-knock",
    setup: "Knock knock. Who's there? Nobel. Nobel who?",
    punchline: "Nobel, that's why I knocked!",
  },
  {
    id: "knock-010",
    category: "knock-knock",
    setup: "Knock knock. Who's there? Harry. Harry who?",
    punchline: "Harry up, it's cold out here!",
  },

  // SCHOOL
  {
    id: "school-001",
    category: "school",
    setup: "Why did the student eat his homework?",
    punchline: "Because his teacher told him it was a piece of cake!",
  },
  {
    id: "school-002",
    category: "school",
    setup: "What's a math teacher's favorite place to vacation?",
    punchline: "Times Square!",
  },
  {
    id: "school-003",
    category: "school",
    setup: "Why did the music teacher need a ladder?",
    punchline: "To reach the high notes!",
  },
  {
    id: "school-004",
    category: "school",
    setup: "What do you call a number that can't sit still?",
    punchline: "A roamin' numeral!",
  },
  {
    id: "school-005",
    category: "school",
    setup: "Why was the math book sad?",
    punchline: "Because it had too many problems!",
  },
  {
    id: "school-006",
    category: "school",
    setup: "What's a snake's favorite subject?",
    punchline: "Hisssstory!",
  },
  {
    id: "school-007",
    category: "school",
    setup: "Why did the kid bring a ladder to school?",
    punchline: "Because he wanted to go to high school!",
  },
  {
    id: "school-008",
    category: "school",
    setup: "What do elves learn in school?",
    punchline: "The elf-abet!",
  },
  {
    id: "school-009",
    category: "school",
    setup: "Why do calculators make great friends?",
    punchline: "Because you can always count on them!",
  },
  {
    id: "school-010",
    category: "school",
    setup: "What did the pencil say to the paper?",
    punchline: "I dot my i's on you!",
  },

  // SILLY
  {
    id: "silly-001",
    category: "silly",
    setup: "Why don't scientists trust atoms?",
    punchline: "Because they make up everything!",
  },
  {
    id: "silly-002",
    category: "silly",
    setup: "What do you call a fake noodle?",
    punchline: "An impasta!",
  },
  {
    id: "silly-003",
    category: "silly",
    setup: "Why can't you give Elsa a balloon?",
    punchline: "Because she'll let it go!",
  },
  {
    id: "silly-004",
    category: "silly",
    setup: "What did the ocean say to the beach?",
    punchline: "Nothing, it just waved!",
  },
  {
    id: "silly-005",
    category: "silly",
    setup: "Why did the scarecrow win an award?",
    punchline: "Because he was outstanding in his field!",
  },
  {
    id: "silly-006",
    category: "silly",
    setup: "What do you call a boomerang that doesn't come back?",
    punchline: "A stick!",
  },
  {
    id: "silly-007",
    category: "silly",
    setup: "Why did the golfer bring two pairs of pants?",
    punchline: "In case he got a hole in one!",
  },
  {
    id: "silly-008",
    category: "silly",
    setup: "What did the left eye say to the right eye?",
    punchline: "Between you and me, something smells!",
  },
  {
    id: "silly-009",
    category: "silly",
    setup: "Why can't your nose be 12 inches long?",
    punchline: "Because then it would be a foot!",
  },
  {
    id: "silly-010",
    category: "silly",
    setup: "What do you call a dinosaur that crashes their car?",
    punchline: "Tyrannosaurus Wrecks!",
  },

  // FOOD
  {
    id: "food-001",
    category: "food",
    setup: "Why did the banana go to the doctor?",
    punchline: "Because it wasn't peeling well!",
  },
  {
    id: "food-002",
    category: "food",
    setup: "What do you call cheese that isn't yours?",
    punchline: "Nacho cheese!",
  },
  {
    id: "food-003",
    category: "food",
    setup: "Why did the cookie go to the hospital?",
    punchline: "Because it was feeling crummy!",
  },
  {
    id: "food-004",
    category: "food",
    setup: "What do you call a sad strawberry?",
    punchline: "A blueberry!",
  },
  {
    id: "food-005",
    category: "food",
    setup: "What does a lemon say when it answers the phone?",
    punchline: "Yellow!",
  },
  {
    id: "food-006",
    category: "food",
    setup: "Why did the tomato turn red?",
    punchline: "Because it saw the salad dressing!",
  },
  {
    id: "food-007",
    category: "food",
    setup: "What do you call a peanut in a spacesuit?",
    punchline: "An astronut!",
  },
  {
    id: "food-008",
    category: "food",
    setup: "Why don't eggs tell jokes?",
    punchline: "They'd crack each other up!",
  },
  {
    id: "food-009",
    category: "food",
    setup: "What did the grape say when it got stepped on?",
    punchline: "Nothing, it just let out a little wine!",
  },
  {
    id: "food-010",
    category: "food",
    setup: "Why did the bread break up with the margarine?",
    punchline: "For a butter lover!",
  },
];

/**
 * Get a random joke from the curated list
 */
export function getRandomJoke(category: JokeCategory = "all"): Joke {
  const jokes = category === "all"
    ? CURATED_JOKES
    : CURATED_JOKES.filter((j) => j.category === category);

  const randomIndex = Math.floor(Math.random() * jokes.length);
  return jokes[randomIndex];
}

/**
 * Get all jokes for a category
 */
export function getJokesByCategory(category: JokeCategory): Joke[] {
  if (category === "all") return CURATED_JOKES;
  return CURATED_JOKES.filter((j) => j.category === category);
}
