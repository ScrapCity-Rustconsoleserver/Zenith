import { Person } from './PersonEngine';
import { FactLedger } from './FactLedger';
import { ChronicleEntry } from './ChronicleEngine';
import { SimulationResult } from './SimulationEngine';

/**
 * ZENITH ALPHA 1.0 - Game State
 * The central container for an active life simulation.
 * Manages the persistence and status of the current entity and their historical record.
 */

export enum GameStatus {
    ACTIVE = 'ACTIVE',
    DECEASED = 'DECEASED'
}

export interface GameState {
    person: Person;
    ledger: FactLedger;
    chronicle: ChronicleEntry[];
    currentYear: number;
    status: GameStatus;
}

export class GameStateManager {
    /**
     * Initializes a fresh game state for a new life.
     * Sets the timeline to year zero and status to active.
     */
    public static createGame(person: Person): GameState {
        return {
            person,
            ledger: new FactLedger(),
            chronicle: [],
            currentYear: 0,
            status: GameStatus.ACTIVE
        };
    }

    /**
     * Synchronizes the game state with the results of a simulation tick.
     * Updates the person's biological data, the chronicle, and current year.
     * Transitions status to DECEASED if mortality conditions are met.
     */
    public static updateAfterSimulation(state: GameState, result: SimulationResult): GameState {
        const updatedState = { ...state };

        updatedState.person = result.person;
        
        if (result.chronicleEntry) {
            updatedState.chronicle.push(result.chronicleEntry);
        }

        updatedState.currentYear += 1;

        if (!result.person.alive) {
            updatedState.status = GameStatus.DECEASED;
        }

        return updatedState;
    }

    /**
     * Evaluates if the current life has concluded.
     */
    public static isGameOver(state: GameState): boolean {
        return state.status === GameStatus.DECEASED;
    }

    /**
     * Retrieves the current chronological age of the simulated entity.
     */
    public static getAge(state: GameState): number {
        return state.person.age;
    }
}
