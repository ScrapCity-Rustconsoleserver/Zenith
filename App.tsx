import React, { useEffect } from 'react';
import { useGameStore } from './core/simulation/GameStore';
import { PersonEngine, Sex } from './core/simulation/PersonEngine';

/**
 * ZENITH ALPHA 1.2 - Primary Application Interface
 * Core entry point for the Zenith prototype. 
 * Orchestrates character initialization, simulation progression, and chronicle rendering.
 */

const App: React.FC = () => {
    const { 
        game, 
        createNewGame, 
        advanceYear, 
        isGameOver 
    } = useGameStore();

    /**
     * Automatic Character Initialization
     * On mount, if no game exists, instantiate a test character at year zero.
     */
    useEffect(() => {
        if (!game) {
            const initialPerson = PersonEngine.createPerson("Jamie", Sex.MALE);
            createNewGame(initialPerson);
        }
    }, [game, createNewGame]);

    if (!game) {
        return <div style={styles.loading}>Initializing Simulation...</div>;
    }

    const { person, chronicle, currentYear } = game;
    const latestEntry = chronicle[chronicle.length - 1];
    const gameOver = isGameOver();

    return (
        <div style={styles.container}>
            {/* Header: Vital Signs */}
            <header style={styles.header}>
                <h1 style={styles.title}>Project Zenith Alpha</h1>
                <div style={styles.vitalsGrid}>
                    <div style={styles.vitalItem}>
                        <label style={styles.label}>Identity</label>
                        <div style={styles.value}>{person.name}</div>
                    </div>
                    <div style={styles.vitalItem}>
                        <label style={styles.label}>Age</label>
                        <div style={styles.value}>{person.age}</div>
                    </div>
                    <div style={styles.vitalItem}>
                        <label style={styles.label}>Stage</label>
                        <div style={styles.value}>{person.lifeStage}</div>
                    </div>
                    <div style={styles.vitalItem}>
                        <label style={styles.label}>Year</label>
                        <div style={styles.value}>{currentYear}</div>
                    </div>
                    <div style={styles.vitalItem}>
                        <label style={styles.label}>Status</label>
                        <div style={{ ...styles.value, color: person.alive ? '#2ecc71' : '#e74c3c' }}>
                            {person.alive ? 'ALIVE' : 'DECEASED'}
                        </div>
                    </div>
                    <div style={styles.vitalItem}>
                        <label style={styles.label}>Records</label>
                        <div style={styles.value}>{chronicle.length}</div>
                    </div>
                </div>
            </header>

            {/* Action Section */}
            <section style={styles.actionSection}>
                {!gameOver ? (
                    <button style={styles.button} onClick={() => advanceYear()}>
                        Advance One Year
                    </button>
                ) : (
                    <div style={styles.deathState}>Life Complete</div>
                )}
            </section>

            {/* Narrative Focus: The Latest Entry */}
            <section style={styles.latestEntryContainer}>
                <h2 style={styles.sectionHeading}>Latest Development</h2>
                {latestEntry ? (
                    <div style={styles.entryCardLarge}>
                        <div style={styles.entryYear}>Year {latestEntry.year}</div>
                        <h3 style={styles.entryTitle}>{latestEntry.title}</h3>
                        <p style={styles.entrySummary}>{latestEntry.summary}</p>
                    </div>
                ) : (
                    <p style={styles.emptyText}>No history recorded yet.</p>
                )}
            </section>

            {/* The Chronicle: Historical Archive */}
            <section style={styles.chronicleContainer}>
                <h2 style={styles.sectionHeading}>Full Chronicle</h2>
                <div style={styles.list}>
                    {[...chronicle].reverse().map((entry) => (
                        <div key={entry.id} style={styles.entryCardSmall}>
                            <span style={styles.smallYear}>Yr {entry.year}</span>
                            <div style={styles.smallContent}>
                                <strong style={styles.smallTitle}>{entry.title}</strong>
                                <p style={styles.smallSummary}>{entry.summary}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

/**
 * PRODUCTION-READY STYLING
 * Minimalist, high-contrast interface designed for data clarity.
 */
const styles: { [key: string]: React.CSSProperties } = {
    container: {
        maxWidth: '800px',
        margin: '0 auto',
        padding: '20px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        backgroundColor: '#f9f9f9',
        minHeight: '100vh',
        color: '#2c3e50',
    },
    loading: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '1.2rem',
        fontWeight: 'bold',
    },
    header: {
        backgroundColor: '#ffffff',
        padding: '20px',
        borderRadius: '12px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        marginBottom: '20px',
    },
    title: {
        margin: '0 0 20px 0',
        fontSize: '1.5rem',
        fontWeight: 800,
        letterSpacing: '-0.5px',
        color: '#34495e',
        textAlign: 'center',
    },
    vitalsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '15px',
    },
    vitalItem: {
        textAlign: 'center',
    },
    label: {
        display: 'block',
        fontSize: '0.65rem',
        fontWeight: 700,
        textTransform: 'uppercase',
        color: '#95a5a6',
        marginBottom: '4px',
    },
    value: {
        fontSize: '0.9rem',
        fontWeight: 600,
    },
    actionSection: {
        textAlign: 'center',
        margin: '30px 0',
    },
    button: {
        padding: '12px 30px',
        fontSize: '1rem',
        fontWeight: 'bold',
        color: '#ffffff',
        backgroundColor: '#3498db',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
    },
    deathState: {
        padding: '12px 30px',
        fontSize: '1.1rem',
        fontWeight: 800,
        color: '#e74c3c',
        textTransform: 'uppercase',
        letterSpacing: '1px',
    },
    latestEntryContainer: {
        marginBottom: '40px',
    },
    sectionHeading: {
        fontSize: '1.1rem',
        fontWeight: 700,
        marginBottom: '15px',
        paddingBottom: '8px',
        borderBottom: '2px solid #eee',
    },
    entryCardLarge: {
        backgroundColor: '#ffffff',
        padding: '25px',
        borderRadius: '12px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
        borderLeft: '5px solid #3498db',
    },
    entryYear: {
        fontSize: '0.8rem',
        fontWeight: 700,
        color: '#3498db',
        marginBottom: '8px',
    },
    entryTitle: {
        margin: '0 0 10px 0',
        fontSize: '1.25rem',
    },
    entrySummary: {
        margin: 0,
        lineHeight: '1.6',
        fontSize: '1rem',
        color: '#5d6d7e',
    },
    chronicleContainer: {
        paddingBottom: '50px',
    },
    list: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    entryCardSmall: {
        display: 'flex',
        alignItems: 'flex-start',
        backgroundColor: '#fff',
        padding: '15px',
        borderRadius: '8px',
        border: '1px solid #eee',
    },
    smallYear: {
        minWidth: '50px',
        fontSize: '0.75rem',
        fontWeight: 800,
        color: '#bdc3c7',
    },
    smallContent: {
        marginLeft: '10px',
    },
    smallTitle: {
        display: 'block',
        fontSize: '0.9rem',
        marginBottom: '4px',
    },
    smallSummary: {
        margin: 0,
        fontSize: '0.85rem',
        color: '#7f8c8d',
        lineHeight: '1.4',
    },
    emptyText: {
        textAlign: 'center',
        fontStyle: 'italic',
        color: '#bdc3c7',
    }
};

export default App;
