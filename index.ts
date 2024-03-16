#!/usr/bin/env node
import getTeams from './lib/getTeams.js';
import { select } from '@inquirer/prompts';
import autocomplete from 'inquirer-autocomplete-standalone';
import getMatch from './lib/getMatch.js';
import getMatchDetail from './lib/getMatchDetail.js';

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
  const { proceeding, home, homeScore, away, awayScore, matchId } = matchInfo;

  const {
    time,
    home: homeTeamGoals,
    away: awayTeamGoals,
  } = await getMatchDetail(matchId);

  console.log(proceeding ? `\n[Live] ${time}\n` : '\n[Game over]\n');
  console.log(`${home} ${homeScore} - ${awayScore} ${away}\n`);

  console.log('--- home ---\n');
  homeTeamGoals.forEach((goal) => {
    const [min, name] = goal;
    console.log(`- ${min}' ${name}`);
  });

  console.log('\n--- away ---\n');
  awayTeamGoals.forEach((goal) => {
    const [min, name] = goal;
    console.log(`- ${min}' ${name}`);
  });
  console.log('');
}

score();
