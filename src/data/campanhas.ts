import { Campanha } from '../types';
import convencaoImg from '../assets/images/convencao_rio_janeiro_1789845960631.jpg';
import legendariosImg from '../assets/images/programa_legendarios_1789845975377.jpg';
import macbookImg from '../assets/images/macbook_midnight_desk_1789846273810.jpg';
import motoImg from '../assets/images/moto_eletrica_urban_1789846357114.jpg';
import jerusalemImg from '../assets/images/viagem_jerusalem_sunset_1789846006112.jpg';
import hrvImg from '../assets/images/honda_hrv_scenic_1789846372522.jpg';

export const RECORRENCIA_PADRAO = 0.0032; // 0,32%
export const VALOR_TAC_POR_CLIENTE = 49.90; // R$ 49,90 por cliente novo

export const CAMPANHAS: Campanha[] = [
  {
    id: 0,
    nome: "1.5 MM",
    premio: "Ingresso Convenção RJ",
    meta: 1500000,
    descricao: "Ingresso garantido para o evento mais esperado do ano no Rio de Janeiro!",
    imagemUrl: convencaoImg,
    emoji: "🏖️"
  },
  {
    id: 1,
    nome: "3 MM",
    premio: "Programa de Desenvolvimento Pessoal",
    meta: 3000000,
    descricao: "Capacitação de alto impacto para impulsionar suas habilidades e carreira profissional.",
    imagemUrl: legendariosImg,
    emoji: "⛰️"
  },
  {
    id: 2,
    nome: "5 MM",
    premio: "MacBook",
    meta: 5000000,
    descricao: "Tecnologia de ponta Apple para máxima produtividade nas suas operações e negócios.",
    imagemUrl: macbookImg,
    emoji: "💻"
  },
  {
    id: 3,
    nome: "7.5 MM",
    premio: "Moto Elétrica",
    meta: 7500000,
    descricao: "Mobilidade sustentável, tecnologia moderna e economia para o seu dia a dia.",
    imagemUrl: motoImg,
    emoji: "🛵"
  },
  {
    id: 4,
    nome: "10 MM",
    premio: "Viagem Internacional",
    meta: 10000000,
    descricao: "Experiência global inesquecível e exclusiva para o consultor em um destino internacional memorável.",
    imagemUrl: jerusalemImg,
    emoji: "✈️"
  },
  {
    id: 5,
    nome: "15 MM",
    premio: "Honda HR-V 0 KM",
    meta: 15000000,
    descricao: "O ápice do reconhecimento: um SUV novo na sua garagem premiando sua liderança!",
    imagemUrl: hrvImg,
    emoji: "🚗"
  }
];
