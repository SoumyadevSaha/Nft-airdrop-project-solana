const {
    Connection,
    PublicKey,
    clusterApiUrl,
    Keypair,
    LAMPORTS_PER_SOL,
} = require('@solana/web3.js');

// Keypair module allows us to create a new wallet.
const wallet = new Keypair(); // this is the wallet where we are going to air-dropping all our solana into.
// each wallet has a public key and a private key.

// extracting the public & private(secret) key from the wallet.
const public_key = wallet._keypair.publicKey;
// const secret_key = wallet._keypair.secretKey; // Do not disclose this one.

// console.log(public_key);
// console.log(secret_key);

// We would like to wrap the public key into a PublicKey object.
const public_key_object = new PublicKey(public_key);

// let's create a function that prints out the balance in the wallet.
const getWalleBalance = async() => {
    try {
        const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
        // Apart from the main network, called 'main-net', there are other networks in solana like 'test-net' and 'dev-net'.
        // devnet is a replica of solana's mainnet.
        // we can use the clusterApiUrl() function to get the url of the network we want to connect to.
        const walletBalance = await connection.getBalance(public_key_object);
        console.log(`Wallet balance is : ${walletBalance} lamports`);
        console.log(`Which is : ${walletBalance / LAMPORTS_PER_SOL} SOL`);
    } catch(err) {
        console.log(`Error while getting balance -> ${err}`);
    }
}

// 1 SOL = 1,000,000,000 lamports

const airDropSOL = async() => {
    try {
        // again we need to create a connection object.
        const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
        const fromAirDropSignature = await connection.requestAirdrop(public_key_object, 2 * LAMPORTS_PER_SOL); // sending 2 SOLs
        // confirming the transaction ->
        await connection.confirmTransaction(fromAirDropSignature);
    } catch(err) {
        console.log(`Error while Air-Dropping -> ${err}`);
    }
}

const main = async() => {
    await getWalleBalance();
    await airDropSOL();
    await getWalleBalance();
    await airDropSOL();
    await getWalleBalance();
}

main();