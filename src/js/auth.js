document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    let isRegisterMode = false;

    // Lógica para alternar entre as abas "Entrar" e "Criar minha conta"
    if (tabButtons.length >= 2) {
        tabButtons[0].addEventListener('click', (e) => {
            e.preventDefault();
            tabButtons[0].classList.add('active');
            tabButtons[1].classList.remove('active');
            isRegisterMode = false;
            
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            if (submitBtn) submitBtn.textContent = 'Acessar';
        });

        tabButtons[1].addEventListener('click', (e) => {
            e.preventDefault();
            tabButtons[1].classList.add('active');
            tabButtons[0].classList.remove('active');
            isRegisterMode = true;
            
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            if (submitBtn) submitBtn.textContent = 'Cadastrar';
        });
    }

    // Envio do formulário (Login ou Cadastro)
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            // Define se vai chamar a API de login ou de registro
            const endpoint = isRegisterMode ? 'api/register.php' : 'api/login.php';

            try {
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                
                const result = await response.json();
                
                if (result.success) {
                    if (isRegisterMode) {
                        alert('Conta criada com sucesso! Faça login para continuar.');
                        // Volta para a aba de entrar automaticamente
                        tabButtons[0].click();
                        loginForm.reset();
                    } else {
                        // Redireciona para o dashboard
                        window.location.href = 'dashboard.html';
                    }
                } else {
                    alert(result.message || 'Ocorreu um erro.');
                }
            } catch (error) {
                console.error("Erro na requisição:", error);
                alert("Erro ao conectar com o servidor.");
            }
        });
    }
});