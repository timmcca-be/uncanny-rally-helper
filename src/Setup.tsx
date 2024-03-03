import React from "react";

import styles from "./Setup.module.css";
import sharedStyles from "./shared.module.css";

const drives = [
    "Make a human laugh with a joke.",
    "Acquire and smoke a cigarette with a human.",
    "Drive a big vehicle.",
    "Learn an animal fact.",
    "Get two humans to make friends with each other.",
    "Earn a tip or a compliment from a human.",
    "Get a human to tell you something secret.",
    "Get two humans to argue.",
    "Get a human to do part of your job for you.",
    "Win a contest against a human.",
    "Charm a human with a musical performance.",
    "Convince a human you’re a millionaire.",
    "Create a work of transgressive art.",
    "Steal a dessert or treat.",
    "Have a picnic.",
    "Play a prank on a human.",
];
const glitches = [
    "CANNOT ask somebody else’s opinion.",
    "CANNOT describe another person in a positive way.",
    "CANNOT ask “why” questions.",
    "CANNOT talk about the past.",
    "CANNOT refer to physical sensations.",
    "CANNOT talk about the future.",
    "CANNOT use “I” or “Me”.",
    "CANNOT give a straight Yes or No, or their synonyms.",
    "CANNOT talk negatively about anybody.",
    "CANNOT refer to your own body.",
    "CANNOT refer to pain or death.",
    "CANNOT use non-verbal sounds for communication.",
    "CANNOT ask for help with something.",
    "CANNOT say a human’s name.",
    "CANNOT verbally interrupt somebody.",
    "CANNOT refer to emotions.",
];

const maxNumPlayers = Math.min(drives.length, glitches.length);

function shuffle<T>(values: Array<T>): Array<T> {
    const shuffled = [...values];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

export function Setup(): React.ReactElement {
    const [players, setPlayers] = React.useState<
        Array<{ name: string; key: number }>
    >([{ name: "", key: 0 }]);
    const [lastAssignedKey, setLastAssignedKey] = React.useState(0);
    const [shuffledDrives, setShuffledDrives] = React.useState(shuffle(drives));
    const [shuffledGlitches, setShuffledGlitches] = React.useState(
        shuffle(glitches)
    );

    const gameDescriptor = players.map(({ name }, index) => ({
        name,
        drive: shuffledDrives[index],
        glitch: shuffledGlitches[index],
    }));

    console.log(
        btoa(unescape(encodeURIComponent(JSON.stringify(gameDescriptor))))
    );

    return (
        <main className={sharedStyles.column}>
            <ul>
                {players.map(({ name, key }, index) => (
                    <li key={key} className={styles.listItem}>
                        <label>
                            name of player {index + 1}:{" "}
                            <input
                                type="text"
                                value={name}
                                onChange={(event) => {
                                    const newPlayers = [...players];
                                    newPlayers[index] = {
                                        name: event.target.value,
                                        key,
                                    };
                                    setPlayers(newPlayers);
                                }}
                            />
                        </label>
                        <button
                            onClick={() =>
                                setPlayers(
                                    players
                                        .slice(0, index)
                                        .concat(players.slice(index + 1))
                                )
                            }
                            aria-label={`remove player ${index + 1}`}
                        >
                            ✕
                        </button>
                        <p>drive: {shuffledDrives[index]}</p>
                        <p>glitch: {shuffledGlitches[index]}</p>
                    </li>
                ))}
            </ul>
            <button
                disabled={players.length >= maxNumPlayers}
                onClick={() => {
                    const key = lastAssignedKey + 1;
                    setPlayers(players.concat({ name: "", key }));
                    setLastAssignedKey(key);
                }}
            >
                + add player
            </button>
            <button
                onClick={() => {
                    setShuffledDrives(shuffle(drives));
                    setShuffledGlitches(shuffle(glitches));
                }}
            >
                reshuffle
            </button>
            <button
                onClick={() =>
                    navigator.clipboard.writeText(
                        btoa(JSON.stringify(gameDescriptor))
                    )
                }
            >
                copy game descriptor to clipboard
            </button>
            <p>send the game descriptor to your players</p>
        </main>
    );
}
