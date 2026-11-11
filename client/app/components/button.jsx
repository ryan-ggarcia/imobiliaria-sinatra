export default function Button({funcao,type='button',texto,className='btn btn-primary'}){
    return(
        <button type={type} className={className} onClick={typeof funcao ? funcao : undefined} >
            {texto}
        </button>
    )
}