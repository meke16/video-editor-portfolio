import React, { useEffect, useState } from 'react';
import { getServices } from '../services/firebase';
import { Film, Scissors, Zap } from 'lucide-react';

const iconMap = [Scissors, Zap, Film];

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getServices();
        setServices(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  return (
    <div className="section page-services">
      <div className="container">
        <h1 className="section-title text-center services-title">
          My <span className="text-accent">Services</span>
        </h1>

        {loading ? (
          <div className="services-loading">
            <div className="loading-spinner" />
            <p>Loading services...</p>
          </div>
        ) : (
          <div className="services-grid">
            {services.map((service, idx) => {
              const Icon = iconMap[idx % 3];
              return (
                <article key={service.id} className="service-card">
                  <div className="service-icon">
                    <Icon size={40} strokeWidth={1.5} />
                  </div>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                </article>
              );
            })}
          </div>
        )}

        {!loading && services.length === 0 && (
          <p className="text-center text-muted">No services added yet.</p>
        )}
      </div>
    </div>
  );
};

export default Services;
