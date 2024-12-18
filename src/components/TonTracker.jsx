import React, { useState } from "react";
import TonWeb from "tonweb";
import QRCode from "qrcode.react";

const TONTracker = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);

    // Dirección del contrato
    const contractAddress = "EQB9SktUHyZdb9y8maBaWrAtkIzJTJYq4NIilRhnMEfiXxac"; // Reemplaza con la dirección del contrato

    // Inicializar TonWeb con un RPC provider
    const tonweb = new TonWeb(
        new TonWeb.HttpProvider("https://toncenter.com/api/v2/jsonRPC", {
            apiKey: "df887db291e605e45683a7b489c64bff9c4538519cb07cb8ac72e963eca1bcbb",
        })
    );

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const contractAddressHex = new TonWeb.Address(contractAddress).toString(true, true, true);

            // Obtener transacciones del contrato
            const txList = await tonweb.provider.getTransactions(contractAddressHex);

            // Crear un objeto para almacenar la información de transacciones por usuario
            const userTransactions = {};

            txList.forEach((tx) => {
                const sender = tx.in_msg.source;
                const valueInTon = tx.in_msg.value / 1e9; // Convertir de nanoTON a TON

                // Convertir el hash al formato hexadecimal simple
                const transactionHash = Buffer.from(tx.transaction_id.hash, "base64").toString("hex");

                // Si el usuario ya tiene transacciones, agrega esta
                if (userTransactions[sender]) {
                    userTransactions[sender].totalTon += valueInTon;
                    userTransactions[sender].transactions.push({
                        hash: transactionHash,
                    });
                } else {
                    // Si es el primer registro del usuario, crea la estructura
                    userTransactions[sender] = {
                        totalTon: valueInTon,
                        transactions: [
                            {
                                hash: transactionHash
                            },
                        ],
                    };
                }
            });

            // Convertir el objeto en un arreglo para fácil renderización
            const transactionsData = Object.keys(userTransactions).map((user) => ({
                user,
                totalTon: userTransactions[user].totalTon,
                transactions: userTransactions[user].transactions,
            }));

            setTransactions(transactionsData);
        } catch (error) {
            console.error("Error al obtener transacciones:", error);
            alert("Ocurrió un error al obtener las transacciones.");
        }

        setLoading(false);
    };

    return (
        <div >
            {/* Generar QR con la dirección del contrato */}
            <div >
                <QRCode value={`ton://transfer/${contractAddress}`}/>
                <p>
                    <strong>Escanea el QR para enviar TON al contrato</strong>
                </p>
                <a 
                target="_blank"
                rel="noopener noreferrer" 
                href="https://tonscan.org/address/EQB9SktUHyZdb9y8maBaWrAtkIzJTJYq4NIilRhnMEfiXxac#events">    
                Contract
                </a>
            </div>

            <h1>TON Tracker</h1>
            <div style={{ marginBottom: "10px" }}>
                <button onClick={fetchTransactions}>
                    {loading ? "Cargando..." : "Consultar Transacciones"}
                </button>
            </div>

            <h2>Usuarios que enviaron TON</h2>
            <ul>
                {transactions.map((tx, index) => (
                    <li key={index} >
                        <p>
                            <strong>Usuario:</strong> {tx.user}
                        </p>
                        <p>
                            <strong>Cantidad total enviada:</strong> {tx.totalTon.toFixed(4)} TON
                        </p>
                        <h3>Transacciones:</h3>
                        <ul>
                            {tx.transactions.map((transaction, idx) => (
                                <li key={idx}>
                                    <p>
                                        Transacción {idx + 1}:{" "}
                                        <a
                                            href={`https://tonscan.org/tx/${transaction.hash}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            check
                                        </a>{" "}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TONTracker;
