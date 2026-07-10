import { Z_INT, MathZ } from '../math';

/**
 * ZENITH ALPHA 0.3 - Relationship Engine
 * Management of social bonds, stances, and emotional trajectories.
 */

export enum RelationshipType {
    FAMILY = 'FAMILY',
    FRIEND = 'FRIEND',
    ROMANCE = 'ROMANCE',
    SPOUSE = 'SPOUSE',
    RIVAL = 'RIVAL',
    ACQUAINTANCE = 'ACQUAINTANCE'
}

export enum RelationshipMomentum {
    RISING = 'RISING',
    STABLE = 'STABLE',
    DECLINING = 'DECLINING'
}

export interface Relationship {
    id: string;
    personAId: string;
    personBId: string;
    type: RelationshipType;
    affection: Z_INT;
    respect: Z_INT;
    trust: Z_INT;
    momentum: RelationshipMomentum;
    yearsKnown: number;
    active: boolean;
}

export class RelationshipEngine {
    private static readonly BASE_VALENCE: Z_INT = 50000;
    private static readonly CORE_THRESHOLD: Z_INT = 75000;
    private static readonly BROKEN_THRESHOLD: Z_INT = 5000;
    private static readonly RISING_THRESHOLD: Z_INT = 70000;
    private static readonly DECLINING_THRESHOLD: Z_INT = 30000;

    /**
     * Initializes a new social bond between two entities.
     */
    public static createRelationship(
        personAId: string,
        personBId: string,
        type: RelationshipType
    ): Relationship {
        return {
            id: `rel_${Math.random().toString(36).substr(2, 9)}`,
            personAId,
            personBId,
            type,
            affection: this.BASE_VALENCE,
            respect: this.BASE_VALENCE,
            trust: this.BASE_VALENCE,
            momentum: RelationshipMomentum.STABLE,
            yearsKnown: 0,
            active: true
        };
    }

    /**
     * Processes annual progression of a relationship and updates momentum.
     */
    public static ageRelationshipOneYear(rel: Relationship): Relationship {
        const nextYearsKnown = rel.yearsKnown + 1;
        let nextMomentum = RelationshipMomentum.STABLE;

        if (rel.affection >= this.RISING_THRESHOLD && rel.trust >= this.RISING_THRESHOLD) {
            nextMomentum = RelationshipMomentum.RISING;
        } else if (rel.affection <= this.DECLINING_THRESHOLD) {
            nextMomentum = RelationshipMomentum.DECLINING;
        }

        return {
            ...rel,
            yearsKnown: nextYearsKnown,
            momentum: nextMomentum
        };
    }

    /**
     * Modifies affection valence with fixed-point safety.
     */
    public static modifyAffection(rel: Relationship, delta: number): Relationship {
        return {
            ...rel,
            affection: MathZ.clamp(rel.affection + delta)
        };
    }

    /**
     * Modifies respect valence with fixed-point safety.
     */
    public static modifyRespect(rel: Relationship, delta: number): Relationship {
        return {
            ...rel,
            respect: MathZ.clamp(rel.respect + delta)
        };
    }

    /**
     * Modifies trust valence with fixed-point safety.
     */
    public static modifyTrust(rel: Relationship, delta: number): Relationship {
        return {
            ...rel,
            trust: MathZ.clamp(rel.trust + delta)
        };
    }

    /**
     * Determines if the relationship is a high-priority connection.
     */
    public static isCoreRelationship(rel: Relationship): boolean {
        return rel.affection >= this.CORE_THRESHOLD || rel.trust >= this.CORE_THRESHOLD;
    }

    /**
     * Determines if the bond has deteriorated beyond recovery.
     */
    public static isBroken(rel: Relationship): boolean {
        return rel.affection <= this.BROKEN_THRESHOLD && rel.trust <= this.BROKEN_THRESHOLD;
    }
}
