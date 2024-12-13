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
      link: "/type-thai",
      remixLink: "https://claude.site/artifacts/e27f6dfd-5dd5-4d0f-918f-09a3a275143b"
    },
    {
      title: "Multiply with Chinese",
      subtitle: "The multiplication game with Chinese Rhyming",
      imageSrc: "/multiply-chinese.jpg",
      link: "/multiply-with-chinese",
      remixLink: "https://claude.site/artifacts/5cff321a-c639-44cb-8f04-c8fabe68f640"
    },
    {
      title: "Reading Thai",
      subtitle: "Learn to read Thai with interactive exercises",
      imageSrc: "/reading-thai.png", // Add your image path
      link: "/reading-thai", // Link to the new page
      remixLink: "https://claude.site/artifacts/f643497b-513f-45e6-a6cd-5f31782df245"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">AI Games</h1>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold mb-6">Our Games</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game, index) => (
            <div key={index} className="flex flex-col">
              <Link href={game.link}>
                <GameCard {...game} />
              </Link>
              <Link href={game.remixLink} target="_blank" rel="noopener noreferrer">
                <button className="mt-2 w-full bg-purple-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-purple-700 transition-colors">
                  Remix with Claude AI
                </button>
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default HomePage;