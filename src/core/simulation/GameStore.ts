import { create } from 'zustand'; import { GameState, GameStateManager } from
'./GameState'; import { SimulationEngine } from './SimulationEngine'; import {
Person } from './PersonEngine'; import { NarrativeService } from
'./NarrativeService'; import { ChronicleEngine } from './ChronicleEngine';

const narrativeService = new NarrativeService(); const chronicleEngine = new
ChronicleEngine();

export interface GameStore { game: GameState | null; createNewGame: (person:
Person) => void; advanceYear: () => void; isGameOver: () => boolean;
getCurrentAge: () => number; }

export const useGameStore = create((set, get) => ({ game: null,

createNewGame: (person: Person) => { const newGame =
GameStateManager.createGame(person); set({ game: newGame }); },

advanceYear: () => { const currentState = get().game; if (!currentState ||
GameStateManager.isGameOver(currentState)) { return; }

const result = SimulationEngine.advanceOneYear(
  currentState.person,
  currentState.ledger,
  narrativeService,
  chronicleEngine
);

const updatedGame = GameStateManager.updateAfterSimulation(currentState, result);

set({ game: updatedGame });

},

isGameOver: () => { const currentState = get().game; if (!currentState) return
true; return GameStateManager.isGameOver(currentState); },

getCurrentAge: () => { const currentState = get().game; if (!currentState)
return 0; return GameStateManager.getAge(currentState); }, }));
