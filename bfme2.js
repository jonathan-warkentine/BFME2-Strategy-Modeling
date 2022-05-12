const buildTime = 15;
const resourceInt = 6;
const startingBuilders = 2;
const resourceGenPwr = 25;
const buildCost = 300;
const startingResources = 1000;
const resourceGoal = 2000;
const startingResourceBuildings = 1; //fortress...
const buildDelay = 8; //delay between building

class Simulation {
    constructor(buildCap, logDetails){
        this.buildCap = buildCap+1; // adding 1 to account for the starting fortress
        this.logDetails = logDetails;
        this.time = 0;
        this.builds = [new Build(this.time, 1, "", true)];
        this.resources = startingResources;

        this.workers = [];
        for (let i=0; i<startingBuilders; i++) {
            this.workers.push(new Worker());
        };
    }

    init (){
        while (this.resources < resourceGoal) {
            this.checkBuildings(this.builds);
            this.distResources();

            if (this.buildPossible()){
                this.buildAdditional();
            }
            
            this.logDetails? console.log('Time: ', this.time, 'Resources: ', this.resources): null;
            this.time++;
        }

        this.logDetails? console.dir(this.builds): null;
        console.log('Total time: ', this.time, 'seconds; ', 'Total builds: ', this.builds.length-1, 'capped at ', this.buildCap-1);
    }

    distResources(){
        this.builds.forEach(build => {
            if (build.finishedBuilding){ // if building is finished, check resource dist status
                if ((this.time - build.timeLastResourceDist) >= resourceInt){
                    build.timeLastResourceDist = this.time;
                    this.resources += resourceGenPwr;
                    build.totalResourcesGen += resourceGenPwr;
                }
            }
        });
    }

    checkBuildings(){
        this.builds.forEach(build => {
            if (!build.finishedBuilding){ // if building is still under construction, check if complete
                if ((this.time - build.timeStarted) >= buildTime){
                    build.timeFinished = this.time;
                    build.finishedBuilding = true;
                    this.workers.find(worker => worker.id = build.assignedWorkerID).free = true;
                }
            }
        });
    }

    buildPossible(){
        return (this.workers.reduce((acc, worker) => acc || worker.free? true: false) && (this.resources >= buildCost));
    }

    stratCondMet(){
        // always build
        // return true;

        // build x then wait
        let x = this.buildCap;
        if (this.builds.length<x) return true;

        // one builder waits
        // if (this.freeWorkers > 1) return true;

        // no building
        // return false;
    }

    buildAdditional(){
        this.workers.forEach(worker => {
            if (worker.free){
                if (this.stratCondMet()){
                    this.builds.push(new Build(this.time, this.builds.length+1, worker.id));
                    worker.free = false;
                    this.resources -= buildCost;
                }
            }
        });
    }
}

class Build {
    constructor(time, num, assignedWorkerID, finished=false){
        this.buildNum = num;
        this.timeStarted = time;
        this.timeFinished;
        this.timeLastResourceDist = 0;
        this.finishedBuilding = finished;
        this.totalResourcesGen = 0;
        this.assignedWorkerID = assignedWorkerID;
    }
}

class Worker {
    constructor(){
        this.free = true;
        this.lastBuild;
        this.id = Math.floor(Math.random()*1000);
    }
}

// "Meta" Modeling
// for (let j = 0; j<25; j++){
//     const simulation = new Simulation(j, false);
//     simulation.init();
// }

// Modeling
const simulation = new Simulation(3, true);
simulation.init();