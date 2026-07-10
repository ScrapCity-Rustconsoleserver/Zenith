import { Fact, FactLedger } from './FactLedger';

/**
 * ZENITH ALPHA 0.6 - Explainability Engine
 * Responsible for recursive causal tracing of historical records.
 * Powers the "Why?" functionality by traversing the Fact Ledger.
 */

export interface ExplainabilityTrace {
    factId: string;
    depth: number;
    fact: Fact;
    causes: ExplainabilityTrace[];
}

export class ExplainabilityEngine {
    private static readonly MAX_RECURSION_DEPTH = 20;

    /**
     * Recursively constructs a causal tree for a specific Fact.
     */
    public static buildTrace(
        ledger: FactLedger,
        factId: string,
        currentDepth: number = 0
    ): ExplainabilityTrace | null {
        const fact = ledger.getFact(factId);
        if (!fact || currentDepth > this.MAX_RECURSION_DEPTH) {
            return null;
        }

        const trace: ExplainabilityTrace = {
            factId: fact.id,
            depth: currentDepth,
            fact: fact,
            causes: []
        };

        for (const causeId of fact.causeIds) {
            const childTrace = this.buildTrace(ledger, causeId, currentDepth + 1);
            if (childTrace) {
                trace.causes.push(childTrace);
            }
        }

        return trace;
    }

    /**
     * Generates a flat array of Facts from the oldest known cause to the newest effect.
     * Useful for narrative breadcrumbs and "How I got here" summaries.
     */
    public static buildLinearExplanation(ledger: FactLedger, factId: string): Fact[] {
        const explanation: Fact[] = [];
        const visited = new Set<string>();

        const traverse = (id: string) => {
            if (visited.has(id)) return;
            const fact = ledger.getFact(id);
            if (!fact) return;

            visited.add(id);

            // Traverse causes first to ensure chronological ordering (Oldest -> Newest)
            for (const causeId of fact.causeIds) {
                traverse(causeId);
            }

            explanation.push(fact);
        };

        traverse(factId);
        return explanation;
    }

    /**
     * Identifies the foundational Facts at the bottom of the causal chain.
     */
    public static getRootCauses(ledger: FactLedger, factId: string): Fact[] {
        const roots: Fact[] = [];
        const visited = new Set<string>();

        const findRoots = (id: string) => {
            if (visited.has(id)) return;
            const fact = ledger.getFact(id);
            if (!fact) return;

            visited.add(id);

            if (fact.causeIds.length === 0) {
                roots.push(fact);
            } else {
                for (const causeId of fact.causeIds) {
                    findRoots(causeId);
                }
            }
        };

        findRoots(factId);
        return Array.from(new Set(roots)); // Ensure uniqueness
    }

    /**
     * Quickly determines if a Fact has any historical provenance.
     */
    public static hasCauseChain(ledger: FactLedger, factId: string): boolean {
        const fact = ledger.getFact(factId);
        return !!(fact && fact.causeIds.length > 0);
    }
}
