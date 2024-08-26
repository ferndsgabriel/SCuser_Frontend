import Gmodal from "../default";
import style from "./styles.module.scss";
import {AiOutlineClose} from "react-icons/ai";   


export default function TermsModal({isOpen, onClose}){
    return(
        <Gmodal isOpen={isOpen} onClose={onClose}>
            <div className={style.container}>
                <div className={style.termos}>
                    <button onClick={onClose}>
                        <AiOutlineClose/>
                    </button>
                    <div className={style.textArea}>
                        <h1>Termos de Uso do SalãoCondo - Moradores</h1>
                        <p>Estes Termos de Uso ("Termos") regem o uso do software "SalãoCondo", desenvolvido no Projeto Interdisciplinar da Fatec, para controlar o salão de festa do Condomínio Edifício Prudência. Ao utilizar este software, você concorda em cumprir estes Termos. Se você não concordar com esses Termos, não use o software.</p>

                        <h2>1. Cadastro e Aprovação de Usuário</h2>

                        <p>1.1. Ao se cadastrar no SalãoCondo, você deve fornecer as seguintes informações: CPF, nome, sobrenome, email, senha e número de telefone.</p>

                        <p>1.2. Para concluir o cadastro, você também deve fornecer o número do apartamento ao qual está associado.</p>

                        <p>1.3. Após o cadastro, as informações (nome, telefone e email) serão enviadas ao administrador para aprovação.</p>

                        <p>1.4. O administrador tem o direito de aprovar ou recusar seu cadastro. Em caso de recusa, suas informações serão excluídas da base de dados.</p>

                        <h2>2. Perfil do Usuário</h2>

                        <p>2.1. Na guia "Perfil", você pode visualizar seu telefone, sua foto de perfil e o status do pagamento.</p>

                        <p>2.2. Você pode alterar seu telefone nesta seção.</p>

                        <h2>3. Agendamento do Salão de Festas</h2>

                        <p>3.1. O agendamento do salão de festas só é possível se o condomínio estiver com o status "ativo" (pago).</p>

                        <p>3.2. Na tela de agendamento, você verá um calendário com os seguintes indicadores:</p>

                        <ul>
                            <li>Dias em cinza: Dias passados.</li>
                            <li>Dias em vermelho: Dias com agendamentos (indisponíveis).</li>
                            <li>Dias em preto: Dias livres para agendamento.</li>
                        </ul>

                        <p>3.3. Você pode selecionar um dia disponível para agendar o salão. Também pode escolher incluir a taxa de limpeza de R$ 80,00.</p>

                        <p>3.4. O administrador precisa validar ou não a reserva. Em caso de negação, a reserva será excluída; em caso de aprovação, o status mudará de "aguardando resposta" (cinza) para "aprovada" (verde).</p>

                        <h2>4. Lista de Convidados</h2>

                        <p>4.1. Após a aprovação da reserva, você pode passar a lista de convidados na seção "Lista de Convidados". Apenas a última lista enviada será considerada.</p>

                        <h2>5. Serviço de Limpeza</h2>

                        <p>5.1. Você pode indicar se deseja serviço de limpeza. O administrador pode acessar essa informação.</p>

                        <h2>6. Configurações da Conta</h2>

                        <p>6.1. Em "Configurações", você pode atualizar sua senha.</p>

                        <p>6.2. Você também pode excluir sua conta, o que resultará na exclusão permanente de seus dados da base de dados.</p>

                        <h2>7. Recuperação de Senha</h2>

                        <p>7.1. Se você esqueceu sua senha, você pode solicitar um código de recuperação por SMS ou e-mail, ambos associados à sua conta.</p>

                        <h2>8. Reservas Canceladas</h2>

                        <p>8.1. Reservas aprovadas pelo morador (em verde) que forem canceladas com 2 dias de antecedência serão taxadas em R$ 100,00. Isso será alertado ao usuário ao tentar cancelar uma reserva.</p>

                        <h2>9. Notificações via SMS e e-mail</h2>

                        <p>9.1. Ações como aprovação ou recusa de conta, status de reserva e taxas são enviadas via SMS e e-mail.</p>
                    </div>
                </div>
            </div>
        </Gmodal>
    )
}