// Oregon Trail - Random Events
import type { GameEvent } from '../types';

export const POSITIVE_EVENTS: GameEvent[] = [
{ id: 'find-food', title: 'Found Wild Berries!', message: 'Your party found delicious wild berries along the trail! Yummy!', category: 'positive', probability: 0.08, effect: { food: 25 } },
{ id: 'helpful-stranger', title: 'Friendly Traveler!', message: 'A kind stranger gave your party some supplies. How nice!', category: 'positive', probability: 0.05, effect: { food: 15, money: 10 } },
{ id: 'find-supplies', title: 'Abandoned Wagon!', message: 'You found an abandoned wagon with some useful supplies!', category: 'positive', probability: 0.04, effect: { food: 30, ammunition: 10, clothing: 1 } },
{ id: 'good-hunting', title: 'Animal Spotted!', message: 'The hunting was especially good today!', category: 'positive', probability: 0.06, effect: { food: 40 } },
];

export const NEGATIVE_EVENTS: GameEvent[] = [
{ id: 'bad-water', title: 'Yucky Water!', message: 'Uh oh! The water here tastes funny. Better boil it next time!', category: 'negative', probability: 0.06, effect: { memberSick: true } },
{ id: 'lost-trail', title: 'Lost Trail!', message: 'Oops! You got a bit lost. It took a while to find the trail again.', category: 'negative', probability: 0.05, effect: { daysLost: 2 } },
{ id: 'thief', title: 'Sneaky Thief!', message: 'A sneaky thief took some of your supplies while you slept!', category: 'negative', probability: 0.03, effect: { food: -20, money: -15 } },
{ id: 'ox-sick', title: 'Sick Ox!', message: 'One of your oxen is not feeling well. Time to rest.', category: 'negative', probability: 0.04, effect: { daysLost: 1, oxen: -1 } },
{ id: 'rough-trail', title: 'Bumpy Road!', message: 'The trail was very rough today. Everyone is tired!', category: 'negative', probability: 0.08, effect: { partyHealth: 'fair' } },
];

export const SEVERE_EVENTS: GameEvent[] = [
{ id: 'broken-wheel', title: 'Broken Wheel!', message: 'Oh no! A wagon wheel broke! You need to fix it.', category: 'severe', probability: 0.03, effect: { wheels: -1, daysLost: 1 } },
{ id: 'broken-axle', title: 'Broken Axle!', message: 'Yikes! The wagon axle cracked! Time for repairs.', category: 'severe', probability: 0.02, effect: { axles: -1, daysLost: 2 } },
{ id: 'fire', title: 'Campfire Accident!', message: 'The campfire got out of control! Some supplies were damaged.', category: 'severe', probability: 0.02, effect: { food: -50, clothing: -1 } },
];

export const NEUTRAL_EVENTS: GameEvent[] = [
{ id: 'meet-travelers', title: 'Fellow Travelers!', message: 'You met another wagon train. They shared some trail tips!', category: 'neutral', probability: 0.10, effect: {} },
{ id: 'beautiful-view', title: 'Beautiful View!', message: 'Everyone stopped to admire the beautiful scenery!', category: 'neutral', probability: 0.08, effect: {} },
];

export const ALL_EVENTS = [...POSITIVE_EVENTS, ...NEGATIVE_EVENTS, ...SEVERE_EVENTS, ...NEUTRAL_EVENTS];

export function getRandomEvent(): GameEvent | null {
  const roll = Math.random();
  let cumProb = 0;
  for (const event of ALL_EVENTS) {
    cumProb += event.probability;
    if (roll < cumProb) return event;
  }
  return null;
}
