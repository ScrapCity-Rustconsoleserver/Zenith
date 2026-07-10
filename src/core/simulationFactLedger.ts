/**
 * ZENITH ALPHA 0.5 - Fact Ledger
 * Central repository for permanent historical records.
 * Acts as the ground truth for narrative synthesis and causal tracing.
 */

export interface Fact {
    id: string;
    year: number;
    actorId: string;
    type: string;
    title: string;
    description: string;
    significance: number;
    causeIds: string[];
}

export class FactLedger {
    private static readonly MAJOR_THRESHOLD = 75;
    private facts: Map<string, Fact> = new Map();

    /**
     * Instantiates a new Fact object with a unique identifier.
     */
    public createFact(
        year: number,
        actorId: string,
        type: string,
        title: string,
        description: string,
        significance: number,
        causeIds: string[] = []
    ): Fact {
        return {
            id: `fact_${Math.random().toString(36).substr(2, 9)}_${Date.now()}`,
            year,
            actorId,
            type,
            title,
            description,
            significance,
            causeIds
        };
    }

    /**
     * Commits a Fact to the permanent historical record.
     */
    public addFact(fact: Fact): void {
        this.facts.set(fact.id, fact);
    }

    /**
     * Retrieves a specific Fact by its unique identifier.
     */
    public getFact(id: string): Fact | undefined {
        return this.facts.get(id);
    }

    /**
     * Retrieves all historical records associated with a specific entity.
     */
    public getFactsForPerson(actorId: string): Fact[] {
        return Array.from(this.facts.values())
            .filter(fact => fact.actorId === actorId);
    }

    /**
     * Retrieves all historical records from a specific simulation year.
     */
    public getFactsByYear(year: number): Fact[] {
        return Array.from(this.facts.values())
            .filter(fact => fact.year === year);
    }

    /**
     * Retrieves all high-intensity records that meet the major life event threshold.
     */
    public getMajorFacts(): Fact[] {
        return Array.from(this.facts.values())
            .filter(fact => fact.significance >= FactLedger.MAJOR_THRESHOLD);
    }

    /**
     * Establishes a causal link between an effect Fact and its originating cause Fact.
     * Essential for recursive explainability traces.
     */
    public linkCause(factId: string, causeId: string): void {
        const fact = this.facts.get(factId);
        if (fact && !fact.causeIds.includes(causeId)) {
            fact.causeIds.push(causeId);
        }
    }
}
