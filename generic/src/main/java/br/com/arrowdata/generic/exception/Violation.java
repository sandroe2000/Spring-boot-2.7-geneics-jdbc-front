package br.com.arrowdata.generic.exception;

public class Violation {

	private final String campo;
	private final String mensagem;
	
	public Violation(String campo, String mensagem) {
		super();
		this.campo = campo;
		this.mensagem = mensagem;
	}
	
	public String getCampo() {
		return campo;
	}
	public String getMensagem() {
		return mensagem;
	}

}