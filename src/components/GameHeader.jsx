import Link from 'next/link';

const GameHeader = ({ title, darkMode }) => {
  return (
    <div className={`flex items-center gap-4 mb-4 ${darkMode ? 'text-white' : 'text-black'}`}>
      <Link href="/">
        <button className="hover:opacity-70 transition-opacity">
          ← Back
        </button>
      </Link>
      <h1 className="text-3xl font-bold">{title}</h1>
    </div>
  );
};

export default GameHeader;