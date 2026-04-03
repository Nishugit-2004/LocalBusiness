
import React from 'react';

const Card = ({ user }) => {
    return (
        <div className="order-card">
            Name:{user.name} <br/>
            Email:{user.email} <br />
            {user.phone && (
                <>
                    Phone: {user.phone} <br />
                </>
            )}
        </div>
    );
}

export default Card;
