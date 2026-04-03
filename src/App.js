import './App.css';
import InvoicePage from "./InvoicePage";

function App() {
  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div>
            <h1 className="logo">G-TEK MOTORS & LAB INSTRUMENT</h1>
            <p className="tagline">Smart Invoice Generator</p>
          </div>
        </div>
      </header>

      <main className="main">
        <InvoicePage />
      </main>
    </div>
  );
}

export default App;
