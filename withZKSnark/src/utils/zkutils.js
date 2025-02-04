import * as snarkjs from "snarkjs";

export async function generateProof(inputData) {
    const wasmFile = "/zk/EnergyTrade.wasm";
    const zkeyFile = "/zk/EnergyTrade_final.zkey";

    const { proof, publicSignals } = await snarkjs.groth16.fullProve(inputData, wasmFile, zkeyFile);

    console.log("Proof:", proof);
    console.log("Public Signals:", publicSignals);

    return { proof, publicSignals };
}

export function formatProof(proof, publicSignals) {
    return {
        a: [proof.pi_a[0], proof.pi_a[1]],
        b: [
            [proof.pi_b[0][0], proof.pi_b[0][1]],
            [proof.pi_b[1][0], proof.pi_b[1][1]]
        ],
        c: [proof.pi_c[0], proof.pi_c[1]],
        publicSignals: [publicSignals[0]]
    };
}
