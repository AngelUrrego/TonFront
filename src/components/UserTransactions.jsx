import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const UserTransactions = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, transactions } = location.state || { user: "Usuario desconocido", transactions: [] };

    return (
        <div>
            <button onClick={() => navigate(-1)}>Volver</button>
            <h2>User Transactions: {user}</h2>
            <ul>
                {transactions.map((tx, index) => (
                    <li key={index}>
                        <p>
                            <strong>State:</strong> {tx.status}
                        </p>
                        <p>
                            <strong>Worth:</strong> {tx.value} TON
                        </p>
                        <p>
                            <strong>Hash:</strong>{" "}
                            <a
                                href={`https://tonscan.org/tx/${tx.hash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                View transaction
                            </a>
                        </p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserTransactions;