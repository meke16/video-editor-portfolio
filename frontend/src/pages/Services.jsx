import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Film, Scissors, Zap } from 'lucide-react';

const Services = () => {
    const [services, setServices] = useState([]);

    const API_URL = import.meta.env.VITE_API_URL;
    useEffect(() => {
        axios.get(`${API_URL}/services`)
            .then(res => setServices(res.data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="section container">
            <h1 className="text-center" style={{ marginBottom: '50px' }}>My <span className="text-accent">Services</span></h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                {services.length > 0 ? services.map((service, idx) => (
                    <div key={service.id} style={{
                        background: '#121212',
                        padding: '30px',
                        borderRadius: '10px',
                        border: '1px solid #222',
                        textAlign: 'center',
                        transition: '0.3s'
                    }}>
                        <div style={{ color: 'var(--accent-red)', marginBottom: '20px' }}>
                            {idx % 3 === 0 ? <Scissors size={40} /> : idx % 3 === 1 ? <Zap size={40} /> : <Film size={40} />}
                        </div>
                        <h3 style={{ marginBottom: '15px' }}>{service.title}</h3>
                        <p style={{ color: '#aaa' }}>{service.description}</p>
                    </div>
                )) : (
                    <p>Loading services...</p>
                )}
            </div>
        </div>
    );
};

export default Services;
