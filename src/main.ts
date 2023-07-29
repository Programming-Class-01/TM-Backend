export { }

interface ISystem {
    contested: string,
    occupier_faction_id: number,
    owner_faction_id: number,
    solar_system_id: number,
    victory_points: number,
    victory_points_threshold: number
}

interface IVPAverage {
    factionId: number;
    average: number;
};

async function getFacWarData(): Promise<ISystem[]> {
    const response = await fetch(`https://esi.evetech.net/latest/fw/systems/?datasource=tranquility`);
    const results: ISystem[] = await response.json();
    return results;
}

function averages(results: ISystem[]): number {
    let accumulatorTotal = 0
    for (const score of results) {
        accumulatorTotal += score.victory_points
    }
    const average = accumulatorTotal / results.length
    return average;
}

function occupier(results: ISystem[]): IVPAverage[] {
    // we need to count the number of systems each faction controls and store that value
    // we need to add up the number of victory points for each faction
    // calculate average for each empire from there.
    let factionIds = new Set<number>();
    let factionAverages = [];
    
    for (const result of results) {
        // ask about doing this without a set
        factionIds.add(result.occupier_faction_id)
    }

    for (const factionId of factionIds) {

        let victoryPoints = 0
        let systemCount = 0
        for (const result of results) {
            if (factionId == result.occupier_faction_id) {
                victoryPoints += result.victory_points
                systemCount++
            }
        }

        const average = victoryPoints / systemCount
        factionAverages.push({ factionId, average })
    }
    return factionAverages
}
console.log(averages(await getFacWarData()));
console.log(occupier(await getFacWarData()));