
import './App.css'
import {CommandProvider} from 'just-search-it'

function App() {

  return (
    <CommandProvider>
      <h1>Vite + React</h1>
      <div className="card">
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
    </CommandProvider>
  )
}

export default App
