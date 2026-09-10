import React from 'react';

const founders = [
  {
    name: 'Mohamed Rashid',
    image: '/Mohamed Rashid.jpg',
    role: 'Founder',
  },
  {
    name: 'Mohammed Waseem Ameen',
    image: '/Mohammed Waseem Ameen.jpeg',
    role: 'Founder',
  },
  {
    name: 'Shoaib Ahmed Sheriff',
    image: '/Shoaib Ahmed Sheriff.jpg',
    role: 'Founder',
  },
];

const Founders: React.FC = () => {
  return (
    <div className="min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-black font-display mb-4 tracking-tight">MEET THE FOUNDERS</h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            The team behind Crescent Fitness Club. Dedicated to building a community of strength, discipline, and wellness.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {founders.map((founder) => (
            <div key={founder.name} className="flex flex-col items-center group">
              <div className="w-64 h-64 md:w-72 md:h-72 rounded-full overflow-hidden mb-6 border-4 border-white/5 group-hover:border-primary transition-colors duration-300 relative shadow-2xl">
                <img
                  src={founder.image}
                  alt={founder.name}
                  className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mix-blend-overlay"></div>
              </div>
              <h3 className="text-2xl font-bold font-display text-white mb-1 group-hover:text-primary transition-colors text-center">{founder.name}</h3>
              <p className="text-sm font-bold tracking-widest uppercase text-gray-500">{founder.role}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Founders;
