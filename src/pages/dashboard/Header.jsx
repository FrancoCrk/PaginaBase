import React from "react";

export default function Header() {
  return (
    <header className="flex items-center justify-between bg-white shadow px-6 py-4">
      <h1 className="text-xl font-bold">Dashboard</h1>
      <div className="flex items-center space-x-4">
        <input
          type="text"
          placeholder="Buscar..."
          className="border rounded px-3 py-1 text-sm"
        />
        <button className="p-2 bg-red-600 text-white rounded">Salir</button>
      </div>
    </header>
  );
}
