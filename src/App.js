import styled from "styled-components"
import HomePage from "./pages/HomePage/HomePage"
import SeatsPage from "./pages/SeatsPage/SeatsPage"
import SessionsPage from "./pages/SessionsPage/SessionsPage"
import SuccessPage from "./pages/SuccessPage/SuccessPage"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useState } from "react"

export default function App() {

    const [sessoes, setSessoes] = useState([]);
    const [assentos, setAssentos] = useState([]);
    const [reserva, setReserva] = useState({
        seat: [], name: '', cpf: '', movie: '', day: '', section: ''
    });
    const [sucesso, setSucesso] = useState(false);
    //const [assentoSelecionado, setAssentoSelecionado] = useState([]);

    return (
        <BrowserRouter>
           <NavContainer>CINEFLEX</NavContainer>

            <Routes>
                <Route path="/" element={<HomePage />}/>
                <Route path="/sessoes/:idFilme" element={<SessionsPage sessoes={sessoes} setSessoes={setSessoes} /> }/>
                <Route path="/assentos/:idSessao" element={<SeatsPage assentos={assentos} setAssentos={setAssentos} sessoes={sessoes} reserva={reserva} setReserva={setReserva} />}/>
                <Route path="/sucesso" element={<SuccessPage assentos={assentos} reserva={reserva} setSucesso={setSucesso} />}/>
            </Routes>
            
        </BrowserRouter>
    )
}

const NavContainer = styled.div`
    width: 100%;
    height: 70px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #C3CFD9;
    color: #E8833A;
    font-family: 'Roboto', sans-serif;
    font-size: 34px;
    position: fixed;
    top: 0;
    a {
        text-decoration: none;
        color: #E8833A;
    }
`
