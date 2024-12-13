import React, { useState } from "react";
import TonWeb from "tonweb";

const TONTracker = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);

    // Dirección del contrato (fija en el código)
    const contractAddress = "EQB9SktUHyZdb9y8maBaWrAtkIzJTJYq4NIilRhnMEfiXxac"; // Reemplaza con la dirección del contrato

    // Inicializar TonWeb con un RPC provider
    const tonweb = new TonWeb(new TonWeb.HttpProvider("https://toncenter.com/api/v2/jsonRPC", {
        apiKey: "df887db291e605e45683a7b489c64bff9c4538519cb07cb8ac72e963eca1bcbb"
    }));

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const contractAddressHex = new TonWeb.Address(contractAddress).toString(true, true, true);

            // Obtener transacciones del contrato
            const txList = await tonweb.provider.getTransactions(contractAddressHex);

            // Crear un objeto para almacenar la cantidad total enviada por cada usuario
            const userTotals = {};

            txList.forEach(tx => {
                const sender = tx.in_msg.source;
                const valueInTon = tx.in_msg.value / 1e9; // Convertir de nanoTON a TON

                if (userTotals[sender]) {
                    userTotals[sender] += valueInTon;
                } else {
                    userTotals[sender] = valueInTon;
                }
            });

            // Convertir el objeto de totales en un arreglo de usuarios y cantidades
            const transactionsData = Object.keys(userTotals).map(user => ({
                user,
                totalTon: userTotals[user]
            }));

            setTransactions(transactionsData);
        } catch (error) {
            console.error("Error al obtener transacciones:", error);
            alert("Ocurrió un error al obtener las transacciones.");
        }

        setLoading(false);
    };

    return (
        <div style={{ padding: "20px" }}>
            <h1>TON Tracker</h1>
            <div style={{ marginBottom: "10px" }}>
                <button onClick={fetchTransactions} style={{ padding: "5px 10px" }}>
                    {loading ? "Cargando..." : "Consultar Transacciones"}
                </button>
            </div>

            <h2>Usuarios que enviaron TON</h2>
            <ul>
                {transactions.map((tx, index) => (
                    <li key={index}>
                        <p><strong>Usuario:</strong> {tx.user}</p>
                        <p><strong>Cantidad total enviada:</strong> {tx.totalTon} TON</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TONTracker;
