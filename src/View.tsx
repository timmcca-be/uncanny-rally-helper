import React from "react";

import sharedStyles from "./shared.module.css";

type ParsedGameDescriptor = Array<{
    name: string;
    drive: string;
    glitch: string;
}>;

type Role = { type: "game-master" } | { type: "player"; name: string };

export function View(): React.ReactElement {
    const [gameDescriptor, setGameDescriptor] =
        React.useState<ParsedGameDescriptor | null>(null);
    const [role, setRole] = React.useState<Role | null>(null);

    if (gameDescriptor == null || role == null) {
        return (
            <ViewInput
                onComplete={(gameDescriptor, role) => {
                    setGameDescriptor(gameDescriptor);
                    setRole(role);
                }}
            />
        );
    }

    return (
        <>
            glitches:
            <ul>
                {gameDescriptor
                    .filter(
                        ({ name }) =>
                            role.type === "game-master" || role.name !== name
                    )
                    .map(({ name, glitch }) => (
                        <li key={name}>
                            {name} {glitch}
                        </li>
                    ))}
            </ul>
            drives:
            <ul>
                {gameDescriptor
                    .filter(
                        ({ name }) =>
                            role.type === "game-master" || role.name === name
                    )
                    .map(({ name, drive }) => (
                        <li key={name}>
                            {name}: {drive}
                        </li>
                    ))}
            </ul>
        </>
    );
}

function ViewInput({
    onComplete,
}: {
    onComplete: (gameDescriptor: ParsedGameDescriptor, role: Role) => void;
}): React.ReactElement {
    const [gameDescriptor, setGameDescriptor] = React.useState("");
    const [role, setRole] = React.useState<Role | null>(null);
    const onRoleChange = (roleString: string) => {
        if (roleString === "game-master") {
            setRole({ type: "game-master" });
        } else {
            setRole({
                type: "player",
                name: roleString.replace(/^player-/, ""),
            });
        }
    };

    let parsedGameDescriptor: ParsedGameDescriptor | null = null;
    try {
        const parsed: unknown = JSON.parse(
            decodeURIComponent(escape(atob(gameDescriptor)))
        );
        if (!Array.isArray(parsed)) {
            throw new Error("not array");
        }
        parsedGameDescriptor = parsed.map((player: unknown) => {
            if (player == null || typeof player !== "object") {
                throw new Error("invalid player");
            }
            const name = "name" in player && player["name"];
            const drive = "drive" in player && player["drive"];
            const glitch = "glitch" in player && player["glitch"];
            if (
                typeof name !== "string" ||
                typeof drive !== "string" ||
                typeof glitch !== "string"
            ) {
                throw new Error("invalid player");
            }

            return { name, drive, glitch };
        });
    } catch (e) {
        // do nothing
    }

    const isRoleValid =
        role != null &&
        (role.type === "game-master" ||
            parsedGameDescriptor?.findIndex(
                ({ name }) => role.name === name
            ) !== -1);

    return (
        <form className={sharedStyles.column}>
            <label>
                game descriptor (get this from your gm):{" "}
                <input
                    type="text"
                    value={gameDescriptor}
                    onChange={(event) => setGameDescriptor(event.target.value)}
                />
            </label>

            {parsedGameDescriptor == null ? (
                "invalid game descriptor"
            ) : (
                <>
                    i am:
                    <label>
                        <input
                            type="radio"
                            name="role"
                            checked={role?.type === "game-master"}
                            value="game-master"
                            onChange={(event) =>
                                onRoleChange(event.target.value)
                            }
                        />
                        the game master
                    </label>
                    {parsedGameDescriptor.map(({ name }) => (
                        <label key={name}>
                            <input
                                type="radio"
                                name="role"
                                checked={
                                    role?.type === "player" &&
                                    role.name === name
                                }
                                value={`player-${name}`}
                                onChange={(event) =>
                                    onRoleChange(event.target.value)
                                }
                            />
                            {name}
                        </label>
                    ))}
                    <button
                        disabled={!isRoleValid}
                        onClick={() => {
                            if (parsedGameDescriptor == null || role == null) {
                                throw new Error("unreachable");
                            }
                            onComplete(parsedGameDescriptor, role);
                        }}
                    >
                        view info
                    </button>
                </>
            )}
        </form>
    );
}
