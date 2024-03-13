#!/usr/bin/env node
import getTeams from './lib/getTeams.js';
import { select } from '@inquirer/prompts';
import autocomplete from 'inquirer-autocomplete-standalone';
import getMatch from './lib/getMatch.js';
async function score() {
    const leagueId = await select({
        message: 'Select a League: ',
        choices: [
            {
                name: 'Premier League',
                value: 47,
            },
            {
                name: 'La Liga',
                value: 87,
            },
            {
                name: 'Bundesliga',
                value: 54,
            },
            {
                name: 'Serie A',
                value: 55,
            },
            {
                name: 'Ligue 1',
                value: 53,
            },
        ],
    });
    const teams = await getTeams(leagueId);
    const selectedTeam = await autocomplete({
        message: 'Select a team: ',
        source: async (input) => {
            const filteredTeams = teams.filter((team) => {
                return team.name
                    .toLowerCase()
                    .includes(input ? input.toLowerCase() : '');
            });
            return filteredTeams.map((team) => {
                return {
                    value: team,
                    name: team.name,
                };
            });
        },
    });
    const matchInfo = await getMatch(leagueId, selectedTeam.id);
    if (!matchInfo) {
        console.log('No results...');
        return;
    }
    const { proceeding, home, homeScore, away, awayScore } = matchInfo;
    console.log(proceeding ? '[Live]' : '[Game over]');
    console.log(`${home} ${homeScore} - ${awayScore} ${away}`);
}
score();
