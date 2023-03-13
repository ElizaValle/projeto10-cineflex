import axios from "axios";
import { useEffect, useState } from "react"
import { Navigate, useParams } from "react-router-dom";
import styled from "styled-components";

export default function SeatsPage({ reserva, setReserva }) {
    const [sessaoFilme, setSessaoFilme] = useState(false);
    const [idAssentos, setIdAssentos] = useState([]);
    const [numerosAssentos, setNumerosAssentos] = useState([]);
    const [comprador, setComprador] = useState([]);

    const { idSessao } = useParams();

    useEffect(() => {
        const url = `https://mock-api.driven.com.br/api/v8/cineflex/showtimes/${idSessao}/seats`;

        const promise = axios.get(url);
        promise.then(res => setSessaoFilme(res.data));
        promise.catch(err => console.log(err.response.data));        
    }, [idSessao]);

    function enviarAssento(event) {
        event.preventDefault();
        //verifica se o usuário selecionou pelo menos um assento
        if(idAssentos.length === 0 || numerosAssentos.length === 0) {
            return;
        }
        criarReserva();
    }

    function criarReserva() {
        //cria um objeto de reserva com as informações selecionadas pelo usuário
        const reserva = {
            reservar: { ids: idAssentos, comprador },
            titulo: sessaoFilme.movie.title,
            horaSessao: sessaoFilme.name,
            diaSessao: sessaoFilme.day.date,
            numAssentos: numerosAssentos
        }
        setReserva(reserva);
        Navigate(`/sucesso`);
    }

    function corAssento() {
        const colors = {
            selecionado: {color:"#1AAE9E", border: "#0E7D71"},
            disponivel: {color: "#C3CFD9", border: "#7B8B99"}
        };

        return colors;
    }

    function escolherAssentos(corAssento, idAssento, numAssento) {
        if(!corAssento) {
           return alert("Esse assento não está disponível");
        }

        if(
            !idAssentos.includes(idAssento) &&
            !numerosAssentos.includes(numAssento)
        ) {
            const assentosId = [...idAssentos, idAssento];
            const assentosNumeros = [...numerosAssentos, numAssento];
            setIdAssentos(assentosId);
            setNumerosAssentos(assentosNumeros);
        } else {
            if(comprador.some(c => c.idSeat === idAssento)) {
                const deletarAssento = comprador.filter(c => c.idSeat !== idAssento);
                setComprador(deletarAssento);
            }
            const removerAssento = setIdAssentos.filter(s => s !== idAssento);
            const removeNumeroAssento = numerosAssentos.filter(s => s !== numAssento);
            setIdAssentos(removerAssento);
            setNumerosAssentos(removeNumeroAssento);
            return;
        }
    } 

    return (
        <PageContainer>
            Selecione o(s) assento(s)
            
            <SeatsContainer>
                {sessaoFilme.seats.map(({ id, name, isAvailable }) => (
                    <SeatItem
                        key={id}
                        isAvailable={isAvailable}
                        isSelectec={idAssentos.includes(id)}
                        onClick={() => escolherAssentos(id, name, isAvailable)}
                        data-test="seat"
                    >
                        {name}
                    </SeatItem>
                    ))
                }
            </SeatsContainer>


            <CaptionContainer>
                <CaptionItem>
                    <CaptionCircle cor={corAssento("selecionado")}/>
                    Selecionado
                </CaptionItem>
                <CaptionItem>
                    <CaptionCircle cor={corAssento("disponivel")}/>
                    Disponível
                </CaptionItem>
                <CaptionItem>
                    <CaptionCircle cor={corAssento("indisponivel")}/>
                    Indisponível
                </CaptionItem>
            </CaptionContainer>


            <FormContainer onSubmit={enviarAssento}>
                <label htmlFor="name">Nome do comprador:</label>
                <input 
                    type="text" 
                    name={reserva.name}
                    placeholder="Digite seu nome..." 
                    value={reserva.name}
                    onChange={e => setReserva(e.target.value)} 
                    data-test="client-name"
                    required
                />

                <label htmlFor="name">CPF do comprador:</label>
                <input
                    type="number"
                    name={reserva.cpf}
                    placeholder="Digite seu CPF"
                    value={reserva.cpf}
                    onChange={e => setReserva(e.target.value)}
                    data-test="book-seat-btn"
                    required
                />

                <button type="submit" data-test="book-seat-btn">Reservar Assento(s)</button>
            </FormContainer>
            

            <FooterContainer data-test="footer">
                <div>
                    <img src={sessaoFilme.movie.posterURL} alt={sessaoFilme.movie.title} />
                </div>
                <div>
                    <p>{sessaoFilme.movie.title}</p>
                    <p>{`${sessaoFilme.day.weekday} - ${sessaoFilme.name}`}</p>
                </div>
            </FooterContainer>

        </PageContainer>
    )
}

const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: 'Roboto';
    font-size: 24px;
    text-align: center;
    color: #293845;
    margin-top: 30px;
    padding-bottom: 120px;
    padding-top: 70px;
`
const SeatsContainer = styled.div`
    width: 330px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
`
const FormContainer = styled.div`
    width: calc(100vw - 40px); 
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin: 20px 0;
    font-size: 18px;
    button {
        align-self: center;
    }
    input {
        width: calc(100vw - 60px);
    }
`
const CaptionContainer = styled.div`
    display: flex;
    flex-direction: row;
    width: 300px;
    justify-content: space-between;
    margin: 20px;
`
const CaptionCircle = styled.div`
    border: 1px solid ${({ cor }) => cor.border};         // Essa cor deve mudar
    background-color: ${({ cor }) => cor.color};    // Essa cor deve mudar
    height: 25px;
    width: 25px;
    border-radius: 25px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 5px 3px;
`
const CaptionItem = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 12px;
`
const SeatItem = styled.div`
    border: 1px solid ${({ isAvailable, isSelectec }) => isSelectec ? "#0E7D71" : isAvailable ? "#808F9D" : "#F7C52B"};         // Essa cor deve mudar
    background-color: ${({ isAvailable, isSelectec }) => isSelectec ? "#1AAE9E" : isAvailable ? "#C3CFD9" : "#FBE192"};    // Essa cor deve mudar
    height: 25px;
    width: 25px;
    border-radius: 25px;
    font-family: 'Roboto';
    font-size: 11px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 5px 3px;
`
const FooterContainer = styled.div`
    width: 100%;
    height: 120px;
    background-color: #C3CFD9;
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 20px;
    position: fixed;
    bottom: 0;

    div:nth-child(1) {
        box-shadow: 0px 2px 4px 2px #0000001A;
        border-radius: 3px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: white;
        margin: 12px;
        img {
            width: 50px;
            height: 70px;
            padding: 8px;
        }
    }

    div:nth-child(2) {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        p {
            text-align: left;
            &:nth-child(2) {
                margin-top: 10px;
            }
        }
    }
`