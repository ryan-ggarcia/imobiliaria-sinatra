export default function Button({funcao,type='button',texto}){
    return(
        <button type={type} onClick={typeof funcao ? funcao : undefined} >
            {texto}
        </button>
    )
}