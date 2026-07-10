import { Z_INT, MathZ, Z_MAX } from '../math';

/**
 * ZENITH ALPHA 0.2 - Person Engine
 * Core logic for biological and psychological entity simulation.
 */

export enum Sex {
    MALE = 'MALE',
    FEMALE = 'FEMALE'
}

export enum Ambition {
    FAMILY = 'FAMILY',
    CAREER = 'CAREER',
    WEALTH = 'WEALTH',
    KNOWLEDGE = 'KNOWLEDGE',
    COMMUNITY = 'COMMUNITY'
}

export enum LifeStage {
    INFANT = 'INFANT',
    CHILD = 'CHILD',
    TEEN = 'TEEN',
    ADULT = 'ADULT',
    ELDER = 'ELDER'
}

export interface Vitality {
    energy: Z_INT;
    stress: Z_INT;
    fulfilment: Z_INT;
}

export interface Person {
    id: string;
    name: string;
    age: number;
    sex: Sex;
    vitality: Vitality;
    traits: string[];
    ambition: Ambition;
    lifeStage: LifeStage;
    alive: boolean;
}

export class PersonEngine {
    private static readonly MAX_AGE = 100;
    private static readonly FATAL_STRESS = Z_MAX;
    private static readonly FATAL_ENERGY = 0;

    private static readonly TRAIT_POOL = [
        'Ambitious', 'Kind', 'Grumpy', 'Studious', 'Rebellious', 
        'Loyal', 'Jealous', 'Impulsive', 'Cheerful', 'Stoic'
    ];

    /**
     * Creates a new newborn entity with randomized potential.
     */
    public static createPerson(name: string, sex: Sex): Person {
        const traits = this.shuffleArray([...this.TRAIT_POOL]).slice(0, 2);
        const ambitions = Object.values(Ambition);
        const ambition = ambitions[Math.floor(Math.random() * ambitions.length)];

        return {
            id: `p_${Math.random().toString(36).substr(2, 9)}`,
            name,
            age: 0,
            sex,
            vitality: {
                energy: Z_MAX,
                stress: 0,
                fulfilment: 50000 // Base 50%
            },
            traits,
            ambition,
            lifeStage: LifeStage.INFANT,
            alive: true
        };
    }

    /**
     * Determines life stage based on integer age.
     */
    public static determineLifeStage(age: number): LifeStage {
        if (age <= 2) return LifeStage.INFANT;
        if (age <= 12) return LifeStage.CHILD;
        if (age <= 19) return LifeStage.TEEN;
        if (age <= 64) return LifeStage.ADULT;
        return LifeStage.ELDER;
    }

    /**
     * Processes one year of biological and psychological drift.
     */
    public static ageOneYear(person: Person): Person {
        if (!person.alive) return person;

        const nextAge = person.age + 1;
        const nextStage = this.determineLifeStage(nextAge);

        let updatedPerson = {
            ...person,
            age: nextAge,
            lifeStage: nextStage
        };

        // Apply biological drift based on life stage
        switch (nextStage) {
            case LifeStage.INFANT:
            case LifeStage.CHILD:
                // High energy, low stress growth
                updatedPerson = this.applyVitalityChange(updatedPerson, 0, 500, 2000);
                break;
            case LifeStage.TEEN:
                // Volatile energy, rising stress
                updatedPerson = this.applyVitalityChange(updatedPerson, -2000, 2000, -1000);
                break;
            case LifeStage.ADULT:
                // Steady energy drain, rising stress
                updatedPerson = this.applyVitalityChange(updatedPerson, -3000, 4000, 0);
                break;
            case LifeStage.ELDER:
                // Sharp energy decline, stress recovery if fulfilled
                const stressRecovery = person.vitality.fulfilment > 70000 ? -5000 : 1000;
                updatedPerson = this.applyVitalityChange(updatedPerson, -8000, stressRecovery, 0);
                break;
        }

        if (this.isDead(updatedPerson)) {
            updatedPerson.alive = false;
        }

        return updatedPerson;
    }

    /**
     * Safely modifies vitality using FixedPointMath.
     */
    public static applyVitalityChange(
        person: Person, 
        energyDelta: number, 
        stressDelta: number, 
        fulfilmentDelta: number
    ): Person {
        return {
            ...person,
            vitality: {
                energy: MathZ.clamp(person.vitality.energy + energyDelta),
                stress: MathZ.clamp(person.vitality.stress + stressDelta),
                fulfilment: MathZ.clamp(person.vitality.fulfilment + fulfilmentDelta)
            }
        };
    }

    /**
     * Evaluates mortality conditions.
     */
    public static isDead(person: Person): boolean {
        if (person.age >= this.MAX_AGE) return true;
        if (person.vitality.stress >= this.FATAL_STRESS) return true;
        if (person.vitality.energy <= this.FATAL_ENERGY) return true;
        return false;
    }

    private static shuffleArray<T>(array: T[]): T[] {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
}
