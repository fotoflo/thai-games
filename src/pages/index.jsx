import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const GameCard = ({ title, subtitle, imageSrc }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden">
    <Image src={imageSrc} alt={title} width={300} height={200} className="w-full object-cover" />
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <p className="text-gray-600">{subtitle}</p>
    </div>
  </div>
);

const HomePage = () => {
  const games = [
    {
      title: "Type Thai",
      subtitle: "The Thai alphabet and keyboard learning game",
      imageSrc: "/type-thai.jpg",
      link: "/type-thai"
    },
    {
      title: "Multiply with Chinese",
      subtitle: "The multiplication game with Chinese Rhyming",
      imageSrc: "/multiply-chinese.jpg",
      link: "/multiply-with-chinese"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">Thai Games</h1>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold mb-6">Our Games</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game, index) => (
            <Link href={game.link} key={index}>
              <GameCard {...game} />
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default HomePage;