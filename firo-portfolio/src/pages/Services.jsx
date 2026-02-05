import React, { useEffect, useState } from 'react';
import { getServices } from '../services/firebase';
import { Film, Scissors, Zap } from 'lucide-react';

const Services = () => {
    const [services, setServices] = useState([]);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const data = await getServices();
                setServices(data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchServices();
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
