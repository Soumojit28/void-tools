import Head from 'next/head';
import Link from 'next/link';


export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>Void Web3 Tool by Soumojit Ash</title>
        <meta name="description" content="Explore web3 tools by Soumojit Ash for Ethereum and blockchain applications." />
        <link rel="icon" href="/favicon.ico" />
      </Head>


      <main className="flex-grow flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-purple-500 text-white">
        <h1 className="text-4xl font-bold mb-4">Void Web3 Tool</h1>
        <p className="text-lg mb-8">Explore web3 tools by Soumojit Ash</p>
        <Link legacyBehavior href="/eip712-signature">
          <a className="bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg shadow-lg font-semibold transition duration-300 block text-center">
            EIP712 Signature Tool
          </a>
        </Link>
        {/* Add more tool buttons and content here */}
      </main>


    </div>
  );
}