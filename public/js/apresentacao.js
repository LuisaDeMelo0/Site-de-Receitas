
const API_URL = 'http://localhost:3000/receitas'; 

async function criarGraficoReceitas() {
    try {
        const resposta = await fetch(API_URL);
        const receitas = await resposta.json();

        const contagemPorCategoria = {};

        receitas.forEach(receita => {
            const categoria = receita.categoria; 

            if (contagemPorCategoria[categoria]) {
                contagemPorCategoria[categoria]++;
            } else {
                contagemPorCategoria[categoria] = 1;
            }
        });

        const labels = Object.keys(contagemPorCategoria);    
        const dados = Object.values(contagemPorCategoria);   

        const ctx = document.getElementById('graficoPizza').getContext('2d');
        
        new Chart(ctx, {
            type: 'pie', 
            data: {
                labels: labels, 
                datasets: [{
                    data: dados,
                    backgroundColor: [
    'rgba(215, 73, 22, 0.9)',    
    'rgba(0, 31, 63, 0.9)',      
    'rgba(255, 165, 0, 0.8)',    
    'rgba(3, 107, 252, 0.8)',    
    'rgba(180, 50, 0, 0.8)',     
    'rgba(0, 60, 120, 0.8)',     
    'rgba(255, 204, 153, 0.8)',  
],
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            font: {
                                size: 18 
                            }
                        }
                    },
                    title: {
                        display: true,
                        text: 'Distribuição de Receitas por Categoria',
                        font: {
                            size: 30, 
                            weight: 'bold'
                        }
                    }
                }
            }
        });

    } catch (error) {
        console.error('Erro ao buscar ou desenhar o gráfico:', error);
    }
}


criarGraficoReceitas();