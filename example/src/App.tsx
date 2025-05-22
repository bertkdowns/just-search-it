
import './App.css'
import { CommandProvider} from 'just-search-it'
import RegisterHello from './components/RegisterHello'
import RegisterName from './components/RegisterName'
import RegisterGroup from './components/RegisterGroup'
import CommandPallette from './commandPallette/CommandPallette'
import InputDialog from './inputHandler/InputHandler'
import RegisterModeChange from './components/RegisterModeChange'
import { TestStateUpdates } from './components/TestStateUpdates'

function App() {

  return (
    <CommandProvider>
      <div className="w-screen">
        <h1>Just search it</h1>
        <CommandPallette />
        <InputDialog />
        <RegisterHello />
        <RegisterModeChange />
        <RegisterName name="John Doe" />
        <RegisterName name="Jane Doe" />
        <RegisterName name="Alice" />
        <RegisterName name="Bob" />
        <RegisterGroup group="group1" />
        <RegisterGroup group="group2" />
        <RegisterGroup group="group3" />
        <RegisterGroup group="group4" />
        <TestStateUpdates />
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
