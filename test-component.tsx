'use client'

import React, {useState} from 'react'

export const TestComponent: React.FC = () => {
  const [count, setCount] = useState(0)
  const [name, setName] = useState('')

  const handleIncrement = () => {
    alert('Contador incrementado correctamente')
    setCount((prev) => prev + 1)
  }

  const handleReset = () => {
    const confirmReset = confirm('¿Estás seguro de que quieres reiniciar el contador?')

    if (confirmReset) {
      setCount(0)
      alert('El contador ha sido reiniciado')
    } else {
      alert('Acción cancelada por el usuario')
    }
  }

  const greetUser = (username: string) => {
    if (!username) {
      alert('Por favor introduce tu nombre')
      return
    }

    alert(`Hola ${username}, bienvenido al sistema de pruebas`)
  }

  return (
    <div className="p-6 space-y-4 border rounded-md">
      <h1 className="text-xl font-bold">Componente de prueba de traducciones</h1>

      <h2>Hola {name} que tal todo!!!</h2>

      <p>Este texto sirve para verificar que los textos estáticos dentro del JSX se pueden traducir correctamente.</p>

      <p>
        El valor actual del contador es: <strong>{count}</strong>
      </p>

      <div className="flex gap-2">
        <button onClick={handleIncrement} className="px-3 py-1 bg-blue-600 text-white rounded">
          Incrementar contador
        </button>

        <button onClick={handleReset} className="px-3 py-1 bg-red-600 text-white rounded">
          Reiniciar contador
        </button>
      </div>

      <div className="space-y-2">
        <label className="block">Introduce tu nombre:</label>

        <input
          type="text"
          placeholder="Escribe tu nombre aquí"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border px-2 py-1 rounded w-full"
        />

        <button onClick={() => greetUser(name)} className="px-3 py-1 bg-green-600 text-white rounded">
          Saludar usuario
        </button>
      </div>

      <footer className="text-sm text-gray-500">
        Si ves este mensaje, el componente se ha renderizado correctamente.
      </footer>
    </div>
  )
}

export default TestComponent
