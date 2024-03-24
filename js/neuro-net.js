export class NeuralNetwork
{
    constructor (topology, clone)
    {
        // Validation Checks
        if (topology.length < 2)
            throw Error("A Neural Network cannot contain less than 2 Layers.", "Topology");

        for (let i = 0; i < topology.length; i++) {
            if(topology[i] < 1)
                throw Error ("A single layer of neurons must contain, at least, one neuron.", "Topology");//new List<uint>
        }

        // Set topology
        this.theTopology = topology;//new List<uint>
        // (topology).AsReadOnly();

        // Initialize Sections
        this.sections = new Array(this.theTopology.length - 1);

        if (clone) return;// Set the Sections

        // Set the Sections
        for (let i = 0; i < this.sections.length; i++) {
            this.sections[i] = new NeuralSection(this.theTopology[i], this.theTopology[i + 1]);
        }
    }

    cost = 0;

    clone(){
        const clone = new NeuralNetwork(this.theTopology, true);
        // Set the Sections
        for (let i = 0; i < this.sections.length; i++) {
              clone.sections[i] = this.sections[i].clone();
        }
        return clone;
    }

    change(neuralNet){
        // Set the Sections
        for (let i = 0; i < this.sections.length; i++) {
            this.sections[i] = neuralNet.sections[i].clone();
            this.cost = neuralNet.cost;
        }
    }

    get topology(){
        const res = new Array(this.theTopology.length);
        // Returns the topology in the form of an array
        res.fill(0)
        // this.theTopology.CopyTo(res, 0);
        return res;
    }
    feedForward(input)
    {
        // Validation Checks
        if (input === null)
            throw Error("The input array cannot be set to null.", "input");
        else if (input.length !== this.theTopology[0])
            throw Error("The input array's length does not match the number of neurons in the input layer.", "Input");

        let output = input;
        // Feed values through all sections

        for (let i = 0; i < this.sections.length; i++) {
            output = this.sections[i].feedForward(output);
        }
        return output;
    }

    /**
    * <summary>
    * Mutate the NeuralNetwork.
    * </summary>
    * <param name="mutationProbability">The probability
    * that a weight is going to be mutated. (Ranges 0-1)</param>
    * <param name="mutationAmount">The maximum amount a mutated weight would change.
    * </param>
    */
    mutate (mutationProbability = 0.50, mutationAmount = 0.1) {
        // Mutate each section
        for (let i = 0; i < this.sections.length; i++)
        {
            this.sections[i].mutate(mutationProbability, mutationAmount);
        }
    }
}

export class NeuralSection
{
    /**
    * <summary> // throw Error("You cannot create a Neural Layer with no input neurons.", "InputCount"); // Initialize the weights array
    * Initiate a NeuralSection from a topology and a seed.// +1 for the Bias Neuron // Set random weights
    * </summary>
    * <param name="inputCount">The number of input neurons in the section.</param>
    * <param name="outputCount">The number of output neurons in the section.</param>
    * <param name="Randomize">The Ransom instance of the NeuralNetwork.</param>
    */
    constructor (inputCount=0, outputCount)
    {
        if (inputCount === 0)
            return;
        else if (outputCount === 0)
            throw Error("You cannot create a Neural Layer with no output neurons.", "outputCount");

        this.weights = new Array(inputCount + 1);

        for (let i = 0; i < this.weights.length; i++) {
            this.weights[i] = new Array(outputCount);
        }
        for (let i = 0; i < this.weights.length; i++)
            for (let j = 0; j < this.weights[i].length; j++)
                this.weights[i][j] = Math.random() - 0.5;
    }

    clone() {
        const clone = new NeuralSection();
        clone.weights = new Array(this.weights.length);

        for (let i = 0; i < this.weights.length; i++) {
            clone.weights[i] = new Array(this.weights[i].length);
        }

        for (let i = 0; i < this.weights.length; i++) {
            for (let j = 0; j < this.weights[i].length; j++) {
                    clone.weights[i][j] = this.weights[i][j];
            }
        }
        return clone;
    }

    /**
    * <summary>// Set weights
    * Feed input through the NeuralSection and get the output.
    * </summary>
    * <param name="input">The values to set the input neurons.</param>
    * <returns>The values in the output neurons after propagation.</returns> // Validation Checks // Initialize output Array // Calculate Value
    */// If is Bias Neuron // Then, the value of the neuron is equal to one // Apply Activation Function

    feedForward(input) {

        if (input === null)
            throw Error("The input array cannot be set to null.", "Input");
        else if (input.length !== this.weights.length - 1)
            throw Error("The input array's length does not match the number of neurons in the input layer.", "Input");

        let output = new Array(this.weights[0].length);
        output.fill(0);

        for (let i = 0; i < this.weights.length; i++) {
            for (let j = 0; j < this.weights[i].length; j++) {
                if (i === this.weights.length - 1)
                    output[j] += this.weights[i][j];
                else
                    output[j] += this.weights[i][j] * input[i];
            }
        }


        for (let i = 0; i < output.length; i++)
            output[i] = ReLU(output[i]);

        return output;
    }

    /**
    * <summary>
    * Mutate the NeuralSection.
    * </summary>
    * <param name="mutationProbability">The probability
    * that a weight is going to be mutated. (Ranges 0-1)</param>
    * <param name="mutationAmount">The maximum amount a Mutated Weight would change.
    * </param>
    */
    mutate (mutationProbability, mutationAmount) {
        for (let i = 0; i < this.weights.length; i++) {
            for (let j = 0; j < this.weights[i].length; j++) {
                if (Math.random() < mutationProbability)
                    this.weights[i][j] = (Math.random()) * (mutationAmount * 2) - mutationAmount;
            }
        }
    }

    /**
    * <summary>
    * Puts a double through the activation function ReLU.
    * </summary>
    * <param name="x">The value to put through the function.</param>
    * <returns>x after it is put through ReLU.</returns>
    */
}

function ReLU(x) {
    if (x >= 0)
        return x;
    else
        return x / 20;
}