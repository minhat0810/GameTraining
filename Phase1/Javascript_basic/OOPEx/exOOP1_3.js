class Team {
    constructor(name, wins = 0, losses = 0) {
        this.name = name;
        this.w = wins; // Wins
        this.l = losses; // Losses
         this.pf = 0; 
        this.pa = 0; 
        this.ranking = 0; 
    }

    winPercentage() {
        // Avoid division by zero
        return this.w / (this.w + this.l);
    }

    static playGame(winner, loser, pointsW, pointsL) {
        winner.w++;
        loser.l++;
        winner.pf += pointsW; 
        winner.pa += pointsL; 
        loser.pf += pointsL; 
        loser.pa += pointsW; 
    }

    

}

const cal = new Team('Cali',0,11);
const was = new Team('Washing', 6, 2);
const ucLa = new Team('UCLA',2,6);
const lsju = new Team('Leland Stanford Jr. University',5,3);
const wsu = new Team('Cali',7,1);
const ua = new Team('Cali', 4, 5);
const asu = new Team('Cali', 4, 4);
const col = new Team('Colorado', 5, 3);
const uo = new Team('Oregon', 5, 3);
const osu = new Team('Oregon State', 2, 6);
const usc = new Team('South Cali', 4, 4);
const utah = new Team('Utah', 6, 2);

const teams = [cal, was, ucLa, lsju, wsu, ua, asu, col, uo, osu, usc, utah];

function balanceTeams(teams) {
    let balanced = false;

    while (!balanced) {
        balanced = true;

        for (let i = 0; i < teams.length; i++) {
            const team1 = teams[i];
            for (let j = i + 1; j < teams.length; j++) {
                const team2 = teams[j];

                if (team1.w > team1.l && team2.w < team2.l) {
                    Team.playGame(team2, team1,0,0);
                    balanced = false;
                } else if (team1.w < team1.l && team2.w > team2.l) {
                    Team.playGame(team1, team2,0,0);
                    balanced = false;
                }
            }
        }
    }

    console.log("Balancing complete:");
    teams.forEach(team => {
        console.log(`${team.name}: Wins = ${team.w}, Losses = ${team.l}, Win Percentage = ${team.winPercentage().toFixed(2)}`);
    });
}

// Run the balance function
balanceTeams(teams);


Team.playGame(cal, was, 3, 2);

console.log(cal);     
console.log(was);



















// if (cal.w != cal.l) {
//     Team.playGame(was, cal); // Washing wins, Cali loses
// }

// while (was.w != was.l) {
//     Team.playGame(osu, was); // Cali wins, Washing loses
// }

// // while (ucLa.w != ucLa.l) {
// //     Team.playGame(osu, was); // Cali wins, Washing loses
// // }
// console.log(cal);
// console.log(was);
// console.log(ucLa);
// console.log(lsju);
// console.log(wsu);
// console.log(ua);
// console.log(asu);
// console.log(col);
// console.log(uo);
// console.log(osu);
// console.log(usc);
// console.log(utah);


// // Check win percentages
// console.log(`${cal.name} win percentage: ${cal.winPercentage().toFixed(2)}`); 
// console.log(`${was.name} win percentage: ${was.winPercentage().toFixed(2)}`); 
// console.log(`${ucLa.name} win percentage: ${ucLa.winPercentage().toFixed(2)}`); 
// console.log(`${lsju.name} win percentage: ${lsju.winPercentage().toFixed(2)}`); 
// console.log(`${wsu.name} win percentage: ${wsu.winPercentage().toFixed(2)}`); 
// console.log(`${ua.name} win percentage: ${ua.winPercentage().toFixed(2)}`); 
// console.log(`${asu.name} win percentage: ${asu.winPercentage().toFixed(2)}`); 
// console.log(`${col.name} win percentage: ${col.winPercentage().toFixed(2)}`); 
// console.log(`${uo.name} win percentage: ${uo.winPercentage().toFixed(2)}`); 
// console.log(`${osu.name} win percentage: ${osu.winPercentage().toFixed(2)}`); 
// console.log(`${usc.name} win percentage: ${usc.winPercentage().toFixed(2)}`); 
// console.log(`${utah.name} win percentage: ${utah.winPercentage().toFixed(2)}`); 