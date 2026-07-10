import { Person, LifeStage } from './PersonEngine';

/**
 * ZENITH ALPHA 0.4 - Event Engine
 * Generates life events serving as the source for Facts and Narratives.
 */

export enum EventType {
    CHILDHOOD_MEMORY = 'CHILDHOOD_MEMORY',
    MAKE_FRIEND = 'MAKE_FRIEND',
    LOSE_FRIEND = 'LOSE_FRIEND',
    FIRST_LOVE = 'FIRST_LOVE',
    JOB_OFFER = 'JOB_OFFER',
    PROMOTION = 'PROMOTION',
    MARRIAGE = 'MARRIAGE',
    CHILD_BORN = 'CHILD_BORN',
    ILLNESS = 'ILLNESS',
    BEREAVEMENT = 'BEREAVEMENT'
}

export interface Event {
    id: string;
    type: EventType;
    title: string;
    description: string;
    ageRequirement: number;
    significance: number; // 0-100 scale
}

export class EventEngine {
    private static readonly MAJOR_EVENT_THRESHOLD = 75;

    private static readonly EVENT_POOL: Omit<Event, 'id'>[] = [
        { type: EventType.CHILDHOOD_MEMORY, title: 'Early Memory', description: 'A vivid fragment of your earliest years remains etched in your mind.', ageRequirement: 0, significance: 20 },
        { type: EventType.MAKE_FRIEND, title: 'New Connection', description: 'You formed a bond with a peer over shared interests.', ageRequirement: 4, significance: 30 },
        { type: EventType.LOSE_FRIEND, title: 'Faded Bond', description: 'Distance or disagreement has led to a social connection severing.', ageRequirement: 6, significance: 40 },
        { type: EventType.FIRST_LOVE, title: 'First Love', description: 'A profound emotional discovery that redefines your perspective.', ageRequirement: 13, significance: 85 },
        { type: EventType.JOB_OFFER, title: 'Career Opportunity', description: 'A firm has extended an offer for professional employment.', ageRequirement: 16, significance: 60 },
        { type: EventType.PROMOTION, title: 'Professional Advancement', description: 'Your dedication has been rewarded with increased authority and status.', ageRequirement: 18, significance: 70 },
        { type: EventType.MARRIAGE, title: 'Union', description: 'A formal commitment to spend your life with another.', ageRequirement: 18, significance: 90 },
        { type: EventType.CHILD_BORN, title: 'New Life', description: 'The birth of a child brings new responsibility and purpose.', ageRequirement: 18, significance: 95 },
        { type: EventType.ILLNESS, title: 'Medical Crisis', description: 'Your physical wellbeing has taken a sudden and concerning turn.', ageRequirement: 0, significance: 65 },
        { type: EventType.BEREAVEMENT, title: 'Loss', description: 'The death of someone close leaves a permanent mark on your history.', ageRequirement: 0, significance: 80 }
    ];

    /**
     * Filters and returns a list of events eligible for a person's current age and stage.
     */
    public static generateAgeEvents(person: Person): Event[] {
        const eligible = this.EVENT_POOL.filter(event => {
            if (person.age < event.ageRequirement) return false;

            switch (person.lifeStage) {
                case LifeStage.INFANT:
                    return [EventType.CHILDHOOD_MEMORY].includes(event.type);
                case LifeStage.CHILD:
                    return [EventType.CHILDHOOD_MEMORY, EventType.MAKE_FRIEND, EventType.ILLNESS].includes(event.type);
                case LifeStage.TEEN:
                    return [EventType.MAKE_FRIEND, EventType.LOSE_FRIEND, EventType.FIRST_LOVE, EventType.ILLNESS].includes(event.type);
                case LifeStage.ADULT:
                    return [EventType.JOB_OFFER, EventType.PROMOTION, EventType.MARRIAGE, EventType.CHILD_BORN, EventType.ILLNESS, EventType.BEREAVEMENT].includes(event.type);
                case LifeStage.ELDER:
                    return [EventType.ILLNESS, EventType.BEREAVEMENT].includes(event.type);
                default:
                    return false;
            }
        });

        return eligible.map(e => ({ ...e, id: `evt_${Math.random().toString(36).substr(2, 9)}` }));
    }

    /**
     * Selects exactly one random event suitable for the person's life stage.
     */
    public static generateRandomEvent(person: Person): Event {
        const eligible = this.generateAgeEvents(person);
        const randomIndex = Math.floor(Math.random() * eligible.length);
        return eligible[randomIndex];
    }

    /**
     * Evaluates whether an event carries enough weight to be a major life milestone.
     */
    public static isMajorEvent(event: Event): boolean {
        return event.significance >= this.MAJOR_EVENT_THRESHOLD;
    }
}
