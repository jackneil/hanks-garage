"use client";
import { useState, useEffect, useCallback } from "react";
import { useOregonTrailStore } from "../lib/store";
import { ANIMALS, MAX_CARRY_WEIGHT, HUNTING_TIME } from "../lib/constants";

export function Hunting() {
  const { supplies, hunt } = useOregonTrailStore();
  const [food, setFood] = useState(0);
  const [ammo, setAmmo] = useState(0);
  const [time, setTime] = useState(HUNTING_TIME);
  const [animals, setAnimals] = useState<{id:number;type:string;x:number;y:number;hit:boolean}[]>([]);

  useEffect(() => {
    const t = setInterval(() => setTime(p => Math.max(0, p - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (time <= 0) return;
    const spawn = setInterval(() => {
      const a = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
      if (Math.random() < a.spawnChance) setAnimals(p => [...p, {id: Date.now(), type: a.type, x: Math.random()*80+10, y: Math.random()*60+20, hit: false}]);
    }, 1000);
    return () => clearInterval(spawn);
  }, [time]);

  const shoot = useCallback((id: number) => {
    if (supplies.ammunition - ammo <= 0) return;
    setAmmo(p => p + 1);
    const target = animals.find(a => a.id === id);
    if (target && !target.hit) {
      const animal = ANIMALS.find(a => a.type === target.type);
      if (animal && food < MAX_CARRY_WEIGHT) {
        setFood(p => Math.min(MAX_CARRY_WEIGHT, p + animal.meat));
        setAnimals(p => p.map(a => a.id === id ? {...a, hit: true} : a));
      }
    }
  }, [animals, ammo, food, supplies.ammunition]);

  if (time <= 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-900">
        <div className="bg-green-700 p-8 rounded text-white text-center">
          <h2 className="text-3xl mb-4">Hunt Over!</h2>
          <p className="text-xl mb-2">Food gathered: {food} lbs</p>
          <p className="mb-4">Ammo used: {ammo}</p>
          <button onClick={() => hunt(food, ammo)} className="btn btn-primary btn-lg">Take Food</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-900 relative">
      <div className="absolute top-4 left-4 text-white">
        <p>Time: {time}s | Food: {food} lbs | Ammo: {supplies.ammunition - ammo}</p>
      </div>
      {animals.filter(a => !a.hit).map(a => (
        <button key={a.id} onClick={() => shoot(a.id)} style={{position:"absolute",left:a.x+"%",top:a.y+"%"}} className="btn btn-circle btn-lg bg-amber-600">{a.type[0].toUpperCase()}</button>
      ))}
    </div>
  );
}
