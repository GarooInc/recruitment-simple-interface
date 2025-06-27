import './App.module.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import { WorkerProvider } from './config/WorkerProvider.jsx';
import Workers from './pages/Workers';

function App() {
  return (

    <WorkerProvider>

      <main className='min-vh-100 border border-5 rounded p-3'>
        <Workers />
      </main>

    </WorkerProvider>

  );
}

export default App;