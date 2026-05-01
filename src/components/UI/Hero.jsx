import React from 'react';

const Hero = ({ title, subtitle, image }) => {
  return (
    <section className="relative bg-cover bg-center h-96" style={{ backgroundImage: image ? `url(${image})` : 'none' }}>
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-white text-center">
        <h1 className="text-4xl md:text-5xl font-serif mb-4">{title}</h1>
        {subtitle && <p className="text-xl md:text-2xl">{subtitle}</p>}
      </div>
    </section>
  );
};

export default Hero;