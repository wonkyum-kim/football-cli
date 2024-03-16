export default async function getMatchDetail(matchId: string) {
  const response = await fetch(
    `https://www.fotmob.com/api/matchDetails?matchId=${matchId}`
  );

  const data = await response.json();
  const time = data.header.status?.liveTime?.short;
  const events = data.header.events;
  const homeTeamGoals = events.homeTeamGoals;
  const awayTeamGoals = events.awayTeamGoals;

  const home: [number, string][] = [];
  const away: [number, string][] = [];

  Object.keys(homeTeamGoals).forEach((name: string) => {
    homeTeamGoals[name].forEach((item: any) => {
      const overload = item?.overloadTime ?? 0;
      home.push([item.time + overload, name]);
    });
  });

  Object.keys(awayTeamGoals).forEach((name: string) => {
    awayTeamGoals[name].forEach((item: any) => {
      const overload = item?.overloadTime ?? 0;
      away.push([item.time + overload, name]);
    });
  });

  home.sort((a, b) => a[0] - b[0]);
  away.sort((a, b) => a[0] - b[0]);
  return { time, home, away };
}
