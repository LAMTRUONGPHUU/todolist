import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white gap-6">
        <h1 className="text-4xl font-bold text-red-500">
          Tailwind is working 🚀
        </h1>

        <button
          className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg"
          onClick={() => setCount(count + 1)}
        >
          Count: {count}
        </button>
      </div>
    </>
  )
}

export default App
