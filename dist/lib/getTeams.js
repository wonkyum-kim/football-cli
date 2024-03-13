export default async function getTeams(id) {
    const response = await fetch(`https://www.fotmob.com/api/leagues?id=${id}`);
    const data = await response.json();
    const table = data.overview.table[0].data.table.all;
    const teams = table.map((item) => {
        return {
            name: item.name,
            id: item.id,
        };
    });
    return teams;
}
