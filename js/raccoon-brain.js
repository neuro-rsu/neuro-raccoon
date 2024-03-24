import {NeuralNetwork} from './neuro-net.js';
import {settings} from './settings.js';

var pdb = new PouchDB('raccoon');

export let bestRaccoonBrain; // = new NeuralNetwork(settings.currentTopology);

//await createBestRaccoonBrain();

export async function createBestRaccoonBrain() {
    bestRaccoonBrain = new NeuralNetwork(settings.topology);
    bestRaccoonBrain.cost = -Infinity;

    // await pdb.get(settings.topology.join('-')).then(function (bestRaccoonBrainDB) {
    //     bestRaccoonBrain.sections.forEach((item, index) => item.weights = bestRaccoonBrainDB.sections[index].weights);
    //     bestRaccoonBrain.cost = bestRaccoonBrainDB.cost;
    //     // console.log(bestRaccoonBrainDB);
    // }).catch(function (err) {
    //     // console.log(err);
    //     bestRaccoonBrain._id = settings.topology.join('-');
    //     return pdb.put(bestRaccoonBrain);
    // }).catch( err => {
    //     console.log(`Can't add bestRaccoonBrain ${err}`);
    // });
}

export async function clearBestRaccoonBrain() {
    bestRaccoonBrain = new NeuralNetwork(settings.topology);
    bestRaccoonBrain.cost = -Infinity;

    await pdb.get(settings.topology.join('-')).then(function (bestRaccoonBrainDB) {
        bestRaccoonBrain._id = bestRaccoonBrainDB._id;
        bestRaccoonBrain._rev = bestRaccoonBrainDB._rev;
        return pdb.put(bestRaccoonBrain);
        // console.log(bestRaccoonBrainDB);
    }).catch( err => {
        console.log(`Can't clear bestRaccoonBrain ${err}`);
    });
}

// export function addBestRaccoonBrain() {
//     pdb.put(bestRaccoonBrain, function callback(err, result) {
//         if (!err) {
//             console.log('Successfully posted a todo!');
//         }
//     });
// }

export async function addBestRaccoonBrain() {
    await pdb.put(bestRaccoonBrain).then( bestRaccoonBrainDB => {
        bestRaccoonBrain._rev = bestRaccoonBrainDB._rev;
        console.log('Successfully add bestRaccoonBrain!');
    }).catch( err => {
        console.log(`Can't add bestRaccoonBrain ${err}`);
    });
}
// bestRaccoonBrain.cost = -Infinity;

export async function changeBestRaccoonBrain(raccoonBrain) {
    if (raccoonBrain.cost > bestRaccoonBrain.cost) {
        bestRaccoonBrain = raccoonBrain.clone(raccoonBrain);
        bestRaccoonBrain.cost = raccoonBrain.cost;
        await saveBestRaccoonBrain();
    }
}

async function saveBestRaccoonBrain() {
    await pdb.get(settings.topology.join('-')).then(function (bestRaccoonBrainDB) {
        bestRaccoonBrain._id = bestRaccoonBrainDB._id;
        bestRaccoonBrain._rev = bestRaccoonBrainDB._rev;
        return pdb.put(bestRaccoonBrain);
        //else if return pdb.put(cloud);
    }).catch( (err) => {
        console.log(`Can't save bestRaccoonBrain ${err}`);
    });
}

export async function compactDb() {
    pdb.compact();
}

export async function deleteDb() {
    pdb.destroy().then(function () {
        alert("База данных удалена");
    }).catch(function (err) {
        alert(err);
    })
}

export async function clearDb() {
    pdb.destroy().then( () => "База данных удалена")
    .catch(err => err)
}