package br.com.arrowdata.generic.exception;

public class BadRequestException extends Exception{

	private static final long serialVersionUID = -1438475616455519953L;

	private final String campo;
	private final String mensagem;

	public BadRequestException(String campo, String mensagem) {
		super();
		this.campo = campo;
		this.mensagem = mensagem;
	}

	public String getMensagem() {
		return mensagem;
	}

	public String getCampo() {
		return campo;
	}

}
