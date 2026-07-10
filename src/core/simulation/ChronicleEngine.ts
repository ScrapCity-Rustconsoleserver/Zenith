import { Fact } from './FactLedger';
import { NarrativePacket } from './NarrativeService';

/**
 * ZENITH ALPHA 0.8 - Chronicle Engine
 * Transforms NarrativePackets into a structured, searchable life timeline.
 * Serves as the primary data source for the player's personal history and obituary.
 */

export interface ChronicleEntry {
    id: string;
    year: number;
    factId: string;
    title: string;
    summary: string;
    significance: number;
    major: boolean;
}

export class ChronicleEngine {
    private static readonly MAJOR_THRESHOLD = 75;

    /**
     * Instantiates a timeline entry from a NarrativePacket.
     * Determines major status based on significance.
     */
    public createEntry(year: number, packet: NarrativePacket): ChronicleEntry {
        return {
            id: `entry_${Math.random().toString(36).substr(2, 9)}`,
            year: year,
            factId: packet.factId,
            title: packet.title,
            summary: packet.summary,
            significance: packet.significance,
            major: packet.significance >= ChronicleEngine.MAJOR_THRESHOLD
        };
    }

    /**
     * Constructs a complete chronicle by aligning historical Facts with NarrativePackets.
     * Entries are sorted chronologically from oldest to newest.
     */
    public buildChronicle(facts: Fact[], packets: NarrativePacket[]): ChronicleEntry[] {
        const chronicle: ChronicleEntry[] = [];
        
        // Create a map for O(1) lookup of packets by factId
        const packetMap = new Map<string, NarrativePacket>();
        packets.forEach(p => packetMap.set(p.factId, p));

        facts.forEach(fact => {
            const packet = packetMap.get(fact.id);
            if (packet) {
                chronicle.push(this.createEntry(fact.year, packet));
            }
        });

        return chronicle.sort((a, b) => a.year - b.year);
    }

    /**
     * Retrieves all entries recorded for a specific simulation year.
     */
    public getEntriesByYear(entries: ChronicleEntry[], year: number): ChronicleEntry[] {
        return entries.filter(entry => entry.year === year);
    }

    /**
     * Filters the timeline to return only high-significance turning points.
     */
    public getMajorEntries(entries: ChronicleEntry[]): ChronicleEntry[] {
        return entries.filter(entry => entry.major);
    }

    /**
     * Retrieves the most recently recorded entry in the timeline.
     */
    public getLatestEntry(entries: ChronicleEntry[]): ChronicleEntry | null {
        if (entries.length === 0) return null;
        return entries.reduce((latest, current) => (current.year >= latest.year ? current : latest));
    }

    /**
     * Generates a readable, formatted string representing the life story.
     * Uses year-based headers to denote the passage of time and key events.
     */
    public generateLifeChronicle(entries: ChronicleEntry[]): string {
        if (entries.length === 0) return "A ledger yet to be written.";

        const sorted = [...entries].sort((a, b) => a.year - b.year);
        const birthYear = sorted[0].year;

        return sorted
            .map(entry => {
                const age = entry.year - birthYear;
                return `Age ${age} - ${entry.title}.`;
            })
            .join('\n');
    }
}
