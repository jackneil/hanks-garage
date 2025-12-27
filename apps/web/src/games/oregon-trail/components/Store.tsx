"use client";
import { useOregonTrailStore } from "../lib/store";
import { STORE_PRICES, LANDMARKS } from "../lib/constants";

export function Store() {
  const { supplies, currentLandmarkIndex, buySupply, leaveStore } = useOregonTrailStore();
  const lm = LANDMARKS[currentLandmarkIndex];
  const items = [
    { id: "oxen", name: "Oxen", price: STORE_PRICES.oxen, unit: 1 },
    { id: "food", name: "Food (lbs)", price: STORE_PRICES.food, unit: 50 },
    { id: "clothing", name: "Clothing", price: STORE_PRICES.clothing, unit: 1 },
    { id: "ammunition", name: "Ammo (boxes)", price: STORE_PRICES.ammunition, unit: 20 },
    { id: "wheel", name: "Spare Wheel", price: STORE_PRICES.wheel, unit: 1 },
    { id: "axle", name: "Spare Axle", price: STORE_PRICES.axle, unit: 1 },
    { id: "tongue", name: "Spare Tongue", price: STORE_PRICES.tongue, unit: 1 },
  ];
  return (
    <div className="min-h-screen bg-amber-800 text-amber-100 p-4">
      <h2 className="text-3xl mb-2 text-center">General Store at {lm?.name || "Independence"}</h2>
      <p className="text-xl text-center mb-4">Money: ${supplies.money.toFixed(2)}</p>
      <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
        {items.map(item => (<div key={item.id} className="bg-amber-700 p-4 rounded"><h3>{item.name}</h3><button onClick={() => buySupply(item.id, item.unit)} className="btn btn-sm btn-primary">Buy</button></div>))}
      </div>
      <div className="text-center mt-6">
        <button onClick={leaveStore} className="btn btn-primary btn-lg">Leave Store</button>
      </div>
    </div>
  );
}
