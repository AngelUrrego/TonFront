import React, { useState } from "react";
import TonWeb from "tonweb";
import QRCode from "qrcode.react";
import { useNavigate } from "react-router-dom";


const TONTracker = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);

    const contractAddress = "EQB9SktUHyZdb9y8maBaWrAtkIzJTJYq4NIilRhnMEfiXxac";

    const tonweb = new TonWeb(
        new TonWeb.HttpProvider("https://toncenter.com/api/v2/jsonRPC", {
        })
    );

    const navigate = useNavigate();

    // Función auxiliar para formatear valores TON
    const formatTONValue = (value) => {
        // Asegura que el número tenga hasta 7 decimales sin notación científica
        return Number(value.toFixed(7)).toString();
    };

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const contractAddressHex = new TonWeb.Address(contractAddress).toString(true, true, true);
            const txList = await tonweb.provider.getTransactions(contractAddressHex);

            const userTransactions = {};
            txList.forEach((tx) => {
                const sender = tx.in_msg.source;
                const valueInTon = tx.in_msg.value / 1e9;
                const transactionHash = Buffer.from(tx.transaction_id.hash, "base64").toString("hex");
                // Verifica el estado real de la transacción
                const status = tx.utime > 0 ? "confirmed" : "pending";

                if (userTransactions[sender]) {
                    userTransactions[sender].totalTon += valueInTon;
                    userTransactions[sender].transactions.push({
                        hash: transactionHash,
                        value: formatTONValue(valueInTon),
                        status,
                    });
                } else {
                    userTransactions[sender] = {
                        totalTon: valueInTon,
                        transactions: [
                            {
                                hash: transactionHash,
                                value: formatTONValue(valueInTon),
                                status,
                            },
                        ],
                    };
                }
            });

            const transactionsData = Object.keys(userTransactions).map((user) => ({
                user,
                totalTon: formatTONValue(userTransactions[user].totalTon),
                transactions: userTransactions[user].transactions,
            }));

            setTransactions(transactionsData);
        } catch (error) {
            console.error("Error al obtener transacciones:", error);
            alert("Ocurrió un error al obtener las transacciones.");
        }
        setLoading(false);
    };

    const viewUserTransactions = (user) => {
        navigate(`/transactions/${user.user}`, { 
            state: { 
                user: user.user, 
                transactions: user.transactions 
            } 
        });
    };

    return (
        <div>
            <QRCode value={`ton://transfer/${contractAddress}`} />
            <p>
                <strong>Scan the QR to send TON to the contract</strong>
            </p>
            <a
                target="_blank"
                rel="noopener noreferrer"
                href={`https://tonscan.org/address/${contractAddress}#events`}
            >
                Contract
            </a>

            <h1>TON Tracker</h1>
            <button onClick={fetchTransactions}>
                {loading ? "Loading..." : "Consult Transactions"}
            </button>

            <h2>Users who sent TON</h2>
            <ul>
                {transactions.map((tx, index) => (
                    <li key={index}>
                        <p>
                            <strong>User:</strong> {tx.user}
                        </p>
                        <p>
                            <strong>Total amount sent:</strong> {tx.totalTon} TON
                        </p>
                        <button onClick={() => viewUserTransactions(tx)}>
                            See all transactions
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TONTracker;