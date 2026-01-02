import { Plugin } from "obsidian";

const BRACKETS_REGEX = /\[+|\]+/g;
const DATE_REGEX = /\[\[\d{4}-\d{2}-\d{2}\]\]/g;
const OVERDUE_REGEX = /\[\[Overdue\]\]/i;
const TODO_REGEX = /- \[ \]/;

export default class Overdue extends Plugin {
    interval: number;

    async markOverdue() {
        console.debug("Searching for overdue items");
        // Compare against the start of the day in the local timezone
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        for (const file of this.app.vault.getMarkdownFiles()) {
            // Check if the note itself is dated
            const fileDate = new Date(`${file.basename}T00:00`);
            // Invalid dates always evaluate to false in comparisons so there's no need to check
            // validity here.
            const isPastDailyNote = fileDate < now;

            let hasChange = false;
            const newLines = [];
            const content = await this.app.vault.cachedRead(file);
            // Check all lines in the note
            for (let line of content.split("\n")) {
                // Only consider lines that are todo-like and not already marked overdue
                if (line.match(TODO_REGEX) && !line.match(OVERDUE_REGEX)) {
                    if (isPastDailyNote) {
                        // Mark all todo-like lines as overdue in a note that is overdue
                        line = `${line} [[Overdue]]`;
                        hasChange = true;
                    } else {
                        // Check all dates in a line
                        for (const dateLink of line.match(DATE_REGEX) || []) {
                            const dateString = dateLink.replace(BRACKETS_REGEX, "");
                            const lineDate = new Date(`${dateString}T00:00`);
                            if (lineDate < now) {
                                // Mark the todo-like line as overdue if it has a date in the past
                                line = `${line} [[Overdue]]`;
                                hasChange = true;
                                break;
                            }
                        }
                    }
                }
                newLines.push(line);
            }
            if (hasChange) {
                console.debug(`Marking overdue item(s) in ${file.path}`);
                await this.app.vault.modify(file, newLines.join("\n"));
            }
        }
        console.debug("Finished marking overdue items");
    }

    async onload() {
        // Add a command to mark overdue items
        this.addCommand({
            id: "overdue-mark",
            name: "Mark overdue items", // eslint-disable-line obsidianmd/commands/no-plugin-name-in-command-name
            callback: async () => {
                await this.markOverdue();
            },
        });

        // Add an interval that marks overdue items during the local midnight hour.
        // The function is idempotent so it can run safely multiple times in the hour.
        this.interval = window.setInterval(() => {
            const now = new Date();
            // Run right after midnight.
            if (now.getHours() == 0) {
                this.markOverdue().catch(console.error);
            }
        }, 20 * 60 * 1000);
        this.registerInterval(this.interval);
    }

    onunload() {
        window.clearInterval(this.interval);
    }
}
