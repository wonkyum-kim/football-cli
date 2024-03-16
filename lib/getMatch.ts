interface MatchProps {
  proceeding: boolean;
  home: string;
  away: string;
  homeScore: string;
  awayScore: string;
  matchId: string;
}

export default async function getMatch(LeagueId: number, teamId: number) {
  const response = await fetch(
    `https://www.fotmob.com/api/leagues?id=${LeagueId}`
  );
  const data = await response.json();
  const allMatches = data.matches.allMatches;
  const totalMatches = allMatches.length;

  for (let i = totalMatches - 1; i >= 0; --i) {
    const { home, away, status, id } = allMatches[i];
    if (home.id != teamId && away.id != teamId) continue;
    if (!status.started) continue;
    const [homeScore, awayScore] = status.scoreStr.split(' - ');

    const matchInformation: MatchProps = {
      proceeding: !status.finished && status.started,
      home: home.name,
      homeScore,
      away: away.name,
      awayScore,
      matchId: id,
    };

    return matchInformation;
  }
}
