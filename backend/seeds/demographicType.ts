import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("demographic-type").del();

    // Inserts seed entries
    await knex("demographic-type").insert([
        { text: "Husband Name" },
        { text: "Husband Nickname" },
        { text: "Husband Dates" },
        { text: "Husband Misc." },
        { text: "Wife Name" },
        { text: "Wife Nickname" },
        { text: "Wife Dates" },
        { text: "Wife Misc." },
        { text: "Son Name" },
        { text: "Son Nickname" },
        { text: "Son Dates" },
        { text: "Son Misc." },
        { text: "Daughter Name" },
        { text: "Daughter Nickname" },
        { text: "Daughter Dates" },
        { text: "Daughter Misc." },
    ]);
};
