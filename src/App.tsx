import { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';
import './App.css';

const Globalstyle = createGlobalStyle`
  ${reset}
`

function App() {
  return (
    <div className="App">
      <Globalstyle />
    </div>
  );
}

export default App;