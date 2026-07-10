import { Fact } from './FactLedger';

/**
 * ZENITH ALPHA 0.7 - Narrative Service
 * Transforms simulation data and historical records into human-readable stories.
 * Focuses on literary quality, reflection, and personal resonance.
 */

export enum NarrativeTone {
    NEUTRAL = 'NEUTRAL',
    POSITIVE = 'POSITIVE',
    NEGATIVE = 'NEGATIVE',
    TRAGIC = 'TRAGIC',
    HOPEFUL = 'HOPEFUL'
}

export interface NarrativePacket {
    factId: string;
    title: string;
    summary: string;
    tone: NarrativeTone;
    significance: number;
}

export class NarrativeService {
    /**
     * Creates a narrative version of a single Fact.
     * Uses significance and Fact type to construct a literary summary.
     */
    public generateNarrative(fact: Fact): NarrativePacket {
        const tone = this.determineTone(fact);
        const summary = this.synthesizeSummary(fact);

        return {
            factId: fact.id,
            title: fact.title,
            summary: summary,
            tone: tone,
            significance: fact.significance
        };
    }

    /**
     * Converts a collection of Facts into NarrativePackets.
     */
    public generateNarratives(facts: Fact[]): NarrativePacket[] {
        return facts.map(fact => this.generateNarrative(fact));
    }

    /**
     * Produces a cohesive paragraph summarising a person's life history.
     * Weaves together major facts and key turning points into a reflective memoir style.
     */
    public generateLifeSummary(facts: Fact[]): string {
        if (facts.length === 0) {
            return "A life lived in the quiet spaces between recorded history, defined by the simple rhythm of existing.";
        }

        const majorFacts = facts
            .filter(f => f.significance >= 75)
            .sort((a, b) => a.year - b.year);

        if (majorFacts.length === 0) {
            return "A journey marked by steady paths and quiet moments, avoiding the grand upheavals of fate while maintaining a consistent personal history.";
        }

        const fragments = majorFacts.map((fact, index) => {
            const isFirst = index === 0;
            const isLast = index === majorFacts.length - 1;
            const text = fact.description.toLowerCase().replace(/\.$/, '');

            if (isFirst) return `The story of your life began in earnest when ${text}`;
            if (isLast) return `finally, the journey concluded as ${text}`;
            return `it was later marked by the time when ${text}`;
        });

        const summary = fragments.join('; ') + '.';
        return summary.charAt(0).toUpperCase() + summary.slice(1);
    }

    /**
     * Maps Fact types to appropriate emotional tones.
     */
    public determineTone(fact: Fact): NarrativeTone {
        const type = fact.type.toUpperCase();

        if (type.includes('MARRIAGE') || type.includes('PROMOTION') || type.includes('SUCCESS')) {
            return NarrativeTone.POSITIVE;
        }
        if (type.includes('BORN') || type.includes('BIRTH') || type.includes('LOVE')) {
            return NarrativeTone.HOPEFUL;
        }
        if (type.includes('ILLNESS') || type.includes('FAILURE') || type.includes('CONFLICT')) {
            return NarrativeTone.NEGATIVE;
        }
        if (type.includes('BEREAVEMENT') || type.includes('DEATH') || type.includes('LOSS')) {
            return NarrativeTone.TRAGIC;
        }

        return NarrativeTone.NEUTRAL;
    }

    /**
     * Internal utility to transform raw Fact descriptions into literary summaries.
     */
    private synthesizeSummary(fact: Fact): string {
        const tone = this.determineTone(fact);
        const desc = fact.description.replace(/\.$/, '');

        // Literary templates based on tone and type
        switch (tone) {
            case NarrativeTone.HOPEFUL:
                return `In a moment of profound discovery, ${desc.toLowerCase()}, opening a new chapter of possibility.`;
            case NarrativeTone.POSITIVE:
                return `The weight of your efforts bore fruit as ${desc.toLowerCase()}, a testament to the path you chose.`;
            case NarrativeTone.TRAGIC:
                return `The world became suddenly quieter when ${desc.toLowerCase()}, leaving a space that would never truly be filled again.`;
            case NarrativeTone.NEGATIVE:
                return `Friction entered your history as ${desc.toLowerCase()}, a difficult passage that tested your resolve.`;
            default:
                return `History recorded that ${desc.toLowerCase()}, one more thread woven into the fabric of your life.`;
        }
    }
}
