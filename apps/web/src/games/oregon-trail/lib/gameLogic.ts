// Oregon Trail - Game Logic
import type { GameState, HealthStatus, PartyMember, Supplies, PaceType, WeatherType, OccupationType, Month, EventEffect } from '../types';
import { PACES, WEATHER_CONDITIONS, LANDMARKS, TOTAL_DISTANCE, FOOD_CONSUMPTION_PER_PERSON, OCCUPATIONS } from './constants';


export function createInitialState(leaderName: string, occupation: OccupationType, partyNames: string[], month: Month) {
  const occ = OCCUPATIONS.find(o => o.id === occupation);
  const sm = occ?.startingMoney ?? 800;
  const party = partyNames.slice(0,4).map((n,i)=>({id:"m"+i,name:n||"T"+i,health:"good" as HealthStatus,isSick:false,sickDays:0,leftBehind:false}));
  return {leaderName,occupation,party,departureMonth:month,currentDay:1,milesTraveled:0,currentLandmarkIndex:0,pace:"steady" as PaceType,weather:"clear" as WeatherType,supplies:{food:0,oxen:0,clothing:0,ammunition:0,spareParts:{wheels:0,axles:0,tongues:0},money:sm},currentEvent:null,currentRiver:null,huntingFood:0,huntingAmmoUsed:0,daysRested:0,foodHunted:0,riversCrossed:0,eventsEncountered:0};
}

export function calculateDailyTravel(pace: PaceType, weather: WeatherType, oxen: number): number {
  if(oxen<=0)return 0;
  return Math.floor(PACES[pace].milesPerDay*WEATHER_CONDITIONS[weather].travelModifier*Math.min(1,oxen/2));
}

export function calculateFoodConsumption(pace: PaceType, occupation: OccupationType, aliveMembers: number): number {
  let c=FOOD_CONSUMPTION_PER_PERSON*aliveMembers*PACES[pace].foodMultiplier;
  if(occupation==="farmer")c*=0.8;
  return Math.ceil(c);
}

export function getRandomWeather(month: Month): WeatherType {
  const ch: Record<Month, Record<string, number>> = {
    march: { clear: 0.3, rain: 0.3, cold: 0.25, snow: 0.1, hot: 0, storm: 0.05 },
    april: { clear: 0.35, rain: 0.35, cold: 0.1, snow: 0.05, hot: 0.05, storm: 0.1 },
    may: { clear: 0.4, rain: 0.25, cold: 0.05, snow: 0, hot: 0.15, storm: 0.15 },
    june: { clear: 0.45, rain: 0.2, cold: 0, snow: 0, hot: 0.25, storm: 0.1 },
    july: { clear: 0.4, rain: 0.15, cold: 0, snow: 0, hot: 0.35, storm: 0.1 },
  };
  let cum = 0;
  const r = Math.random();
  for (const [t, p] of Object.entries(ch[month])) {
    cum += p;
    if (r < cum) return t as WeatherType;
  }
  return "clear";
}

export function updatePartyHealth(party: PartyMember[], pace: PaceType, weather: WeatherType, food: number, clothing: number): PartyMember[] {
  const risk=PACES[pace].healthRisk+WEATHER_CONDITIONS[weather].healthRisk;
  return party.map(m=>{if(m.leftBehind)return m;const nm={...m};if(nm.isSick){nm.sickDays++;if(nm.sickDays>=5&&Math.random()<0.5){nm.isSick=false;nm.sickDays=0;nm.health="fair" as HealthStatus;}else if(nm.sickDays>=10)nm.health="very_poor" as HealthStatus;}const r2=risk*(food>0?1:2)*(clothing>0?1:1.5);if(Math.random()<r2&&!nm.isSick){nm.isSick=true;nm.sickDays=0;nm.health="poor" as HealthStatus;}return nm;});
}

export function applyEventEffect(state: GameState, effect: EventEffect): Partial<GameState> {
  const u: Partial<GameState>={};const s={...state.supplies,spareParts:{...state.supplies.spareParts}};
  if(effect.food)s.food=Math.max(0,s.food+effect.food);if(effect.money)s.money=Math.max(0,s.money+effect.money);if(effect.oxen)s.oxen=Math.max(0,s.oxen+effect.oxen);if(effect.clothing)s.clothing=Math.max(0,s.clothing+effect.clothing);if(effect.ammunition)s.ammunition=Math.max(0,s.ammunition+effect.ammunition);
  if(effect.wheels)s.spareParts.wheels=Math.max(0,s.spareParts.wheels+effect.wheels);if(effect.axles)s.spareParts.axles=Math.max(0,s.spareParts.axles+effect.axles);if(effect.tongues)s.spareParts.tongues=Math.max(0,s.spareParts.tongues+effect.tongues);
  u.supplies=s;
  if(effect.memberSick){const h=state.party.filter(m=>!m.isSick&&!m.leftBehind);if(h.length>0){const v=h[Math.floor(Math.random()*h.length)];u.party=state.party.map(m=>m.id===v.id?{...m,isSick:true,sickDays:0,health:"poor" as HealthStatus}:m);}}
  if(effect.partyHealth)u.party=(u.party||state.party).map(m=>m.leftBehind?m:{...m,health:effect.partyHealth as HealthStatus});
  if(effect.daysLost)u.currentDay=state.currentDay+effect.daysLost;return u;}

export function checkLandmarkReached(miles: number, idx: number): number | null {const n=LANDMARKS[idx+1];return n&&miles>=n.milesFromStart?idx+1:null;}

export function checkGameOver(s: GameState): {gameOver: boolean; victory: boolean; reason?: string} {
  if(s.milesTraveled>=TOTAL_DISTANCE)return{gameOver:true,victory:true,reason:"You made it to Oregon!"};
  if(s.party.filter(m=>!m.leftBehind).length===0)return{gameOver:true,victory:false,reason:"Everyone left the party..."};
  if(s.supplies.oxen<=0)return{gameOver:true,victory:false,reason:"No oxen to pull the wagon!"};
  if(s.currentDay>200)return{gameOver:true,victory:false,reason:"Winter came!"};
  return{gameOver:false,victory:false};}

export function calculateScore(s: GameState): number {
  let sc=s.milesTraveled>=TOTAL_DISTANCE?500:0;
  sc+=s.party.filter(m=>!m.leftBehind).length*100+Math.floor(s.supplies.food/10)+s.supplies.money;
  if(s.currentDay<100)sc+=(100-s.currentDay)*2;
  return sc+s.foodHunted+s.riversCrossed*25;}

export function getRiverDepth(): number {return Math.floor(Math.random()*6)+2;}

export function attemptRiverCrossing(method: string, depth: number): {success: boolean; message: string; lostSupplies?: Partial<Supplies>} {
  const r=Math.random();
  if(method==="ford"&&depth>4){if(r<0.4)return{success:false,message:"Water too deep!",lostSupplies:{food:50}};if(r<0.6)return{success:false,message:"Ox swept away!",lostSupplies:{oxen:1}};}
  if(method==="ford")return{success:true,message:"You forded the river!"};
  if(method==="caulk"&&r<0.15)return{success:false,message:"Wagon tipped!",lostSupplies:{food:30,ammunition:10}};
  if(method==="caulk")return{success:true,message:"You floated across!"};
  if(method==="ferry")return{success:true,message:"Ferry took you across!"};
  return{success:true,message:"Crossed the river!"};}
