interface TeamProps {
  name: string;
  id: number;
}

export default async function getTeams(id: number) {
  const response = await fetch(`https://www.fotmob.com/api/leagues?id=${id}`);
  const data = await response.json();
  const table = data.overview.table[0].data.table.all;
  const teams: TeamProps[] = table.map((item: { name: string; id: number }) => {
    return {
      name: item.name,
      id: item.id,
    };
  });
  return teams;
}
