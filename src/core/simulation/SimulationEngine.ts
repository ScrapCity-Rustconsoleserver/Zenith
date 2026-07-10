import { Person, PersonEngine } from './PersonEngine';
import { Event, EventEngine } from './EventEngine';
import { Fact, FactLedger } from './FactLedger';
import { NarrativePacket, NarrativeService } from './NarrativeService';
import { ChronicleEntry, ChronicleEngine } from './ChronicleEngine';

/**
 * ZENITH ALPHA 0.9 - Simulation Engine
 * Orchestrates the coordination between all core simulation pillars.
 * Responsible for the execution of the primary gameplay loop (The Year Tick).
 */

export interface SimulationResult {
    person: Person;
    event: Event | null;
    fact: Fact | null;
    narrative: NarrativePacket | null;
    chronicleEntry: ChronicleEntry | null;
}

export class SimulationEngine {
    /**
     * Advances the simulation state for a person by exactly one year.
     * Sequentially executes biological aging, event generation, factual recording,
     * narrative synthesis, and chronicle entry creation.
     */
    public static advanceOneYear(
        person: Person,
        ledger: FactLedger,
        narrativeService: NarrativeService,
        chronicleEngine: ChronicleEngine
    ): SimulationResult {
        // 1. Biological Progression
        const agedPerson = PersonEngine.ageOneYear(person);

        // If the person has died during the tick, we halt event generation
        if (!agedPerson.alive) {
            return {
                person: agedPerson,
                event: null,
                fact: null,
                narrative: null,
                chronicleEntry: null
            };
        }

        // 2. Event Generation
        const event = EventEngine.generateRandomEvent(agedPerson);

        // 3. Factual Attribution
        const fact = this.generateFactFromEvent(agedPerson, event);
        ledger.addFact(fact);

        // 4. Narrative Synthesis
        const narrative = narrativeService.generateNarrative(fact);

        // 5. Chronicle Commit
        const chronicleEntry = chronicleEngine.createEntry(fact.year, narrative);

        return {
            person: agedPerson,
            event,
            fact,
            narrative,
            chronicleEntry
        };
    }

    /**
     * Executes the simulation loop over a specified duration.
     * Returns an array of results representing the history of that period.
     */
    public static simulateYears(
        person: Person,
        years: number,
        ledger: FactLedger,
        narrativeService: NarrativeService,
        chronicleEngine: ChronicleEngine
    ): SimulationResult[] {
        const results: SimulationResult[] = [];
        let currentPerson = person;

        for (let i = 0; i < years; i++) {
            if (!currentPerson.alive) break;
            
            const result = this.advanceOneYear(
                currentPerson,
                ledger,
                narrativeService,
                chronicleEngine
            );
            
            results.push(result);
            currentPerson = result.person;
        }

        return results;
    }

    /**
     * Maps transient Event data into a permanent Fact record.
     * Establishes the ground truth for the simulation's history.
     */
    public static generateFactFromEvent(person: Person, event: Event): Fact {
        return {
            id: `fact_${Math.random().toString(36).substr(2, 9)}_${Date.now()}`,
            year: 2024 + person.age, // Current world year relative to age
            actorId: person.id,
            type: event.type,
            title: event.title,
            description: event.description,
            significance: event.significance,
            causeIds: [] // Initial facts have no preceding causes in this iteration
        };
    }
}
