
import './App.css'
import { CommandPallette, CommandProvider } from 'just-search-it'
import RegisterHello from './components/RegisterHello'

function App() {

  return (
    <CommandProvider>
      <div className="w-screen">
        <h1>Vite + React</h1>
        <CommandPallette />
        <RegisterHello />
        <div className="card bg-blue-300">
          <p>
            Edit <code>src/App.tsx</code> and save to test HMR
          </p>
        </div>
      </div>
    </CommandProvider>
  )
}

export default App
