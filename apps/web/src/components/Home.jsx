import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 -mt-16 text-center">
      <div className="p-8">
        <h1 className="text-4xl font-bold text-gray-800 md:text-5xl">
          Bem-vindo ao <span className="text-blue-600">FinPlan</span>!
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Sua plataforma definitiva para controle financeiro pessoal.
        </p>
        <div className="mt-8 space-x-4">
          <Link 
            to="/login" 
            className="px-6 py-3 font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition-colors"
          >
            Fazer Login
          </Link>
          <Link 
            to="/register" 
            className="px-6 py-3 font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg shadow-md hover:bg-gray-100 transition-colors"
          >
            Criar Conta
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;