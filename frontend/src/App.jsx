import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
// import A from './Pages/A'
import RepayLoan from './Pages/RepayLoan'
import AddCollateral from './Pages/AddCollateral'
import WithdrawCollateral from './Pages/WithdrawCollateral'
import GetLoan from "./Pages/GetLoan";
import  Liquidate  from "./Pages/Liquidate";


function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/getloan" element={<GetLoan />}></Route>
          <Route path="/repayloan" element={<RepayLoan />}></Route>
          <Route path="/addcollateral" element={<AddCollateral />}></Route>
          <Route path="/withdrawcollateral" element={<WithdrawCollateral />}></Route>
          <Route path="/liquidate" element={<Liquidate />}></Route>

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;