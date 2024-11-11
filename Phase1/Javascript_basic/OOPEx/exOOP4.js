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

        static rank(...teams) {
        // Calculate win percentages and rank teams
        teams.forEach(team => {
            team.ranking = team.winPercentage();
        });

        // Sort teams based on win percentage (highest to lowest)
        teams.sort((a, b) => b.ranking - a.ranking);
        
        // Assign rankings based on their positions in the sorted array
        teams.forEach((team, index) => {
            team.ranking = index + 1; // Rank starts from 1
        });
    }

}

const cal = new Team('Cali', 4, 3);
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



Team.rank(...teams);

// Output rankings
console.log("\nTeams after ranking:");
teams.forEach(team => {
    console.log(`${team.name}: Rank = ${team.ranking}, Wins = ${team.w}, Losses = ${team.l}`);
});