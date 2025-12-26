'use client';

import { useState } from 'react';
import { useGameStore, Truck } from '../lib/store';
import { sounds } from '../lib/sounds';

interface GarageProps {
  onClose: () => void;
}

export function Garage({ onClose }: GarageProps) {
  const [activeTab, setActiveTab] = useState<'trucks' | 'upgrades' | 'paint'>('trucks');

  const coins = useGameStore((s) => s.coins);
  const trucks = useGameStore((s) => s.trucks);
  const currentTruckId = useGameStore((s) => s.currentTruckId);
  const upgrades = useGameStore((s) => s.upgrades);
  const customization = useGameStore((s) => s.customization);
  const selectTruck = useGameStore((s) => s.selectTruck);
  const unlockTruck = useGameStore((s) => s.unlockTruck);
  const upgradeStat = useGameStore((s) => s.upgradeStat);
  const setPaintColor = useGameStore((s) => s.setPaintColor);
  const getTruckStats = useGameStore((s) => s.getTruckStats);
  const getNextUpgradeCost = useGameStore((s) => s.getNextUpgradeCost);
  const soundEnabled = useGameStore((s) => s.soundEnabled);

  const currentTruck = trucks.find((t) => t.id === currentTruckId) || trucks[0];
  const currentStats = getTruckStats(currentTruckId);
  const currentUpgrades = upgrades[currentTruckId];

  const handleUnlock = (truck: Truck) => {
    if (unlockTruck(truck.id)) {
      if (soundEnabled) sounds.playUnlock();
    }
  };

  const handleSelect = (truck: Truck) => {
    if (truck.unlocked) {
      selectTruck(truck.id);
      if (soundEnabled) sounds.playCoin();
    }
  };

  const handleUpgrade = (stat: 'engine' | 'suspension' | 'tires' | 'nos') => {
    if (upgradeStat(currentTruckId, stat)) {
      if (soundEnabled) sounds.playUpgrade();
    }
  };

  const paintColors = [
    '#e74c3c', '#c0392b', '#9b59b6', '#8e44ad',
    '#3498db', '#2980b9', '#1abc9c', '#16a085',
    '#27ae60', '#2ecc71', '#f39c12', '#e67e22',
    '#ecf0f1', '#bdc3c7', '#34495e', '#2c3e50',
  ];

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-red-600 p-4 flex justify-between items-center">
          <h2 className="text-3xl font-bold text-white flex items-center gap-2">
            🔧 GARAGE
          </h2>
          <div className="flex items-center gap-4">
            <div className="bg-black/30 px-4 py-2 rounded-full flex items-center gap-2">
              <span className="text-2xl">🪙</span>
              <span className="text-xl font-bold text-yellow-400">{coins.toLocaleString()}</span>
            </div>
            <button
              onClick={onClose}
              className="bg-black/30 hover:bg-black/50 w-10 h-10 rounded-full text-white text-xl transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-900">
          {(['trucks', 'upgrades', 'paint'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-lg font-bold transition-colors ${
                activeTab === tab
                  ? 'bg-gray-800 text-white border-b-2 border-orange-500'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab === 'trucks' && '🚛 Trucks'}
              {tab === 'upgrades' && '⬆️ Upgrades'}
              {tab === 'paint' && '🎨 Paint'}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Trucks Tab */}
          {activeTab === 'trucks' && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {trucks.map((truck) => (
                <div
                  key={truck.id}
                  onClick={() => truck.unlocked ? handleSelect(truck) : undefined}
                  className={`
                    relative p-4 rounded-xl cursor-pointer transition-all
                    ${truck.id === currentTruckId
                      ? 'bg-orange-600 ring-4 ring-orange-400'
                      : truck.unlocked
                      ? 'bg-gray-700 hover:bg-gray-600'
                      : 'bg-gray-800 opacity-75'
                    }
                  `}
                >
                  {/* Lock overlay */}
                  {!truck.unlocked && (
                    <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-4xl mb-2">🔒</div>
                        <div className="text-yellow-400 font-bold">
                          🪙 {truck.cost.toLocaleString()}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUnlock(truck);
                          }}
                          disabled={coins < truck.cost}
                          className={`mt-2 px-4 py-1 rounded-full text-sm font-bold ${
                            coins >= truck.cost
                              ? 'bg-green-600 hover:bg-green-500 text-white'
                              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          UNLOCK
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Truck preview */}
                  <div
                    className="w-full h-20 rounded-lg mb-3"
                    style={{ backgroundColor: truck.color }}
                  />
                  <h3 className="text-lg font-bold text-white">{truck.name}</h3>
                  <p className="text-sm text-gray-300">{truck.description}</p>

                  {/* Selected indicator */}
                  {truck.id === currentTruckId && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      SELECTED
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Upgrades Tab */}
          {activeTab === 'upgrades' && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white">{currentTruck.name}</h3>
                <div
                  className="w-24 h-12 mx-auto rounded-lg mt-2"
                  style={{ backgroundColor: customization[currentTruckId]?.paintColor || currentTruck.color }}
                />
              </div>

              {(['engine', 'suspension', 'tires', 'nos'] as const).map((stat) => {
                const upgrade = currentUpgrades[stat];
                const cost = getNextUpgradeCost(currentTruckId, stat);
                const statValue = currentStats[stat];
                const maxed = upgrade.level >= upgrade.maxLevel;

                return (
                  <div key={stat} className="bg-gray-700 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <span className="text-2xl mr-2">
                          {stat === 'engine' && '🔥'}
                          {stat === 'suspension' && '🔩'}
                          {stat === 'tires' && '🛞'}
                          {stat === 'nos' && '🚀'}
                        </span>
                        <span className="text-lg font-bold text-white capitalize">{stat}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-400">
                          Level {upgrade.level}/{upgrade.maxLevel}
                        </div>
                        <div className="text-lg font-bold text-green-400">
                          {(statValue * 100).toFixed(0)}%
                        </div>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="h-3 bg-gray-600 rounded-full overflow-hidden mb-3">
                      <div
                        className="h-full bg-gradient-to-r from-green-500 to-green-400 transition-all"
                        style={{ width: `${(upgrade.level / upgrade.maxLevel) * 100}%` }}
                      />
                    </div>

                    {/* Upgrade button */}
                    {maxed ? (
                      <div className="text-center text-yellow-400 font-bold">
                        ✨ MAXED OUT ✨
                      </div>
                    ) : (
                      <button
                        onClick={() => handleUpgrade(stat)}
                        disabled={coins < (cost || 0)}
                        className={`w-full py-2 rounded-lg font-bold flex items-center justify-center gap-2 ${
                          coins >= (cost || 0)
                            ? 'bg-green-600 hover:bg-green-500 text-white'
                            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        <span>UPGRADE</span>
                        <span className="text-yellow-300">🪙 {cost?.toLocaleString()}</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Paint Tab */}
          {activeTab === 'paint' && (
            <div>
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white">{currentTruck.name}</h3>
                <div
                  className="w-32 h-16 mx-auto rounded-lg mt-2 transition-colors"
                  style={{ backgroundColor: customization[currentTruckId]?.paintColor || currentTruck.color }}
                />
              </div>

              <h4 className="text-lg font-bold text-white mb-4">Choose Color</h4>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                {paintColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => {
                      setPaintColor(currentTruckId, color);
                      if (soundEnabled) sounds.playCoin();
                    }}
                    className={`
                      w-12 h-12 rounded-lg transition-all hover:scale-110
                      ${customization[currentTruckId]?.paintColor === color
                        ? 'ring-4 ring-white scale-110'
                        : ''
                      }
                    `}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-900 p-4 flex justify-center">
          <button
            onClick={onClose}
            className="bg-orange-600 hover:bg-orange-500 text-white px-8 py-3 rounded-xl font-bold text-lg transition-colors"
          >
            🎮 BACK TO GAME
          </button>
        </div>
      </div>
    </div>
  );
}
